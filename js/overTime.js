chrome.extension.sendRequest({greeting: "begin"}, function(response) {
    console.log(response);
  });

function leave() {
  chrome.extension.sendRequest({greeting: "end"}, function(response) {
    console.log(response);
  });
}

window.onbeforeunload = leave;
