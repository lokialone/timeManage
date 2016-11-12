// function my_clock(el){
//     var today=new Date();
//     var h=today.getHours();
//     var m=today.getMinutes();
//     var s=today.getSeconds();
//     m=m>=10?m:('0'+m);
//     s=s>=10?s:('0'+s);
//     el.innerHTML = h+":"+m+":"+s;
//     setTimeout(function(){my_clock(el)}, 1000);
// }
//
// var clock_div = document.getElementById('clock_div');
// my_clock(clock_div);

function showTime(el){
  let currentTime = new Date()

  let hours = currentTime.getHours()
  let minutes = currentTime.getMinutes()
  let seconds = currentTime.getSeconds()

  minutes = minutes >= 10 ? minutes : ('0' + minutes)
  seconds = seconds >= 10 ? seconds : ('0' + seconds)

  el.innerHTML = hours + ":" + minutes + ":" + seconds;

  setTimeout(()=>{showTime(el)},1000);
}

export { showTime };
