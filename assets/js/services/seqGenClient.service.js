angular
  .module('midiseq')
  .factory('SeqGenClientService', SeqGenClientService);

SeqGenClientService.$inject = [];

function SeqGenClientService(params) {
  return {
    getClient: getClient
  };

  function getClient(params) {
    return new SocketIOClient(params);
  }
}

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

SocketIOClient.prototype.genSeq = function(params) {
  this.socket.emit('genSeq', params)
};
