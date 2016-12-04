chrome.extension.sendRequest({greeting: "begin"}, function(response) {
    console.log(response);
  });

var content = document.getElementsByTagName('body');
// for(var i = 0 , len = content.length; i < len;i++) {
//
// }
console.log(content);
console.log(content.textContent);
