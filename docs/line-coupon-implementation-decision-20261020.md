# 美遊記好友同行禮｜自動優惠碼落地決策（測試分支）

日期：2026-10-20；狀態：設計／尚未啟用。

## 官方 API 查核
- LINE Messaging API 可列出 LINE OA Manager 建立的優惠券（包含 DRAFT）並取得 couponCode。
- couponCode 是優惠券設定欄位，官方查詢範例不提供「某位用戶已領取／尚未使用」的個人核銷證明。
- 官方 API 不能建立 friend-referral acquisitionCondition 的優惠券，不能以普通 follow webhook 代替好友推薦資格。
- 因此不得讓輸入公開 couponCode 的使用者直接折抵，否則可複製濫用。
- 來源：https://developers.line.biz/en/reference/messaging-api/nojs/ 與 https://developers.line.biz/en/docs/messaging-api/send-coupons-to-users/

## 最小可行方案
A. 保留 LINE 原生好友介紹優惠券草稿，先檢查 Manager 的「優惠券序號」是否為所有人相同；如是，**不可直接當官網折扣碼**。
B. 若要無人工審核、無第二次申請，改採「美遊記專屬推薦連結 + LINE Login 身分驗證 + 自動發個人一次性優惠碼」。需完成 LINE Login 連結、推薦人與新用戶的關係判定及防自我推薦。不能宣稱這和 LINE 原生好友介紹資格天然同步。
C. 官網輸入碼後由伺服器即時計價，結帳時在資料庫同一交易內鎖定碼、核對適用服務／到期日／使用次數／票數、建立報名並核銷。付款與通知全部以伺服器計價為準。
D. 一般報名完全不經優惠流程；優惠碼無效應明確提示、可移除後原價報名，不可靜默原價送出。
E. 團體報名每人一組碼；優惠碼失效／取消／退款須有一致處理政策。
F. LINE 原生優惠券與網站碼不能同時對外承諾可折抵，以免雙重優惠或領券後不能使用。

## 待完成與驗收
- [ ] 使用者確認是否同意以「美遊記推薦連結」替代 LINE 原生好友介紹判定。
- [ ] 在測試 Supabase 建立專屬優惠碼及核銷 RPC；完成競態與取消測試。
- [ ] 在 feature 分支整合原 activity-register.html 的優惠碼選填欄，不更動正式 main。
- [ ] 測試一般報名、早鳥、多人、重複碼、過期碼、跨活動、取消及通知金額。
- [ ] LINE 草稿、正式官網及正式資料庫維持不變，直到取得使用者明確核准。
