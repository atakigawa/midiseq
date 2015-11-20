angular
  .module('midiseq')
  .factory('SeqGenClientService', SeqGenClientService);

SeqGenClientService.$inject = [];

function SeqGenClientService(params) {
  return {
    getClient: getClient
  };

  function getClient(params) {
    return new SeqGenSocketIOClient(params);
  }
}

/* SocketIOClient */
function SeqGenSocketIOClient(params) {
  var socket = io(params.url);
  socket.on('connect', function(){
    socket.emit('ping', {msg: 'ping seq-gen socket.io'});
  });
  socket.on('pong', function(m) {
    console.log('pong has returned');
    console.log(m);
  });
  socket.on('disconnect', function(){});
  this.socket = socket;
}

SeqGenSocketIOClient.prototype.genSeq = function(params) {
  this.socket.emit('genSeq', params)
};
