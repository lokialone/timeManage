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
var TimeCount = (function(){
  var timeData = [],
      currentCountIndex = 0,
      timer;

  var init,
      setDomain,
      countUp,
      showTime,
      getTodayTimeCount,
      saveData,
      checkUrl,
      hasUrl,
      getTimeData,
      reset,
      remove;

  init = function() {
    getTimeData();
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
    var site = url.match(reg_http);
    if(site === null || site === ''){
      site = url.match(reg_https);
    }
    return site;
  };
  countUp = function (url) {
      reset();
      var site = setDomain(url);
      var index = hasUrl(site);
      if(index < 0){
        var data = { site: site,todayTime:0};
        timeData.push(data);
        currentCountIndex = timeData.length - 1;
      }
      else {
        currentCountIndex = index;
      }
      timer = setInterval(function(){
        var time = timeData[currentCountIndex].todayTime++;
        chrome.browserAction.setBadgeText({text: time.toString()});
      },1000);
  };
  hasUrl = function(site) {
    for(var i = 0, len = timeData.length; i < len;i++){
      if(timeData[i].site === site){
        return i;
      }
    }
    return -1;
  };
  reset = function() {
    window.clearInterval(timer);
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
  saveData = function () {
  };
  getTimeData = function() {
      // https://timecountup.herokuapp.com/data/get
  };
  remove = function () {
  };

  return {
      init : init,
      setDomain : setDomain,
      countUp : countUp,
      showTime : showTime,
      getTodayTimeCount : getTodayTimeCount,
      saveData : saveData,
      getTimeData: getTimeData,
      remove : remove
  }
}());



LeanCloudInit();
// openDatabase
var browserTimeTable = AV.Object.extend(DATABASE);
var browserTime = new browserTimeTable();
TimeCount.init();
chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
      TimeCount.countUp(sender.tab.url);
      sendResponse({farewell: "goodbye"});
 });


chrome.tabs.onActivated.addListener(function(activeInfo){
      chrome.tabs.get(activeInfo.tabId, function(tab){
      TimeCount.countUp(tab.url);
	});
});

function showHello() {
  chrome.browserAction.setBadgeText({text: 'hello'});
  chrome.browserAction.setBadgeBackgroundColor({color: '#0000FF'});
}
