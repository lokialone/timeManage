var sendMessage = document.getElementById('sendMessage');
var messageS = document.getElementById('message');
var tabId = '';

sendMessage.onclick = handleClick;


chrome.tabs.query({active: true},function(arr){
    console.log(arr);
    tabId = arr[0].id;
});

function handleClick() {

  console.log(tabId);
  chrome.tabs.sendMessage(tabId, {Hello:'hello'}, function(response){
      console.log(response);
    });
}
