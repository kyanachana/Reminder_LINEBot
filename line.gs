var channel_access_token = "u8i8JGQL4w9ld0Prdj9ICI3E/MOW2NXjKfl0A5lPHKsZENMT6aPpZgxJs3gOZ7euD2RSnwR+RuK+PVTFBYR7alxR32EvbbkXSBTZ+GSBrxCuKEcv4r1byDsijyE0NKQJ7jumzxpBSLQZ1oGuhBeySwdB04t89/1O/w1cDnyilFU=";
var headers = {
   "Content-Type": "application/json; charset=UTF-8",
   "Authorization": "Bearer " + channel_access_token
};
function sendLineMessageFromReplyToken(token, replyText) {//ユーザーからのメッセージに反応して、replyTextを返答する。
 var url = "https://api.line.me/v2/bot/message/reply";
 var headers = {
   "Content-Type": "application/json; charset=UTF-8",
   "Authorization": "Bearer " + channel_access_token
 };
 var postData = {
   "replyToken": token,
   "messages": [{
     "type": "text",
     "text": replyText
   }]
 };
 var options = {
   "method": "POST",
   "headers": headers,
   "payload": JSON.stringify(postData)
 };
 return UrlFetchApp.fetch(url, options);
}
function sendLineMessageFromUserId(userId, text) {//指定されたUserIdに、アプリ側から自発的にメッセージ(text)を送る関数
 var url = "https://api.line.me/v2/bot/message/push";
 var postData = {
   "to": userId,
   "messages": [{
     "type": "text",
     "text": text
   }]
 };
 var options = {
   "method": "POST",
   "headers": headers,
   "payload": JSON.stringify(postData)
 };
 return UrlFetchApp.fetch(url, options);
}
