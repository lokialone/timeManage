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

var TimeCount = (function(){
  var site = '',
      url = '',
      todayTimeCount = 0,
      timer = 0,
      initFlag = false;
  var init,
      setDomain,
      countUp,
      showTime,
      getTodayTimeCount,
      saveData,
      checkUrl,
      remove;

  init = function(out_url) {
    Event.remove('saveData');
    Event.remove('getData');
    url = out_url;
    if(!checkUrl()){
      console.log('url have no use');
      return;
    }
    if(initFlag){
      saveData();
      Event.listen('saveData',function(){
        remove();
        initFlag = true;

        setDomain();
        getTodayTimeCount();
        countUp();

      })
    }else {
      initFlag = true;
      setDomain();
      getTodayTimeCount();
      countUp();
    }
  };
  checkUrl = function () {
    if(url === "chrome://extensions/" || url === 'chrome://newtab/'){
      chrome.browserAction.setBadgeText({text: 'hello'});
      chrome.browserAction.setBadgeBackgroundColor({color: '#0000FF'});
      if(initFlag){
        saveData();
        Event.listen('saveData',function(){
          remove();
        });
      }
      return false;
    }
    return true;
  };
  setDomain = function () {
    var reg_http = /http:\/\/([^\/]+)/;
    var reg_https = /https:\/\/([^\/]+)/;
    var temp = url.match(reg_http);
    if(temp === null || temp === ''){
      temp = url.match(reg_https);
    }
    site = temp[1];
  };
  countUp = function () {

    Event.listen('getData',function(){
        timer = setInterval(function(){
        todayTimeCount++;
        // showTime();
        var hh = todayTimeCount.toString();
        chrome.browserAction.setBadgeText({text: hh});
      },1000);
    })
  };
  showTime = function () {
    var hours = Math.floor(todayTimeCount / 3600);
    var minutes = Math.floor((todayTimeCount - hours * 3600) / 60);
    if(hours <= 0){
      chrome.browserAction.setBadgeText({text: minutes+'m'});
    }else{

      chrome.browserAction.setBadgeText({text: hours + 'h' });
    }
  },
  getTodayTimeCount = function() {
    var query = new AV.Query(DATABASE);
    query.contains('site',site);
    query.find().then(function(result){
      if(result.length === 1){
        todayTimeCount = parseInt(result[0].attributes.todayTime);
        Event.trigger('getData');
      }else{
        todayTimeCount = 0;
        Event.trigger('getData');
      }
    },function(error){
    });
  };
  saveData = function () {
    var query = new AV.Query(DATABASE);
    query.contains('site',site);
    query.find().then(function(result){
      if(result.length === 1){
        var id = result[0].id;
        var record = AV.Object.createWithoutData(DATABASE, id);
        record.set('todayTime',todayTimeCount.toString());
        record.save().then(function(res){
          Event.trigger('saveData');
        },function(err){
          console.log(err);
        });

      }else{
        var obj = {site: site,totalTime: totalTimeCount.toString(),todayTime: todayTimeCount.toString()};
        saveData(obj);
      }
    },function(error){
      console.log(error);
    });
  };
  remove = function () {
     site = '';
     url = '';
     todayTimeCount = 0;
     initFlag = false;
     window.clearInterval(timer);
  };
  return {
      init : init,
      setDomain : setDomain,
      countUp : countUp,
      showTime : showTime,
      getTodayTimeCount : getTodayTimeCount,
      saveData : saveData,
      remove : remove
  }
}());



LeanCloudInit();
// openDatabase
var browserTimeTable = AV.Object.extend(DATABASE);
var browserTime = new browserTimeTable();

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
      TimeCount.init(sender.tab.url);
      sendResponse({farewell: "goodbye"});
 });


chrome.tabs.onActivated.addListener(function(activeInfo){
      chrome.tabs.get(activeInfo.tabId, function(tab){
      TimeCount.init(tab.url);
	});
});

function showHello() {
  chrome.browserAction.setBadgeText({text: 'hello'});
  chrome.browserAction.setBadgeBackgroundColor({color: '#0000FF'});
}
