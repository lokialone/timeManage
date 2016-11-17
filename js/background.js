const DATABASE = 'browserTime';

function LeanCloudInit(){
  // 应用 ID，用来识别应用
  var APP_ID = 'jKSkOo7kJrhGtjOPY5jtj8vt-gzGzoHsz';

  // 应用 Key，用来校验权限（Web 端可以配置安全域名来保护数据安全）
  var APP_KEY = 'R2A6rfB2v8VXrjX0mNtzro0t';
  // 初始化
  AV.init({
    appId: APP_ID,
    appKey: APP_KEY
  });
}




function saveData(obj){
  browserTime.save({
    site: obj.site,
    totalTime: obj.totalTime,
    todayTime:obj.todayTime
  }).then(function(object) {
    alert('LeanCloud Rocks!');
  })
}

function queryData(site){
  var query = new AV.Query(DATABASE);
  query.contains('site',site);
  query.find().then(function(result){
    console.log(result);
  },function(error){
  });
}

// todo
// totalTimeCount

function updateTimeData(objectId,time){
  var record = AV.Object.createWithoutData(DATABASE, objectId);
  // 修改属性
  todo.set('todayTime', time);
  todo.save();
}


function httpRequest(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            callback(true);
        }
    }
    xhr.onerror = function(){
        callback(false);
    }
    xhr.send();
}

chrome.browserAction.setBadgeBackgroundColor({color: '#0000FF'});

var TimeCount = function() {
  this.totalTimeCount = '';
  this.title = '';
  this.url = '';
  this.todayTimeCount = 0;
  this.hour = 0;
  this.minute = 0;
  this.domain = '';
}

Function.prototype.bind= function(context) {
  var self = this;
  return function(){
    return self.apply(context,arguments)
  }
}

TimeCount.prototype.init = function() {
  this.getCurrentTabInfo();
  chrome.browserAction.setBadgeText({text: this.title});
  // this.countUp();
}

TimeCount.prototype.getCurrentTabInfo = function() {
  chrome.tabs.query({
      highlighted: true
  }, function(tab){
      this.title = tab[0].title;
      this.url = tab[0].url;
  });
}

TimeCount.prototype.checkStatus = function() {

}

TimeCount.prototype.checkDomainChange = function() {


}

TimeCount.prototype.countUp = function() {
  this.todayTimeCount++;
  this.showTime();
  setTimeout(this.countUp.bind(this),1000);
}

TimeCount.prototype.overTime = function() {

}



TimeCount.prototype.showTime = function() {
  this.hour = Math.floor(this.todayTimeCount / 3600);
  var minutes = (this.todayTimeCount - this.hour * 3600) / 60;
  if(minutes > 30){
    this.minute = 5;
  }else{
    this.minute = 0;
  }
  chrome.browserAction.setBadgeText({text: this.hour+'.'+this.minute+'h'});
}

function checkDomainChange() {

}

LeanCloudInit();
// openDatabase
var browserTimeTable = AV.Object.extend(DATABASE);
var browserTime = new browserTimeTable();

// 同一个tab下改变网站的检测
window.addEventListener('load', handleChange);

// 新增标签的tag检测
chrome.tabs.onHighlighted.addListener(function(highlightInfo){
  console.log(highlightInfo);
});

//像指定的标签载入脚本
// chrome.tabs.executeScript(tabId, {
//     file: 'js/ex.js',
//     allFrames: true,
//     runAt: 'document_start'
// }, function(resultArray){
//     console.log(resultArray);
// });
function handleChange(){
  console.log('dddd');
  var timeCount = new TimeCount();
  timeCount.init();
}
