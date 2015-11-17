angular
  .module('midiseq')
  .factory('MasterData', MasterData);

MasterData.$inject = ['_', 'jq'];

function MasterData(_, jq) {
  var mst = {};
  addConsts(mst);
  addPlayerMasters(mst);
  addSequencerMasters(mst);
  addSequenceElementMasters(mst);

  function addConsts(obj) {
    obj.C = {
      SYNC: {
        SEND: 1, RECV: 2, NONE: 3
      },
      LOOP: {
        FWD: 1, REV: 2, PINGPONG: 3, INNER_PINGPONG: 4
      }
    };
  }

  function addPlayerMasters(obj) {
    obj.tempoList = _.map(_.range(40, 241), function(e) {
      return {value: e, name: e};
    });
    obj.syncList = [
      {value: obj.C.SYNC.SEND, name: 'Send'},
      {value: obj.C.SYNC.RECV, name: 'Receive'},
      {value: obj.C.SYNC.NONE, name: 'Neither'}
    ];
  }

  function addSequencerMasters(obj) {
    // from http://www.g200kg.com/teburin/
    obj.scaletab = [
      { name: "Chromatic",         notes: [1,1,1,1,1,1,1,1,1,1,1,1] },
      { name: "Major",             notes: [1,0,1,0,1,1,0,1,0,1,0,1] },
      { name: "Natural Minor",     notes: [1,0,1,1,0,1,0,1,1,0,1,0] },
      { name: "Harmonic Minor",    notes: [1,0,1,1,0,1,0,1,1,0,0,1] },
      { name: "Whole Tone",        notes: [1,0,1,0,1,0,1,0,1,0,1,0] },
      { name: "Diminish",          notes: [1,0,1,1,0,1,1,0,1,1,0,1] },
      { name: "Major Pentatonic",  notes: [1,0,1,0,1,0,0,1,0,1,0,0] },
      { name: "Minor Pentatonic",  notes: [1,0,0,1,0,1,0,1,0,0,1,0] },
      { name: "Blues",             notes: [1,0,0,1,0,1,1,1,0,1,1,0] },
      { name: "Gamelan",           notes: [1,1,0,1,0,0,0,1,1,0,0,0] },
    ];

    obj.ntable = ['C-', 'C#', 'D-', 'D#', 'E-', 'F-', 'F#', 'G-', 'G#', 'A-', 'A#', 'B-'];

    obj.scaleList = _.map(obj.scaletab, function(e, i) {
      return {value: i, name: e.name};
    });
    obj.rangeList = _.map(_.range(1, 7), function(e) {
      return {value: e, name: e};
    });
    obj.channelList = _.map(_.range(1, 17), function(e) {
      return {value: e, name: e};
    });
    obj.triggerList = _.map(_.range(1, 25), function(e) {
      return {value: e, name: e};
    });
    obj.transposeList = _.map(_.range(-48, 49), function(e) {
      return {value: e, name: e};
    });
    obj.loopList = [
      {value: obj.C.LOOP.FWD, name: 'Forward'},
      {value: obj.C.LOOP.REV, name: 'Backward'},
      {value: obj.C.LOOP.PINGPONG, name: 'Pingpong'},
      {value: obj.C.LOOP.INNER_PINGPONG, name: 'Inner'}
    ];
  }

  function addSequenceElementMasters(obj) {
    obj.noteList = _.map(_.range(128), function(e) {
      return {value: e, name: noteNum2str(obj.ntable, e)};
    }).reverse();
    obj.repeatList = _.map(_.range(1, 9), function(e) {
      return {value: e, name: e};
    });
    obj.noteOffList = _.map(_.range(25), function(e) {
      return {value: e, name: e};
    });

    function noteNum2str(table, n) {
      return table[n%12] + (parseInt(n/12) - 1).toString();
    }
  }

  return mst;
}
