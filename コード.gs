var moment = Moment.load();

function doPost(e) {
 var webhookData = JSON.parse(e.postData.contents).events[0];
 var message, replyToken, replyText, userId;
 message = webhookData.message.text;//ユーザーからのメッセージ
 replyToken = webhookData.replyToken;//応答メッセージを送るAPI
 userId = webhookData.source.userId;//userID
 var userDataRow = searchUserDataRow(userId);//userIDの書いてある行を取得する
 var todo = getTodoCell(userDataRow).getValue();//getTodoCell(userDataRow)で値を得たいセルの範囲を指定し、.getValue()で値を取得「カップヌードル」
 var todoDate = getDateCell(userDataRow).getValue();//getDateCell(userDataRow)で値を得たいセルの範囲を指定し、.getValue()で値を取得「2020年08月01日14時53分」
 switch (message) {//メッセージごとに返答変える
   case '使い方':
      replyText = 'はい！あとで思い出したいことをラインしてくれれば、いつお知らせしてほしいか聞くので、「10分後」「11月23日17時00分」など、教えてください♫その日時にお知らせします。';
      break;
   case 'キャンセル':
      replyText = cancel(userDataRow);
      break;  
   case '確認':
     if (todoDate) {
       replyText = '「' + todo + '」を' + todoDate + 'にお知らせする予定だよ！';
     } else {
       replyText = '登録されているリマインダーはありません！';
     }
     break;
   default:
     if (todoDate) {//todoDateが埋まっているときは、すでにリマインダーが登録されているということなので、「リマインダーは1つしか登録できません」というメッセージを返します。
       replyText = 'ごめん💦リマインダーは1つしか登録できないんだ💦「キャンセル」って言ってくれれば今のリマインダーをやめるよ〜';
     } else if (todo) {//さらにtodoが埋まっているは、2列目の予定は入っているけど、3列目の日時は入っていないことになります。
       //この時には、messageは日時の指定が含まれていると予測して、setDate関数を呼び出して、日付を登録します。
       replyText = setDate(userDataRow, message);
     }
     else {//それ以外の場合は、まだ予定が入っていないということなので、setTodo関数を呼び出して、予定を登録します。
       replyText = setTodo(userDataRow, message);
     }
 }
 return sendLineMessageFromReplyToken(replyToken, replyText);
}

function searchUserDataRow(userId) {
 userDataRow = searchRowNum(userId, 0);//userIDがスプレッドシートの0列目にあるかを確認
 if (userDataRow === false) {//userIDが見つからなかった場合
   appendToSheet(userId);//userIDを書き足す
 }
 return userDataRow;//userIDの行を返す。これfalseの場合どうなってるんだ？
}

function setTodo(row, message) {//予定を登録
 setFromRowCol(message, row, 1);//スプレッドシートに予定を書き込んでいる「カップヌードル」
 return '「' + message + ' 」だね！覚えたよ！\nいつ教えてほしい？例：「10分後」「11月23日17時00分」など。「キャンセル」って言ってくれればやめるよ〜';
}

function setDate(row, message) {//日付を登録
 // 全角英数を半角に変換
 message = message.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
   return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
 });
 var time = -1;
 var date = Moment.moment(message, 'M月D日H時m分', true).format('YYYY年MM月DD日H時m分');//メッセージがM月D日H時m分のフォーマット送られなかった場合、Invalid dateになる。
 if (date === 'Invalid date') {
   var match = message.match(/\d+/g);//"\d+"で数字列があれば取得する。(おそらく/gなので複数個取得して、match[0]で最初の数字列だけを使用している)
   if (match !== null) {
     date = Moment.moment().add(+match[0], 'minutes').format('YYYY年MM月DD日H時m分');//読み取った数字列分だけ現在の時刻に足している。Moment.moment()は現在の時刻を取ってくる関数
     time = +match[0];
   }
 }
 if (date === 'Invalid date') {
   return 'わかんない！いつ？「キャンセル」って言ってくれればやめるよ〜'
 } else if (date < Moment.moment()) {
   return 'タイムマシンが完成するまで待って！未来の日時で教えてね💦'
 }
 //ここまででuserID日時予定全て埋まったので、triggerを付ける
 setTrigger(row, date);//triggerを作成し、そのtriggerをスプレッドシートに書き込む「8894477955202438476」
 setOverRemindTrigger(row, date,time);//triggerを作成し、そのtriggerをスプレッドシートに書き込む「8894477955202438476」
 setFromRowCol(date, row, 2);//リマインド時間(date)をスプレッドシートに書き込む「2020年08月01日14時53分」
 return date + 'にお知らせするね！';
}


function cancel(row) {//キャンセルする
 getTodoCell(row).clear();//予定のセルの範囲を取得し、消去する
 getDateCell(row).clear();//時間のセルの範囲を取得し、消去する
 //triggerをあれば２つとも消す
 OverTriggerCell = getOverTriggerCell(row)//Overtriggerのセルの範囲を取得
 var OverTriggerId = OverTriggerCell.getValue();//Overtriggerの値を取得する
 triggerCell = getTriggerCell(row)//triggerのセルの範囲を取得
 var triggerId = triggerCell.getValue();//triggerの値を取得する
 if (triggerId) {//もし存在すればプロジェクトのtriggerのリストの中から消す
   deleteTrigger(triggerId);
 }
 if (OverTriggerId) {//もし存在すればプロジェクトのOvertriggerのリストの中から消す
   deleteTrigger(OverTriggerId);
 }
 triggerCell.clear();//triggerのセルを消去する
 OverTriggerCell.clear();
 return 'またなんかあったら言ってね〜'
}

function remind(e) {//triggerで設定した時間になったら呼び出される関数
 var userDataRow = searchRowNum(e.triggerUid, 3);//呼びだしたtriggerのUniqueIDのある行を取得
 var userId = getUserIdCell(userDataRow).getValue();
 var todo = getTodoCell(userDataRow).getValue();
 var remindText = '「' + todo + '」の時間だよ！ 気をつけて！';
 //cancel(userDataRow);
  
 //正規の時間のリマインドをするtriggerとスプレッドシートを消す。(予定とか時間のとこを残す)
 triggerCell = getTriggerCell(userDataRow)//triggerのセルの範囲を取得
 var triggerId = triggerCell.getValue();//triggerの値を取得する
 if (triggerId) {//もし存在すればプロジェクトのtriggerのリストの中から消す
   deleteTrigger(triggerId);
 }
 triggerCell.clear();//triggerのセルを消去する
 return sendLineMessageFromUserId(userId, remindText);//指定されたUserIdに、アプリ側から自発的にリマインドメッセージを送る
}

function OverRemind(e) {//OverTriggerで設定した時間になったら呼び出される関数
 var userDataRow = searchRowNum(e.triggerUid, 4);//呼びだしたtriggerのUniqueIDのある行を取得
 var userId = getUserIdCell(userDataRow).getValue();
 var todo = getTodoCell(userDataRow).getValue();
 var remindText = '「' + todo + '」の時間から5分もたったよ！ もう知らないからね！';
 cancel(userDataRow);
 return sendLineMessageFromUserId(userId, remindText);//指定されたUserIdに、アプリ側から自発的にリマインドメッセージを送る
}



//付け加えたい機能
//時間設定を行った時にその時間のtriggerだけでなく、5分後に"5分後になったよ"と聞くようなtriggerを加える
//「キャンセル」と言ったら全てのtriggerを消す