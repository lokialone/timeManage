function sayHello() {
  chrome.browserAction.setBadgeText({text: 'hello'});
  chrome.browserAction.setBadgeBackgroundColor({color: '#0000FF'});
}
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
  isGoodUrl = function (url) {
    if(url === "chrome://extensions/" || url === 'chrome://newtab/'){
      sayHello();
      return false;
    }
    return true;
  };
  setDomain = function (url) {
    var reg_http = /http:\/\/([^\/]+)/;
    var reg_https = /https:\/\/([^\/]+)/;
    var site = url.match(reg_http);
    if(site === null || site === ''){
      site = url.match(reg_https);
    }
    return site[1];
  };
  countUp = function (url) {
      reset();
      if(!isGoodUrl(url)){
          return ;
      }
      var site = setDomain(url);
      var index = hasUrl(site);
      if(index < 0){
        var data = { site: site,todayTime: 0};
        timeData.push(data);
        currentCountIndex = timeData.length - 1;
      }
      else {
        currentCountIndex = index;
      }
      timer = setInterval(function(){
        var time = timeData[currentCountIndex].todayTime++;
        showTime(time);
        // chrome.browserAction.setBadgeText({text: time.toString()});
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
  showTime = function (time) {
    var hours = Math.floor(time / 3600);
    var minutes = Math.floor((time - hours * 3600) / 60);
    if(hours <= 0){
      chrome.browserAction.setBadgeText({text: minutes+'m'});
    }else{

      chrome.browserAction.setBadgeText({text: hours + 'h' });
    }
  },
  saveData = function () {
  };
  getTimeData = function() {

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

sayHello();
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
