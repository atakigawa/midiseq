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
}

MidiManager.prototype.MidiOut = function() {
  var cmdArr = [].slice.call(arguments);
  //this.io.MidiOut(cmdArr);
  console.log(cmdArr);
};

MidiManager.prototype.MidiOutOpen = function(channelNum) {
  //this.io.MidiOutOpen(channelNum);
  console.log('midioutopen');
};

MidiManager.prototype.MidiInOpen = function(channelNum, handler) {
  //return this.io.MidiInOpen(channelNum, handler);
  console.log('midiinopen');
};

MidiManager.prototype.MidiOutList = function() {
  console.log('MidiOutList');
  return [
    {value: 0, name: '0: default'}
  ];
};

MidiManager.prototype.MidiInList = function() {
  console.log('MidiInList');
  return [
    {value: 0, name: '0: default'}
  ];
};
