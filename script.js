(function() {
  // Older browsers might not implement mediaDevices at all, so we set an empty object first
if (navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {};
}

// Some browsers partially implement mediaDevices. We can't just assign an object
// with getUserMedia as it would overwrite existing properties.
// Here, we will just add the getUserMedia property if it's missing.
if (navigator.mediaDevices.getUserMedia === undefined) {
  navigator.mediaDevices.getUserMedia = function(constraints) {

    // First get ahold of the legacy getUserMedia, if present
    var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    // Some browsers just don't implement it - return a rejected promise with an error
    // to keep a consistent interface
    if (!getUserMedia) {
      return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
    }

    // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
    return new Promise(function(resolve, reject) {
      getUserMedia.call(navigator, constraints, resolve, reject);
    });
  }
}
  
  var video = document.getElementById('video');
  var canvas = document.getElementById('canvas');
  var photo = document.getElementById('photo');
  var output = document.getElementById('output');
  var takepic = document.getElementById('takepicture');
  var digit = document.getElementsByClassName('digit');
  var front = false;
  var mode = "user";
  var constraints = { audio: false ,video: { facingMode: "user" } };
  
  var chooseCamera = confirm("Use User Camera ?");
  if (chooseCamera == true) {
    start(constraints);
  } 
  else {
    constraints.video.facingMode = "environment";
    start(constraints);
  }
  
  function start(constraints) {
    navigator.mediaDevices.getUserMedia(constraints)
    .then(function(stream) {
      var video = document.getElementById('video')
      video.src = window.URL.createObjectURL(stream);
      video.onloadedmetadata = function(e) {
        video.play();
      };
    })
    .catch(function(err) {
      console.log(err.name + ": " + err.message);
    }); 
  }
  
    var i = 3;
  var count;
    /*Take photo*/
    takepic.addEventListener('click', function(e){
      e.preventDefault();
      digit[0].style.display = 'block';
      count = setTimeout(function () { countDown(); }, 1000);
    });
  
    function countDown() {
      if(i == 0) {
        clearTimeout(count);
        takepicture();
        digit[0].style.display = 'none';
      }
      else if(i > -1){
         i--;
         digit[0].innerHTML = i;
         setTimeout(function () { countDown(); }, 1000);
      }
    }
  
  
    function takepicture() {
      var context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, 300, 300);

      var data = canvas.toDataURL('image/png');
      photo.setAttribute('src', data);
      video.style.display = 'none';
      output.style.display = 'block';
    }
})();