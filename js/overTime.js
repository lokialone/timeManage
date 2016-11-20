chrome.extension.sendRequest({greeting: "begin"}, function(response) {
    console.log(response);
  });