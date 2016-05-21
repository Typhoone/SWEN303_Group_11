(function(document) {
  'use strict';

  var app = document.querySelector('#app');
  window.addEventListener('WebComponentsReady', function() {

    var animationArray = ['Buy!', 'Sell!', 'That\'s it!', 'No nonsense!', 'Free to use!'];
    var animationTxt = document.getElementById('animationText');
    var animationIndex = 0;
    var animationDelay = 500;


       app.animateText = function(){
      animationTxt.innerHTML = animationArray[animationIndex];
      animationTxt.className = 'animated zoomIn';
      animationIndex += 1;
      if(animationIndex == animationArray.length){
        animationIndex = 0;
      }
      setTimeout(function(){
        animationTxt.className = 'animated zoomOut';
        setTimeout(function(){
          app.animateText();
        }, 2000);
      }, 3000);
    }

       app.animateText();
  })(document);