webpackJsonp([1,3],[function(e,t,n){"use strict";var o=n(2),i=document.getElementById("clock_div");(0,o.showTime)(i)},,function(e,t){"use strict";function showTime(e){var t=new Date,n=t.getHours(),o=t.getMinutes(),i=t.getSeconds();o=o>=10?o:"0"+o,i=i>=10?i:"0"+i,e.innerHTML=n+":"+o+":"+i,setTimeout(function(){showTime(e)},1e3)}Object.defineProperty(t,"__esModule",{value:!0}),t.showTime=showTime}]);