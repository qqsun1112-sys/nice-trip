# WELCOME50 後端整合規格與安全檢查（2026-10-20）
狀態：**僅規格／隔離測試，未部署正式環境**。
已唯讀核對 Supabase 正式 Edge Function `submit-registration` v16 與 RPC `public.create_registration_atomic(p_row jsonb)`。

## 現況
- `activity-register.html` 目前只將 event_slug、ticket_code、quantity、個資等送至 `submit-registration`，無優惠碼欄位。
- v16 Edge Function 以資料庫 `site_activities.ticket_options` 取得票價，計算 `unit * qty`，組裝 row.total_amount，再呼叫 RPC。
- RPC 鎖定 `site_activities` 行、檢查容量、寫入 `registrations`，但**不會重新驗證 row.total_amount**；因此 Edge Function 必須用伺服器資料嚴格計算。
- 目前報名成功信與管理員信顯示 `total`；未有折扣明細。
- 既有通知、匯款回報、取消及後台都依 total_amount，必須做整合回歸測試。

## 使用者核准的第一階段
- 單一共用碼 WELCOME50，限明確指定的付費 city 活動；一筆訂單輸入一次，按符合資格的付費參加人數 × NT$50 折抵。
- 無碼完全沿用原本流程；有碼但失敗必須顯示原因，**不得默默改原價建立訂單**。
- 2026/10/20 00:00～2026/12/31 23:59（Asia/Taipei），不得疊加其他優惠券。
- 共用碼不代表 LINE 身分驗證，也不代表跨訂單每人限用一次。

## 建議的實作步驟（尚未執行正式部署）
1. 在活動設定新增後端可控的明確優惠開關，預設 false；不得只靠 service='city' 自動啟用全部活動。
2. 報名頁僅對可用的指定付費活動顯示選填優惠碼欄位，並在確認付款前顯示原價、折扣及應付金額；送出時附上 coupon_code。前端顯示僅為預覽。
3. Edge Function 取得伺服器端活動優惠開關、票價與人數，嚴格驗證優惠期限、服務、票種、不可疊加條件。**不得採信前端的 total_amount、discount、unit_price**。
4. 只有優惠碼被接受才呼叫既有原子 RPC；若無效、過期或不適用，回傳可讀錯誤，不能降級為原價訂單。
5. 在 registrations 保存優惠碼及折扣金額供稽核；修改 RPC 時必須保留既有容量鎖、訂單號碼、取消權杖、通知等現有行為。任何新增欄位均需 migration 與回滾方案。
6. 報名成功頁、客戶信、管理員信與後台應顯示原價、優惠及實付金額；匯款與取消維持以實付金額為準。
7. 在獨立環境測試無碼、1/2/3 人、無效碼、過期、免費票、非指定活動、混合票種、額滿、重複提交、取消、通知信、手機版與併發；需驗證金額及名額沒有不一致。
8. 完成實際整合測試後，再取得使用者明確批准正式部署；第二階段不動。

## 目前阻礙
目前取得的是**正式** Supabase 專案的 v16 函式及 RPC。尚未建立隔離 Supabase 測試分支／資料庫，且尚未核准對正式環境進行 migration 或函式部署。不得把 GitHub 測試分支誤認為 Supabase 後端隔離環境。

## 重要補充
LINE 優惠券說明與官網說明須一致；「一筆訂單輸入一次」與「每人限用一次」不可混為一談。活動是否與早鳥票搭配，需以正式票種規則和主辦方決策確認，避免錯誤承諾。
