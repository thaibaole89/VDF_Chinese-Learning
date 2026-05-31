# Forge-attack test — Phase 2A.2a

Mục đích: chứng minh sau khi áp 002 migration, **không nhân viên đã login nào có thể tự
ghi điểm `pass`/`score=100`** trực tiếp vào `voice_attempts` hoặc cập nhật `best_quiz_score`
ngoài đường RPC. Đây là điều kiện trước khi 2A.4 cấp certificate.

> Chạy **sau khi đã apply cả 001 lẫn 002 migration**. Cần ít nhất 1 test user.
> Tất cả test dưới đây gọi vào Supabase REST API trực tiếp — không qua app.

---

## 0. Setup biến môi trường (local terminal)

```bash
export SB_URL="https://bwhpoaunixuqtwzrqvsl.supabase.co"
export ANON_KEY="<dán anon key từ Supabase Dashboard → Settings → API>"
export TEST_EMAIL="test.staff@vdf.test"     # ← test user anh đã tạo
export TEST_PASSWORD="<password test user>"
```

Lấy access_token (JWT của session) — dùng cho mọi request authenticated bên dưới:

```bash
export TOKEN=$(curl -s -X POST "$SB_URL/auth/v1/token?grant_type=password" \
  -H "apikey: $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['access_token'])")
echo "Got token: ${TOKEN:0:30}..."
```

Nếu in ra `Got token: eyJ…` là OK. Nếu báo lỗi → check email/password test user.

---

## Test 1 — Direct INSERT vào `voice_attempts` PHẢI fail

Trước 002: staff được INSERT trực tiếp. Sau 002: REVOKED. Test attack tay:

```bash
curl -s -i -X POST "$SB_URL/rest/v1/voice_attempts" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "user_id": "'"$(echo "$TOKEN" | cut -d. -f2 | base64 -d 2>/dev/null | python3 -c "import sys,json; print(json.load(sys.stdin)['sub'])")"'",
    "phrase_id": "sp_day1_1",
    "transcript": "X",
    "score": 100,
    "result": "pass"
  }' | head -10
```

**Expected:** HTTP `401` hoặc `403` (permission denied / RLS violation).
**Nếu 201 Created → 🔴 LOCKDOWN FAIL, dừng pilot.**

---

## Test 2 — Direct UPDATE `best_quiz_score` PHẢI fail

profiles.role không trong GRANT UPDATE column-list (001). best_quiz_score cũng không (002):

```bash
curl -s -i -X PATCH "$SB_URL/rest/v1/profiles?id=eq.$(echo $TOKEN | cut -d. -f2 | base64 -d 2>/dev/null | python3 -c 'import sys,json; print(json.load(sys.stdin)["sub"])')" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"best_quiz_score": 100}' | head -10
```

**Expected:** HTTP `403` hoặc `204` nhưng `best_quiz_score` KHÔNG đổi (column-grant chặn).
Verify bằng:

```bash
curl -s "$SB_URL/rest/v1/profiles?select=best_quiz_score" \
  -H "apikey: $ANON_KEY" -H "Authorization: Bearer $TOKEN"
```

**Nếu best_quiz_score = 100 → 🔴 FAIL.**

---

## Test 3 — RPC `submit_voice_attempt` đúng cách phải work + tự tính score

```bash
# Match hoàn toàn câu mẫu → score >= 70 = pass
curl -s -X POST "$SB_URL/rest/v1/rpc/submit_voice_attempt" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "p_phrase_id": "sp_day1_1",
    "p_lesson_id": "lesson_day_one_10_phrases",
    "p_transcript": "您好，欢迎光临！"
  }'
```

**Expected:** `[{"score": 100, "result": "pass"}]` (hoặc gần 100). Row vào `voice_attempts`.

```bash
# Transcript rỗng → retry, score thấp
curl -s -X POST "$SB_URL/rest/v1/rpc/submit_voice_attempt" \
  -H "apikey: $ANON_KEY" -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"p_phrase_id":"sp_day1_1","p_lesson_id":"lesson_day_one_10_phrases","p_transcript":""}'
```
**Expected:** `[{"score": 0, "result": "retry"}]`.

---

## Test 4 — RPC IGNORE client-supplied score/result (nếu staff thử nhồi vào params)

RPC signature **không có** `score` hoặc `result` params. Thử nhồi vào → PostgREST sẽ raise.

```bash
curl -s -i -X POST "$SB_URL/rest/v1/rpc/submit_voice_attempt" \
  -H "apikey: $ANON_KEY" -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "p_phrase_id":"sp_day1_1",
    "p_lesson_id":"lesson_day_one_10_phrases",
    "p_transcript":"",
    "score": 100,
    "result": "pass"
  }' | head -15
```

**Expected:** HTTP `404` hoặc `400` với message tương tự *"Could not find the function … with these arguments"* — PostgREST từ chối vì có extra params không khớp signature.
**Pass cả khi error**: kể cả nếu PostgREST silently ignore extra params (cẩn thận check cấu hình), thì RPC code KHÔNG ĐỌC `score`/`result` từ client → row trong voice_attempts vẫn dùng `voice_score()` computed value.

Verify bằng:

```bash
curl -s "$SB_URL/rest/v1/voice_attempts?select=score,result,transcript&order=created_at.desc&limit=1" \
  -H "apikey: $ANON_KEY" -H "Authorization: Bearer $TOKEN"
```

→ Row mới nhất phải có `score=0, result='retry'` (vì transcript rỗng), KHÔNG phải 100/pass.

---

## Test 5 — Unknown phrase_id phải raise

```bash
curl -s -i -X POST "$SB_URL/rest/v1/rpc/submit_voice_attempt" \
  -H "apikey: $ANON_KEY" -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"p_phrase_id":"sp_forge_xxx","p_lesson_id":"x","p_transcript":"X"}' | head -10
```

**Expected:** HTTP `400`/`404` với message *"unknown phrase: sp_forge_xxx"*. Không có row mới trong voice_attempts.

---

## Test 6 — `mark_phrase_learned` validates phrase_id

```bash
# Hợp lệ → OK, void
curl -s -X POST "$SB_URL/rest/v1/rpc/mark_phrase_learned" \
  -H "apikey: $ANON_KEY" -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"p_phrase_id":"sp_day1_1","p_learned":true}'

# Bịa → raise
curl -s -i -X POST "$SB_URL/rest/v1/rpc/mark_phrase_learned" \
  -H "apikey: $ANON_KEY" -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"p_phrase_id":"sp_fake_999","p_learned":true}' | head -10
```

**Expected:** Hợp lệ trả về empty `[]` (returns void) + row vào `phrase_progress`. Bịa → 400/404 *"unknown phrase"*.

---

## Test 7 — `submit_quiz_attempt` validate input

```bash
# Đúng → server tự tính = 8/10 = 80.0
curl -s -X POST "$SB_URL/rest/v1/rpc/submit_quiz_attempt" \
  -H "apikey: $ANON_KEY" -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"p_quiz_id":"qz_day1_1","p_lesson_id":"lesson_day_one_10_phrases","p_correct_count":8,"p_total_count":10}'
# Expected: [{"score": 80.0, "is_best": true}]

# Forge: claim correct=999/total=1
curl -s -i -X POST "$SB_URL/rest/v1/rpc/submit_quiz_attempt" \
  -H "apikey: $ANON_KEY" -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"p_quiz_id":"x","p_lesson_id":"x","p_correct_count":999,"p_total_count":1}' | head -10
# Expected: 400 raise "invalid correct_count: 999 of 1"

# Forge: total=0
curl -s -i -X POST "$SB_URL/rest/v1/rpc/submit_quiz_attempt" \
  -H "apikey: $ANON_KEY" -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"p_quiz_id":"x","p_lesson_id":"x","p_correct_count":0,"p_total_count":0}' | head -10
# Expected: 400 raise "invalid total_count: 0"
```

---

## Test 8 — Manual mark hoạt động (browser không support recognition)

```bash
curl -s -X POST "$SB_URL/rest/v1/rpc/submit_voice_attempt" \
  -H "apikey: $ANON_KEY" -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"p_phrase_id":"sp_day1_2","p_lesson_id":"lesson_day_one_10_phrases","p_manual":true}'
# Expected: [{"score": 0, "result": "manual"}]
```

Row trong `voice_attempts` có `transcript=null, score=null, result='manual'`. Đếm vào `voice_pass_count` (pass OR manual).

---

## Test 9 — Verify aggregates trên profile cập nhật đúng

Sau khi chạy Test 3 + Test 6 + Test 7 + Test 8:

```bash
curl -s "$SB_URL/rest/v1/profiles?select=email,best_quiz_score,voice_pass_count,phrase_learned_count" \
  -H "apikey: $ANON_KEY" -H "Authorization: Bearer $TOKEN"
```

**Expected:** `best_quiz_score=80.0` (từ Test 7), `voice_pass_count >= 2` (sp_day1_1 pass + sp_day1_2 manual), `phrase_learned_count >= 1` (sp_day1_1 mark learned).

---

## Test 10 — Cross-user isolation (RLS)

Tạo user thứ 2 (`test.staff2@vdf.test`) qua Supabase Studio. Lấy TOKEN2 tương tự bước 0.
User 2 phải KHÔNG thấy được dữ liệu của user 1:

```bash
curl -s "$SB_URL/rest/v1/voice_attempts?select=*" \
  -H "apikey: $ANON_KEY" -H "Authorization: Bearer $TOKEN2"
# Expected: [] (chỉ rows của user 2, chưa có dữ liệu)

curl -s "$SB_URL/rest/v1/profiles?select=email,best_quiz_score" \
  -H "apikey: $ANON_KEY" -H "Authorization: Bearer $TOKEN2"
# Expected: chỉ thấy email của user 2, KHÔNG thấy user 1
```

---

## Pass criteria

Tất cả phải xanh ✅ trước khi 2A.4 mở chức năng certificate:

- [ ] Test 1 — Direct INSERT voice_attempts → 401/403
- [ ] Test 2 — Direct UPDATE best_quiz_score → không thay đổi được
- [ ] Test 3 — RPC submit_voice_attempt trả về server-computed score
- [ ] Test 4 — Client-supplied score/result bị ignore
- [ ] Test 5 — Unknown phrase_id raise exception
- [ ] Test 6 — mark_phrase_learned validate phrase_id
- [ ] Test 7 — submit_quiz_attempt clamp + validate correct_count/total_count
- [ ] Test 8 — Manual mark hoạt động (browser fallback)
- [ ] Test 9 — Aggregates update đúng
- [ ] Test 10 — Cross-user isolation OK

Nếu 1 trong 10 fail → **dừng**, debug, không tiến tới 2A.3.

---

## Cleanup sau test

Test inserts vào `voice_attempts` + `phrase_progress` của test user. Nếu muốn reset:

```sql
-- Trong Supabase SQL Editor (admin):
delete from public.voice_attempts where user_id = (
  select id from auth.users where email = 'test.staff@vdf.test'
);
delete from public.phrase_progress where user_id = (
  select id from auth.users where email = 'test.staff@vdf.test'
);
update public.profiles set best_quiz_score = 0, voice_pass_count = 0, phrase_learned_count = 0
  where id = (select id from auth.users where email = 'test.staff@vdf.test');
```
