chrome.browserAction.setBadgeText({text: 'hello'});
chrome.browserAction.setBadgeBackgroundColor({color: '#0000FF'});



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

Function.prototype.bind= function(context) {
  var self = this;
  return function(){
    return self.apply(context,arguments)
  }
}

var TimeCount = function(url) {
  this.totalTimeCount = '';
  this.title = '';
  this.url = url;
  this.todayTimeCount = 0;
  this.hour = 0;
  this.minute = 0;
  this.domain = '';
  this.tabId = '';
}

TimeCount.prototype.init = function() {
	this.countUp();
  
}

TimeCount.prototype.checkStatus = function() {
}

TimeCount.prototype.checkDomainChange = function() {
}

TimeCount.prototype.countUp = function() {
  this.todayTimeCount++;
  var hh = this.todayTimeCount+'';
  chrome.browserAction.setBadgeText({text: hh});
  //this.showTime();
  setTimeout(this.countUp.bind(this),1000);
}

TimeCount.prototype.overTime = function() {

}

TimeCount.prototype.showTime = function() {
  this.hour = Math.floor(this.todayTimeCount / 3600);
  var minutes = (this.todayTimeCount - this.hour * 3600) / 60;
  if(this.hour <= 0){
    chrome.browserAction.setBadgeText({text: this.minute+'min'});
  }else{
    chrome.browserAction.setBadgeText({text: this.hour + 'h' + this.minute +'m'});
  }
}

TimeCount.prototype.checkDomain = function() {

}

LeanCloudInit();
// openDatabase
var browserTimeTable = AV.Object.extend(DATABASE);
var browserTime = new browserTimeTable();
var timeCount = '';

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    timeCount = '';
   	timeCount = new TimeCount(sender.tab.url);
   	timeCount.init();
    if (request.greeting == "begin")
      sendResponse({farewell: "goodbye"});
    else
      sendResponse({}); // snub them.
 });



chrome.tabs.onActivated.addListener(function(activeInfo){
    chrome.tabs.get(activeInfo.tabId, function(tab){
    	timeCount = '';
    	timeCount = new TimeCount(tab.url);
    	console.log(timeCount);
    	timeCount.init();
	});
});






//像指定的标签载入脚本
// chrome.tabs.executeScript(tabId, {
//     file: 'js/ex.js',
//     allFrames: true,
//     runAt: 'document_start'
// }, function(resultArray){
//     console.log(resultArray);
// });
