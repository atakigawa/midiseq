angular
  .module('midiseq')
  .factory('MidiService', MidiService);

MidiService.$inject = [];

function MidiService() {
  return {
    getMidiManager: getMidiManager
  }

  function getMidiManager() {
    return new MidiManager();
  }
}

/* MidiManager */
function MidiManager() {
  this.midi = null;
  this.outID = -1;
  this.outPort = null;
  this.onMidiStateChange = null;
}

MidiManager.prototype.init = function(cbSuccess, cbFailure) {
  var _this = this;

  navigator.requestMIDIAccess().then(
    function(m) {
      _this.midi = m;
      _this.midi.onstatechange = function(e) {
        console.log('onMidiStateChange');
        if (_this.onMidiStateChange) {
          _this.onMidiStateChange(e);
        }
      };

      cbSuccess();
    },
    function() {
      alert('this browser does not have web MIDI');
      cbFailure();
    });
};

MidiManager.prototype.MidiOut = function() {
  if (!this.outPort) { return; }

  var cmdArr = [].slice.call(arguments);
  this.outPort.send(cmdArr);
};

MidiManager.prototype.MidiOutOpen = function(portID) {
  console.log('midioutopen');
  console.log(portID);
  this.outID = portID;
  this.outPort = this.midi.outputs.get(portID);
};

MidiManager.prototype.MidiInOpen = function(portID, handler) {
  console.log('midiinopen');
  console.log(portID);

  var mPort = this.midi.inputs.get(portID);
  if (!mPort) {
    console.log('midi port not found');
    return;
  }

  mPort.onmidimessage = handler;
};

MidiManager.prototype.MidiOutList = function() {
  var outputs = [];
  var it = this.midi.outputs.values();
  for (var o = it.next(); !o.done; o = it.next()) {
    var port = o.value;
    outputs.push({
      value: port.id,
      name: port.name
    });
  }
  return outputs;
};

MidiManager.prototype.MidiInList = function() {
  var inputs = [];
  var it = this.midi.inputs.values();
  for (var o = it.next(); !o.done; o = it.next()) {
    var port = o.value;
    inputs.push({
      value: port.id,
      name: port.name
    });
  }
  return inputs;
};

//MidiManager.prototype.onMidiIn = function(e) {
//  var data = e.data;
//  console.log(data);
//  var cmd = data[0] >> 4;
//  var channel = data[0] & 0x0f;
//  var type = data[0] & 0xf0;
//  var note = data[1];
//  var velocity = data[2];
//};
