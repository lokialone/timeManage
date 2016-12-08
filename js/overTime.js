chrome.extension.sendRequest({greeting: "begin"}, function(response) {
    console.log(response);
  });

window.onload = function(){

  var content = document.getElementsByTagName('body')[0].childNodes;
  console.log(document);
  var need = [];
  for(var i = 0, len = content.length; i < len; i++){

    if(content[i].nodeType == 1){
      content[i].style.color="red";
    }
  }
  // get bodys  all elements includes all childen
  var test = $('body'). children();
  console.log(test);
  function shake(one){
      var distance = Math.random() - 0.5;
      console.log(one);
      one.style.left=one.offsetLeft + distance + 'px';
  }

  function allShake() {
    console.log('bbb');
    setTimeout(function(){
      need.forEach(shake);
      // allShake();
    },1000)
  }

  allShake();




}
