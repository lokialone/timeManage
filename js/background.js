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
LeanCloudInit();

// testObject
var TestObject = AV.Object.extend('TestObject');
var testObject = new TestObject();
testObject.save({
  words: 'Hello lokia !'
}).then(function(object) {
  alert('LeanCloud Rocks!');
})


function httpRequest(url, callback){
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

Function.prototype.bind= function(context){
  var self = this;
  return function(){
    return self.apply(context,arguments)
  }
}

TimeCount.prototype.init = function() {
  this.countUp();
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

TimeCount.prototype.checkDomainChange = function(){


}

TimeCount.prototype.createDatabase = function(){
  var db = openDatabase('TimeCount', '2.0',this.title, 2 * 1024);
}

TimeCount.prototype.countUp = function() {
  this.todayTimeCount++;
  this.showTime();
  setTimeout(this.countUp.bind(this),1000);
}

chrome.tabs.onHighlighted.addListener(function(highlightInfo){
    console.log('Tab '+highlightInfo.title+' in window '+highlightInfo.windowId+' is highlighted now.');
});
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

var timeCount = new TimeCount();
timeCount.init();
