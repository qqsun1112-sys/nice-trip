# 第一階段 WELCOME50：最小串接方案（無 LINE API）

**確認：不串接 LINE 程式、不檢查 LINE 身分、不同步 LINE 核銷。** LINE 僅展示固定碼 WELCOME50。網站獨立驗證固定碼、適用活動、期限和票價。無須額外建立 LINE 資料表、會員綁定或一次性碼服務。

## 既有報名頁的最小改動
檔案 `activity-register.html`：
1. 只在付費報名區新增「優惠碼（選填）」輸入框。免費活動不顯示。
2. 送出資料的 `p` 增加 `coupon_code: couponInput.value.trim()`，不送折扣金額或價格。
3. `calcPrice()` 原價計算保留；若使用者輸入碼，先顯示「折扣以送出後伺服器確認為準」，或新增不建立訂單的報價端點再即時顯示確定金額。**絕不能只在瀏覽器扣 50 元就認定折扣已生效。**
4. API 回應 `coupon_invalid_code`、`coupon_not_eligible`、`coupon_expired` 等錯誤時，顯示繁體中文訊息，停留在報名頁，不建立原價訂單。使用者可自行清除優惠碼，再按原價送出。
5. 成功後一律以伺服器回傳 `total_amount` 為準，顯示應匯款金額。

## 後端的最小改動
現有 `submit-registration` Edge Function v16：
1. 活動查詢新增 `service,welcome50_enabled`。
2. 從活動 `ticket_options` 取得單價，使用 `calculateWelcomeOrder` 同等邏輯計算每位符合資格者 NT$50。
3. `coupon_code` 只能是 WELCOME50；不使用 LINE API；活動開關預設 false。
4. 將 `original_total,promotion_discount,promotion_code,total_amount` 一起交給既有 `create_registration_atomic` RPC。
5. RPC 只增加優惠明細的原子儲存，不改既有鎖活動、容量檢查與狀態邏輯。通知信與後台顯示折扣明細，實際付款金額仍取 `total_amount`。
6. **低票價邊界：** 原價付費票經折扣後變 0 元，不能直接誤判成「公益免費票」。上線前應明確定義狀態和通知；也可先把此邊界排除於優惠適用票種之外，經使用者確認後才調整。

## 不需要做
- LINE Login、LINE Messaging API、Webhook、LINE coupon redemption API
- LINE UID、個人身分核銷、唯一優惠碼產生、跨訂單防重複使用
- 另外購買付費測試環境才能開始寫程式

## 仍需要做
- 修改 Edge Function + RPC + 活動開關欄位並進行隔離測試
- 前端 UI 和通知信整合，確認真實訂單金額與取消流程
- 在獲得使用者正式上線同意前，不變更 main、正式 Supabase、LINE 優惠券

## 重要限制
共用碼可被轉傳；LINE「每人限領一次」與網站使用次數無關。這是已核准的簡化方案，對外不得宣稱網站有 LINE 持券核銷或每人限用一次的功能。
