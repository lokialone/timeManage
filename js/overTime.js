chrome.extension.sendRequest({greeting: "begin"}, function(response) {
    console.log(response);
  });

window.onunload = function(){
  alert('用户离开页面啦');
}
