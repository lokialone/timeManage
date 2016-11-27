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

  })
}

function queryData(site){
  var query = new AV.Query(DATABASE);
  query.contains('site',site);
  query.find().then(function(result){
    console.log(result);
    return result;
  },function(error){
  });
}

// todo
// totalTimeCount

function updateTimeData(objectId,todayTime,totaltime){
  var record = AV.Object.createWithoutData(DATABASE, objectId);
  // 修改属性
  record.set('todayTime', todayTime + '');
  record.set('totaltime', totaltime + '');

  record.save().then(function(res){
    console.log(res);
  },function(err){
    console.log(err);
  });
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
  this.site = '';
  this.tabId = '';
  this.timer = '';
  this.recordId = '';//记录更新时使用
}

TimeCount.prototype.init = function() {
  this.setDomain();
  this.getTodayTimeCount();
	this.countUp();
}

TimeCount.prototype.checkStatus = function() {
}

// todo need to update
TimeCount.prototype.setDomain = function() {
  var reg_http = /http:\/\/([^\/]+)/;
  var reg_https = /https:\/\/([^\/]+)/;
  var temp = this.url.match(reg_http);
  if(temp === null){
    temp =this.url.match(reg_https);
  }
  this.site = temp[1];
  console.log(this.site);
}


TimeCount.prototype.countUp = function() {
  this.timer = setInterval(function(){
    this.todayTimeCount++;
    var hh = this.todayTimeCount+'';
    chrome.browserAction.setBadgeText({text: hh});
  }.bind(this),1000);
  //this.showTime();
  // setTimeout(this.countUp.bind(this),1000);
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

TimeCount.prototype.remove = function(){
  var timer = this.timer;
  window.clearInterval(timer);
}

TimeCount.prototype.checkDomain = function() {

}
TimeCount.prototype.getTodayTimeCount = function() {
  var _self = this;
  var query = new AV.Query(DATABASE);
  query.contains('site',this.site);
  query.find().then(function(result){
    if(result.length){
      _self.todayTimeCount = result[0].attributes.todayTime;
      _self.totalTimeCount = result[0].attributes.totalTime;
    }else{
      console.log(result);
    }
  },function(error){
  });
}
TimeCount.prototype.saveData = function() {
  //首先查询数据库是否存有该条数据
  var _self = this;
  var query = new AV.Query(DATABASE);
  query.contains('site',_self.site);
  query.find().then(function(result){
    console.log(result);
    console.log(result.length);
    if(result.length > 0){
      var id = result[0].id;
      _self.totalTimeCount  = _self.totalTimeCount + _self.todayTimeCount;
      var totalTime= _self.totalTimeCount + '';
      updateTimeData(id,_self.todayTimeCount,_self.totalTimeCount);

    }else{
      var obj = {'site': _self.site,totalTime: _self.totalTimeCount+ '',todayTime: _self.todayTimeCount+''};
      saveData(obj);
    }
  },function(error){
    console.log(error);
  });
}

LeanCloudInit();
// openDatabase
var browserTimeTable = AV.Object.extend(DATABASE);
var browserTime = new browserTimeTable();

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    timeCountSingleInstance.init(sender.tab.url);
    if (request.greeting == "begin")
      sendResponse({farewell: "goodbye"});
    else
      sendResponse({}); // snub them.
 });


chrome.tabs.onActivated.addListener(function(activeInfo){
    chrome.tabs.get(activeInfo.tabId, function(tab){
      timeCountSingleInstance.init(tab.url);
	});
});


var timeCountSingleInstance = function() {
  this.timeCount = '';
};

window.onbeforeunload =  function() {
  alert('kkk');
}

function checkLeave() {
    alert('kkk');
}
timeCountSingleInstance.init = function(url) {
  console.log(this.timeCount);
  if(typeof this.timeCount !== 'undefined' && this.timeCount !== '') {
    console.log('this.timeCount');
    this.timeCount.saveData();
    this.timeCount.remove();
    this.timeCount = "";
  }
  this.timeCount = new TimeCount(url);
  this.timeCount.init();
}

// todo
// 使用url判断网站  --> checkDomain
// 从云端获得数据，存储数据   ---先做
// 结束动画




//像指定的标签载入脚本
// chrome.tabs.executeScript(tabId, {
//     file: 'js/ex.js',
//     allFrames: true,
//     runAt: 'document_start'
// }, function(resultArray){
//     console.log(resultArray);
// });
