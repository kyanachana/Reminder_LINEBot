var spreadsheet = SpreadsheetApp.openById("1MdMNME4tTJ26q-l5MnCFdeLVztwXx_SNcH5Dzx5EAlM");//スプレッドシートのIDを書く
var sheet = spreadsheet.getSheetByName('webhook');//スプレッドシートの名前(下にシート１とかあるやつ)を書く
function appendToSheet(text) {//スプレッドシートに新たな行を追加する。コード.gsの41行目で呼び出されている。自分のUserIDの行がない場合にuserIDだけ加える
 sheet.appendRow([text]);
}
function searchRowNum(searchVal, col) {//第１引数：探したいもの、第二引数：探す列。コード.gsの40行目で呼び出されている。
 //受け取ったシートのデータを二次元配列に取得
 var dat = sheet.getDataRange().getValues();
 for (var i = 0; i < dat.length; i++) {
   if (dat[i][col] === searchVal) {//列を固定して全ての行をチェックしている。
     return i;//あればその行数を返す
   }
 }
 return false;//なければfalse
}
//【思ったこと】getRange()では行・列が1から始まりますが、配列のインデックスは[0][0]から始まる。インデックスがズレている
//A1の場合dat[0][0]だけど、getRange(1, 1)としなきゃいけない。
//だからrow+1にしてるんだなあと思いました。まる。

function getFromRowCol(sheetName, row, col) {//rowとcolを指定して、値を読み込む関数
 var dat = sheet.getDataRange().getValues();//sheet全体の値を取得
 return dat[row][col];
}
function setFromRowCol(val, row, col) {//rowとcolを指定して、書き込む関数
 sheet.getRange(row + 1, col + 1).setValue(val);
}
function getUserIdCell(row) {
 return sheet.getRange(row + 1, 1);//UserIDCell「Ud55699aba5ec6c0eda7aed9f8934a5e4」セルの範囲を取得する(1, 1)
}
function getTodoCell(row) {
 return sheet.getRange(row + 1, 2);//TodoCell「カップラーメン」セルの範囲を取得する(1, 2)
}
function getDateCell(row) {
 return sheet.getRange(row + 1, 3);//DateCell「2020年08月01日14時53分」セルの範囲を取得(1, 3)
}
function getTriggerCell(row) {
 return sheet.getRange(row + 1, 4);//TriggerCell「2449186079262266014」セルの範囲を取得(1, 4)
}
function getOverTriggerCell(row) {
 return sheet.getRange(row + 1, 5);//TriggerCell「2449186079262266014」セルの範囲を取得(1, 4)
}