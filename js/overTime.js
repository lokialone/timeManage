chrome.extension.sendRequest({greeting: "begin"}, function(response) {
    console.log(response);
  });

window.onload = function(){


  // get bodys  all elements includes all childen
  var nodeNeed = [];
  function getAllTextNode(){
    var test = $('body'). children();
    dfs(test);
  }
  getAllTextNode();


  function dfs(ele){

    for(var i = 0, len = ele.length;i < len; i++) {
      if(ele[i].children.length === 0){
        // console.log(ele[i]);
        nodeNeed.push(ele[i]);
      }else {
        // console.log('dfs');
        // console.log(ele[i]);
        // nodeNeed.push(ele[i]);
        dfs(ele[i].children);
      }
    }
    // console.log(nodeNeed);
  }
  function getRangeRandom(min,max){
    if(min > max){
      alert('give the corrent range');
      return;
    }

    return Math.floor((max - min) * Math.random()) + min;
  }
  function shake(one){
      var distance = getRangeRandom(-3,3);
      // var top = one.offsetTop + 'px';
      // var left = one.offsetLeft + 'px';
      one.style.position = 'absolute';
      // one.style.top = top;
      // one.style.left =left;
      $one = $(one).animate({left: distance});
      // one.style.color = 'red';
      // console.log(top);
      // console.log(left);
      // console.log(one);
  }

  function allShake() {
    setTimeout(function(){
      nodeNeed.forEach(shake);
      allShake();
    },500)
  }

  allShake();




}
