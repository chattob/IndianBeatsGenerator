importScripts('safety.js');
importScripts('wavencoder.js');

//------------------------------------------------------------------------------
// Commands

var init = function (data) {
  self.gain = data['gain'];
  self.freqs = data['freqs'];
  //self.centerFreq = self.freqs[(self.freqs.length - 1) / 2];
  //self.numVoices = data['numVoices'];
  //self.F = self.freqs.length;
  self.T = data['numSamples'];

  self.wavEncoder = new WavEncoder(20000);//data['numSamples']);//, {clip:false});
  //self.samples = new Array(self.T);
  //self.amps = new Array(self.F);
  //self.best = new Array(self.F);
  //self.bestAmps = new Array(self.numVoices);
  //self.bestFreqs = new Array(self.numVoices);

  self.initialized = true;
};

var synthesize = function () {
  var profileStartTime = Date.now();

  assert(self.initialized, 'worker has not been initialized');
  //assert(mass.length === self.freqs.length,
  //    'mass,freqs have different length');

  var freqs = self.freqs;
  //var F = self.F;
  var T = 20000;//self.T;

  var samples = [];

  for(var t = 0; t < T; ++t) {
    var k = 0.2 * Math.sin(Math.floor(t/2200));
    samples[t] = 2 * Math.sin(k*t) - 1;  // in the interval [-1,1]
  } 

  var uri = self.wavEncoder.encode(samples);

  var profileElapsed = Date.now() - profileStartTime;
  self.postMessage({
        'type': 'wave',
        'data': uri,
        'profileElapsed': profileElapsed
      });
};

self.addEventListener('message', function (e) {
  try {
    var data = e['data'];
    //console.log(data['cmd']);
    switch (data['cmd']) {

      case 'init':
        init(data['data']);
        break;

      case 'synthesize':
        synthesize();
        break;

      default:
        throw 'unknown command: ' + data['cmd'];
    }
  }
  catch (err) {
    self.postMessage({'type':'error', 'data':err.toString()});
  }
}, false);
