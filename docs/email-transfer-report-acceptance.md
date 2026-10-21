# Email 匯款回報串接與驗收清單（Issue #77）

## 目前狀態
- 本分支新增 `report-transfer.html`、資料庫 migration、`report-transfer-link` Edge Function 草稿。
- **尚未部署**。寄信模板、token 發行與回報通知整合尚未完成，請勿合併或對外提供連結。
- `submit-registration` 線上版本含「STAGING DRAFT ONLY. DO NOT DEPLOY」註記；部署前必須核對線上 RPC 與完整回歸測試，不得直接覆蓋。

## 後端整合
1. 每次付費報名建立後，伺服器端用 `crypto.getRandomValues(new Uint8Array(32))` 產生 32 bytes 隨機值並轉 64 位 hex。
2. 將 token 的 SHA-256 hex digest 寫入 `registrations.transfer_link_token_hash`，同時設定 `transfer_link_expires_at`。有效期限應至少涵蓋付款截止日，並符合既有取消/逾期規則。不得把 token 寫入記錄、分析事件或管理員通知。
3. 確認 token 寫入成功後，付款待確認通知信加入：
   `https://nicetrip.tw/report-transfer.html#no=<encodeURIComponent(registration_no)>&token=<token>`
   以 HTTPS 發送，連結置於 Email 按鈕「我已完成匯款，立即回報」；既有取消連結原樣保留。
4. 匯款回報成功後，應共用既有 `report-transfer` 管理員待查帳通知流程，確保新舊入口通知一致。回報不得變更為 `confirmed`。
5. 在公開使用前補上 rate limiting、濫用防護、結構化監控與回報事件記錄。若要對既有待付款訂單補發連結，須透過受控的寄信流程，不能在客戶端發行 token。

## 必須通過的測試
- 有效 token 可預覽正確活動、日期、票價（含 WELCOME50 折抵）與人數
- 無效、竄改、過期 token 無法取得資料
- 未付款可回報，已回報不會重複更改，已取消/已核帳/已過期不能回報
- 同時重複送出只有一次狀態更新
- 後台仍需手動核帳，且確認信只在核帳後寄出
- 管理員收到待查帳通知，且沒有把帳號敏感資訊洩漏至公開 URL
- Email 中取消連結仍可正常使用
- 既有報名、優惠、免費活動、手機版與新增/複製活動全部回歸測試

## 發佈順序
測試資料庫 migration → 部署測試 Edge Function → 串接寄信模板 → E2E 測試 → 審查安全性 → 正式資料庫 migration → 正式 Edge Function → 合併網站頁面 → 實際信件驗收。
