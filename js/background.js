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

// function checkStatus(){
//     httpRequest('http://www.google.com/', function(status){
//         chrome.browserAction.setIcon({path: 'images/'+(status?'online.png':'offline.png')});
//         setTimeout(checkStatus, 5000);
//     });
// }
chrome.browserAction.setBadgeBackgroundColor({color: '#0000FF'});
chrome.browserAction.setBadgeText({text: 'hii'});
// checkStatus();

function timeCount() {



}

function checkDomain() {

}

chrome.tabs.query({
    active: true
}, function(tabArray){
    console.log(tabArray);
});
