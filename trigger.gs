function setTrigger(row, date) {
 var triggerDay = moment(date,'YYYY年MM月DD日H時m分').toDate(); 
 var trigger =  ScriptApp.newTrigger("remind").timeBased().at(triggerDay).create();//実行する日時と、行う関数(remind)を指定してtriggerを作成。
 setFromRowCol(trigger.getUniqueId(), row, 3);//固有のID(trigger.getUniqueId())をtriggerのセルに書き込む「8894477955202438476」
}

function setOverRemindTrigger(row, date,time) {
  if(time!=-1){
    var addtime = time + 5;
    var OverDate = Moment.moment().add(addtime, 'minutes').format('YYYY年MM月DD日H時m分');; 
    var triggerDay = moment(OverDate,'YYYY年MM月DD日H時m分').toDate(); 
    var trigger =  ScriptApp.newTrigger("OverRemind").timeBased().at(triggerDay).create();//実行する日時と、行う関数(OverRemind)を指定してtriggerを作成。
    setFromRowCol(trigger.getUniqueId(), row, 4);//固有のID(trigger.getUniqueId())をOvertrigger(5列目)のセルに書き込む「8894477955202438476」
    //setFromRowCol(OverDate, row, 5);//確認用
  }

}

function deleteTrigger(uniqueId) {//triggerを消す
 var triggers = ScriptApp.getProjectTriggers();//現在のプロジェクトのtriggerを全て配列で取得
 for(var i=0; i < triggers.length; i++) {
   if (triggers[i].getUniqueId() === uniqueId) {//片っ端から一致するか確認
     ScriptApp.deleteTrigger(triggers[i]);//一致したら消す
   }
 }
}