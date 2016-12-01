chrome.browserAction.setBadgeText({text: 'hello'});
chrome.browserAction.setBadgeBackgroundColor({color: '#0000FF'});

var Event = (function() {
    var clientList = {};
    var listen,
        trigger,
        remove;
    listen = function(key, fn) {
        if (!clientList[key]) {
            clientList[key] = [];
        }
        clientList[key].push(fn);
    };

    trigger = function() {
        var key = [].shift.call(arguments);
        var fns = clientList[key];

        if (!fns || fns.length === 0) {
            return false;
        }

        for (var i = 0, fn; fn = fns[i++];) {
            fn.apply(this, arguments);
        }
    };


    remove = function(key, fn) {
        var fns = clientList[key];

        // key对应的消息么有被人订阅
        if (!fns) {
            return false;
        }

        // 没有传入fn(具体的回调函数), 表示取消key对应的所有订阅
        if (!fn) {
            fns && (fns.length = 0);
        }
        else {
            // 反向遍历
            for (var i = fns.length - 1; i >= 0; i--) {
                var _fn = fns[i];
                if (_fn === fn) {
                    // 删除订阅回调函数
                    fns.splice(i, 1);
                }
            }
        }
    };

    return {
        listen: listen,
        trigger: trigger,
        remove: remove
    }
}());
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
      Event.trigger('saveData');
  },function(error){
    console.log(error);
  })
}

function queryData(site){
  var query = new AV.Query(DATABASE);
  query.contains('site',site);
  query.find().then(function(result){
    return result;
  },function(error){
  });
}

// todo
// totalTimeCount

function updateTimeData(objectId,todayTime,totaltime){
  var record = AV.Object.createWithoutData(DATABASE, objectId);
  // 修改属性
  record.set('todayTime', todayTime);
  record.set('totalTime', totalTime);
  record.save().then(function(res){
    Event.trigger('saveData');
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
  this.totalTimeCount = 0;
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
  if(temp === null || temp === ''){
    temp =this.url.match(reg_https);
  }
  this.site = temp[1];
}


TimeCount.prototype.countUp = function() {
  var _self = this;
  Event.listen('getData',function(){
      _self.timer = setInterval(function(){
        _self.todayTimeCount++;
        _self.showTime();
      // var hh = _self.todayTimeCount.toString();
      // chrome.browserAction.setBadgeText({text: hh});
    },1000);

  })

  // setTimeout(this.countUp.bind(this),1000);
}

TimeCount.prototype.overTime = function() {

}

TimeCount.prototype.showTime = function() {
  var hours = Math.floor(this.todayTimeCount / 3600);
  var minutes = Math.floor((this.todayTimeCount - hours * 3600) / 60);
  if(this.hour <= 0){
    chrome.browserAction.setBadgeText({text: minutes+'m'});
  }else{

    chrome.browserAction.setBadgeText({text: hours + 'h' });
  }
}

TimeCount.prototype.remove = function(){
  window.clearInterval(this.timer);
}

TimeCount.prototype.checkDomain = function() {

}
TimeCount.prototype.getTodayTimeCount = function() {
  var _self = this;
  var query = new AV.Query(DATABASE);
  query.contains('site',this.site);
  query.find().then(function(result){
    if(result.length === 1){
      _self.todayTimeCount = parseInt(result[0].attributes.todayTime);
      _self.totalTimeCount = parseInt(result[0].attributes.totalTime);
      Event.trigger('getData');
    }else{
      _self.todayTimeCount = 0;
      _self.totalTimeCount = 0;
      Event.trigger('getData');
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
    if(result.length === 1){
      var id = result[0].id;
      _self.totalTimeCount  = _self.totalTimeCount + _self.todayTimeCount;
      var record = AV.Object.createWithoutData(DATABASE, id);
      record.set('todayTime', _self.todayTimeCount.toString());
      record.set('totalTime', _self.totalTimeCount.toString());
      record.save().then(function(res){
        Event.trigger('saveData');
      },function(err){
        console.log(err);
      });

    }else{
      var obj = {site: _self.site,totalTime: _self.totalTimeCount.toString(),todayTime: _self.todayTimeCount.toString()};
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
      timeCountSingleInstance.init(sender.tab.url);
      sendResponse({farewell: "goodbye"});
 });


chrome.tabs.onActivated.addListener(function(activeInfo){
      chrome.tabs.get(activeInfo.tabId, function(tab){
      timeCountSingleInstance.init(tab.url);
	});
});


var timeCountSingleInstance = function() {
  this.timeCount = '';
};

function showHello() {
  chrome.browserAction.setBadgeText({text: 'hello'});
  chrome.browserAction.setBadgeBackgroundColor({color: '#0000FF'});
}

timeCountSingleInstance.init = function(url) {
   console.log(this.timeCount);
   console.log(url);
   Event.remove('saveData');
   Event.remove('getData');
   var _self = this;
  if (url === "chrome://extensions/" || url === 'chrome://newtab/') {
     showHello();
     console.log('url');
     if(this.timeCount === '' || typeof this.timeCount === 'undefined' || this.timeCount.url === 'chrome://extensions/' || this.timeCount.url === 'chrome://newtab/' ) {
         console.log('url timecount null');
         return ;
     }else{
        console.log('url timeCount not null');
       this.timeCount.saveData();
       Event.listen('saveData', function(){
         _self.timeCount.remove();
         _self.timeCount = '';
       })
     }

     return;

  }

  if (typeof this.timeCount === 'undefined' || this.timeCount === '') {
      console.log('undefined');
      this.timeCount = new TimeCount(url);
      this.timeCount.init();
      return;
  }
  if (typeof this.timeCount !== 'undefined' && this.timeCount !== '' ) {
    console.log('this timeCount has data');
    this.timeCount.saveData();
    Event.listen('saveData', function(){
      _self.timeCount.remove();
      _self.timeCount = '';
      _self.timeCount = new TimeCount(url);
      _self.timeCount.init();
    })
  };



}



// todo
// 数据转换
// 结束动画
// 判断当前时间和与数据的update时间
// 优化




//像指定的标签载入脚本
// chrome.tabs.executeScript(tabId, {
//     file: 'js/ex.js',
//     allFrames: true,
//     runAt: 'document_start'
// }, function(resultArray){
//     console.log(resultArray);
// });
