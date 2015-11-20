angular
  .module('midiseq')
  .factory('MidiService', MidiService);

MidiService.$inject = [];

function MidiService() {
  return {
    getMidiManager: getMidiManager
  }

  function getMidiManager(params) {
    return new MidiManager(params);
  }
}

function MidiManager(params) {
  this.io = new MidiSocketIOClient(params);
}

MidiManager.prototype.init = function(cbSuccess, cbFailure) {
  // nothing to do. just call success cb.
  cbSuccess();
};

MidiManager.prototype.MidiOut = function() {
  var cmdArr = [].slice.call(arguments);
  this.io.sendMidi(cmdArr);
};

MidiManager.prototype.MidiOutOpen = function(portID) {
  // nothing to do
};

MidiManager.prototype.MidiInOpen = function(portID, handler) {
  // nothing to do
};

MidiManager.prototype.MidiOutList = function() {
  return [
    {value: 0, name: 'default'}
  ];
};

MidiManager.prototype.MidiInList = function() {
  return [];
};

/* SocketIOClient */
function MidiSocketIOClient(params) {
  var socket = io(params.url);
  socket.on('connect', function(){
    socket.emit('ping', {msg: 'ping midi socket.io'});
  });
  socket.on('pong', function(m) {
    console.log('pong has returned');
    console.log(m);
  });
  socket.on('disconnect', function(){});
  this.socket = socket;
}

MidiSocketIOClient.prototype.sendMidi = function(arr) {
  this.socket.emit('midi_c2s', arr)
};

// Web MIDI test...
//function MidiManager() {
//  this.midi = null;
//  this.outID = -1;
//  this.outPort = null;
//  this.onMidiStateChange = null;
//}
//
//MidiManager.prototype.init = function(cbSuccess, cbFailure) {
//  var _this = this;
//
//  navigator.requestMIDIAccess().then(
//    function(m) {
//      _this.midi = m;
//      _this.midi.onstatechange = function(e) {
//        console.log('onMidiStateChange');
//        if (_this.onMidiStateChange) {
//          _this.onMidiStateChange(e);
//        }
//      };
//
//      cbSuccess();
//    },
//    function() {
//      alert('this browser does not have web MIDI');
//      cbFailure();
//    });
//};
//
//MidiManager.prototype.MidiOut = function() {
//  if (!this.outPort) { return; }
//
//  var cmdArr = [].slice.call(arguments);
//  this.outPort.send(cmdArr);
//};
//
//MidiManager.prototype.MidiOutOpen = function(portID) {
//  console.log('midioutopen');
//  console.log(portID);
//  this.outID = portID;
//  this.outPort = this.midi.outputs.get(portID);
//};
//
//MidiManager.prototype.MidiInOpen = function(portID, handler) {
//  console.log('midiinopen');
//  console.log(portID);
//
//  var mPort = this.midi.inputs.get(portID);
//  if (!mPort) {
//    console.log('midi port not found');
//    return;
//  }
//
//  mPort.onmidimessage = handler;
//};
//
//MidiManager.prototype.MidiOutList = function() {
//  var outputs = [];
//  var it = this.midi.outputs.values();
//  for (var o = it.next(); !o.done; o = it.next()) {
//    var port = o.value;
//    outputs.push({
//      value: port.id,
//      name: port.name
//    });
//  }
//  return outputs;
//};
//
//MidiManager.prototype.MidiInList = function() {
//  var inputs = [];
//  var it = this.midi.inputs.values();
//  for (var o = it.next(); !o.done; o = it.next()) {
//    var port = o.value;
//    inputs.push({
//      value: port.id,
//      name: port.name
//    });
//  }
//  return inputs;
//};
//
//MidiManager.prototype.onMidiIn = function(e) {
//  var data = e.data;
//  console.log(data);
//  var cmd = data[0] >> 4;
//  var channel = data[0] & 0x0f;
//  var type = data[0] & 0xf0;
//  var note = data[1];
//  var velocity = data[2];
//};

