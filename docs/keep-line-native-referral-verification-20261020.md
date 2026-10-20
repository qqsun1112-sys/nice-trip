# 保留 LINE 原生好友介紹｜官網折抵整合查證紀錄

日期：2026-10-20；狀態：只讀研究；**沒有啟用 LINE 優惠券或修改正式系統**。

## 使用者已決定
保留 LINE 官方帳號「好友介紹」活動，LINE 判定介紹關係並讓介紹人與新好友領券；不改為美遊記自建推薦連結，不要求使用者另外申請網站優惠碼。目標是報名頁自動折抵 NT$50。

## 官方查證
1. LINE 台灣官方手冊：好友介紹優惠券的介紹頁面由既有好友分享；從未加入過的受介紹人透過介紹頁面加入後可領券，介紹人亦會收到領券提醒。可設定顯示優惠券序號、使用次數、領取後有效期間。
2. Messaging API 提供 GET /v2/bot/coupon 和 GET /v2/bot/coupon/{couponId}，可取得 couponCode、優惠券設定；沒有在公開 Coupon endpoints 找到針對個別 LINE 使用者查詢「已領取／未核銷」或核銷該券的 API。
3. 另有「抽獎加好友幫手」提供線上折扣碼、兌換網址、批次不同序號，但屬另一種工具，不可假設與好友介紹券整合。
4. 不能將 LINE 設定層級 couponCode 當作每位好友獨立的一次性折扣碼。不能僅依公開券碼讓官網自動折抵。

## 安全的下一步
- 在 LINE OA Manager **只檢視**「美遊記・好友同行禮」草稿，記錄「顯示優惠券序號」開關及預覽畫面；勿按儲存／公開／發送。
- 如可安全檢視個人票券識別，再查官方是否有對應的持有人驗證及核銷 API；若沒有，仍不能全自動。
- 若沒有可驗證的一人一碼，需向 LINE 官方支援確認好友介紹優惠券是否提供商家核銷 API／個人序號；在確認前不動正式報名金額。
- 可在獨立分支開發**一般化優惠碼**引擎，但不能把它宣稱與 LINE 原生好友介紹已整合。

## 來源
- https://tw.linebiz.com/manual/line-official-account/oa-manager-coupon/
- https://developers.line.biz/en/docs/messaging-api/send-coupons-to-users/
- https://developers.line.biz/en/reference/messaging-api/nojs/
- https://tw.linebiz.com/faq/oaplus-friendgrowthtool/luckydraw-coupon-comparison/
