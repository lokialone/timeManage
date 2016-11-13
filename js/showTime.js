function showTime(el){
  let currentTime = new Date()

  let hours = currentTime.getHours()
  let minutes = currentTime.getMinutes()
  let seconds = currentTime.getSeconds()

  minutes = minutes >= 10 ? minutes : ('0' + minutes)
  seconds = seconds >= 10 ? seconds : ('0' + seconds)

  el.innerHTML = hours + ":" + minutes + ":" + seconds;

  setTimeout(()=>{showTime(el)},1000)
}

export { showTime }
