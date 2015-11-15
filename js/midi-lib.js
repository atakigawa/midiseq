/* MidiManager */
function MidiManager(interfaceType, params) {
  if (interfaceType !== 'socket.io') {
    alert('unsupported interface type');
    return;
  }

  this.interfaceType = interfaceType;
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
  this.io.MidiInOpen(channelNum, handler);
};

MidiManager.prototype.MidiOutList = function() {
  return [0];
};

MidiManager.prototype.MidiInList = function() {
  return [0];
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
  socket.on('midi_s2c', function(m) {
    handler(m);
  });
};
