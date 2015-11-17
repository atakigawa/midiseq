angular
  .module('midiseq')
  .factory('MidiLibModel', MidiLibModel);

MidiLibModel.$inject = [];

function MidiLibModel() {
  var self = function() { };
  self.prototype.getMidiManager = function(params) {
    return new MidiManager(params);
  };

  return self;
}

/* MidiManager */
function MidiManager(params) {
  this.io = new SocketIOClient(params);
}

MidiManager.prototype.MidiOut = function() {
  var cmdArr = [].slice.call(arguments);
  this.io.MidiOut(cmdArr);
};

MidiManager.prototype.MidiOutOpen = function(channelNum) {
  this.io.MidiOutOpen(channelNum);
};

MidiManager.prototype.MidiInOpen = function(channelNum, handler) {
  return this.io.MidiInOpen(channelNum, handler);
};

MidiManager.prototype.MidiOutList = function() {
  return [
    {value: 0, name: '0: default'}
  ];
};

MidiManager.prototype.MidiInList = function() {
  return [
    {value: 0, name: '0: default'}
  ];
};

/* SocketIOClient */
function SocketIOClient(params) {
  var socket = io(params.url);
  socket.on('connect', function(){
    socket.emit('ping', {msg: 'ping msg from browser'});
  });
  socket.on('pong', function(m) {
    console.log('pong has returned');
    console.log(m);
  });
  socket.on('disconnect', function(){});
  this.socket = socket;
}

SocketIOClient.prototype.MidiOut = function(cmdArr) {
  this.socket.emit('midi_c2s', cmdArr)
};

SocketIOClient.prototype.MidiOutOpen = function(channelNum) {
  // nothing to do
};

SocketIOClient.prototype.MidiInOpen = function(channelNum, handler) {
  this.socket.on('midi_s2c', function(m) {
    handler(m);
  });
  return -1;
};
