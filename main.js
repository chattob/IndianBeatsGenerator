if (window.Worker) { // Check if Browser supports the Worker api.
	
/** @constructor */
var Synthesizer = function() {
  this.synthworker = new Worker("synthworker.js");

  var synth = this;

  this.synthworker.addEventListener('message', function(e) {
    var data = e['data'];
    switch (data['type']) {
      case 'wave':
        synth.play(data['data']);
        //synth.profileCount += 1;
        //synth.profileElapsed += data['profileElapsed'];
        break;

      case 'log':
        console.log('Synth Worker: ' + data['data']);
        break;

      case 'error':
        console.log('Synth Worker Error: ' + data['data']);
        break; 
    }
  }, false);

  var BPM = 120;
  this.delayMs = 60000/BPM;

  /*var inputElement = document.getElementById("BPM");
  inputElement.addEventListener('change', function() {
    BPM = inputElement.value;
    this.delayMs = 60000/BPM;
  }, false);*/

  var freqs = 0.2;
  var synthSamples = 20000;
  var gain = 2;

  this.synthworker.postMessage({
    'cmd': 'init',
    'data': {
      'gain': this.gain,
      'freqs': this.freqs,
      'numSamples': this.synthSamples
    }
  });


  this.running = false;
  this.targetTime = Date.now();

  this.canvas = $('#canvas')[0];  
}

Synthesizer.prototype = {
  start: function () {
    if (this.running) return;
    this.running = true;

    this.targetTime = Date.now() + this.delayMs;
    this.updateTask = undefined;
    this.update();
  },

  update: function() {
    this.synthworker.postMessage({
      'cmd': 'synthesize',
      'data': {
        'freqs': this.freqs,
        'numSamples': this.synthSamples
      }
    });
    this.canvas = $('#canvas')[0];
    var c = canvas.getContext('2d');
  
    //c.fillRect(0,0,canvas.width,canvas.height);
    var color = 0;
    var radius = 1;

    function draw() {
      c.fillStyle = 'hsl(' + color++ + ',90%,70%)';
      c.beginPath();
      c.arc(640,450,radius,0,2*Math.PI,false);
      c.fill();
      requestAnimationFrame(function(){draw()});      
      radius += 0.4; 
    }
    draw(); 
  },

  play: function(uri) {
    var audio = new Audio(uri);
    var now = Date.now();
    var delayMs = 60000/BPM.value;
    var delay = Math.min(delayMs, this.targetTime - now);
    this.targetTime = Math.max(now, this.targetTime + delayMs);
    var synth = this;
    this.updateTask = setTimeout(function () {
            synth.updateTask = undefined;
            audio.play();
            synth.update();
    }, delay);
  }
}


 var synthesizer = new Synthesizer();

 synthesizer.start();
}
