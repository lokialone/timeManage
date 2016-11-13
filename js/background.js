import 'whatwg-fetch'

let googleUrl = "http://www.google.cn"




function checkStatus(){
  
    fetch(googleUrl).then((res)=>{
        chrome.browserAction.setIcon({path: 'images/offline.png'});
        setTimeout(checkStatus, 5000);
    })
}

checkStatus();
