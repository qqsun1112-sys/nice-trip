# LINE 原生好友介紹優惠券與官網自動折抵：官方文件查證（2026-10-20）

## 已確認
- LINE OA Manager「好友介紹」可在成功介紹新好友後，讓介紹人與被介紹人領取優惠券；可選擇顯示優惠券序號。
- LINE Messaging API 支援 GET /v2/bot/coupon 與 GET /v2/bot/coupon/{couponId}，查詢優惠券層級的 couponId、title、couponCode（可能不存在）、status 等。
- 這些 couponId/couponCode 是優惠券設定層級資訊，不等同於每位用戶唯一、未使用的權利證明。
- 已檢視的 Messaging API coupon endpoints 不包含「查詢某 LINE user 是否已領取／已使用」或「替某 LINE user 核銷」的 API。不可宣稱 LINE 原生優惠券能直接於 nicetrip.tw 自動核銷。
- 好友介紹活動截止不等於已領優惠券的使用期限。LINE 官方台灣手冊說明「自領取日的隔天起計算，至最後一天 23:59 前有效」，不應採 30*24 小時作為已確認的 LINE 規則。

## 決策
不更動正式官網、Supabase 或 LINE 草稿。不把 LINE couponCode 當成唯一個人折扣碼；不能只驗證固定文字就自動扣 NT$50，否則任何知道該碼的人可能重複使用。

## 可行替代架構（需先完成 LINE 事件／身份整合）
1. 保留 LINE 原生好友介紹活動，但需另建立可稽核的好友介紹資格來源，不能僅憑一般 follow webhook 斷定符合介紹活動。
2. 在取得可靠介紹資格證明後，系統自動發送每人唯一、一次性網站優惠碼，無須民眾再次申請；報名頁只輸入一次。
3. 伺服器驗證資格、活動、到期日、使用狀態；在同一資料庫交易中完成報名及核銷，避免競態重複折抵。
4. 若無法取得 LINE 好友介紹的可靠事件／資格資料，應評估改由美遊記自有推薦連結追蹤及發碼，LINE 作為訊息渠道；避免 LINE 與網站雙重發券導致消費者混淆。
5. 未使用優惠碼者保留完整既有報名流程。

## 官方來源
- https://tw.linebiz.com/manual/line-official-account/oa-manager-coupon/
- https://developers.line.biz/en/docs/messaging-api/send-coupons-to-users/
- https://developers.line.biz/en/reference/messaging-api/nojs/

## 待驗證
- 草稿中的「顯示優惠券序號」是否已開啟，以及顯示的是固定 couponCode 或個別票券識別。
- 是否有另行提供的合作夥伴核銷介面；在取得官方文件前不得假定存在。
