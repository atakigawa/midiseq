angular
  .module('midiseq')
  .factory('PlayerLibModel', PlayerLibModel);

PlayerLibModel.$inject = ['_', 'jq'];

function PlayerLibModel(_, jq) {
  var tcount = 0; // total ticks playing

  var self = function() { };
  self.prototype.getPlayer = function(params) {
    return new Player(params);
  };

  return self;

  function SequenceElement(params) {
    this.id = params.id;
    this.pos = params.pos;
    this.note = params.note;
    this.repeat = params.repeat;
    this.noteOff = params.noteOff;
    this.reTrig = params.reTrig;
  }

  function Sequencer(params) {
    var mst = params.mst;

    this.midiMgr = params.midiManager;
    this.name      = params.name;
    this.muted     = false;

    this.currentIdx = 0;
    this.lastNote = 0;
    this.repPos = 0;
    this.lastNoteOff = 0;
    this.loopPos = 0;
    this.totalSteps = 0;

    this.scale = mst.scaleList[0]; //0
    this.range = mst.rangeList[2]; // 3
    this.channel = _.find(mst.channelList, function(e) {
      return e.value == params.channel;
    });
    this.trigger = mst.triggerList[5]; // 6
    this.transpose = mst.transposeList[48]; // 0
    this.loop = mst.loopList[0]; // FWD

    this.numSeqElems = 8;
    this.seqElems = [];

    // Init patch, see this.Reset()
    for (i = 0; i < this.numSeqElems; i++) {
      var seqElem = new SequenceElement({
        id: this.name + '-' + (i + 1),
        pos: i + 1,
        note: mst.noteList[i%2==0 ? 127-60 : 127-72], // c4/c5
        repeat: mst.repeatList[0], // 1
        noteOff: mst.noteOffList[0], // 0
        reTrig: true
      });
      this.seqElems.push(seqElem);
    }

    this.sendChannelMsg = function(s1msb, d1, d2) {
      var chan = this.channel.value - 1;
      this.midiMgr.MidiOut(s1msb + chan, d1, d2);
    };

    this.Export = function() {
      return {
        name: this.name,
        channel: this.channel.value,
        trigger: this.trigger.value,
        transpose: this.transpose.value,
        mute: this.muted,
        loop: this.loop.value,
        seqElems: _.map(this.seqElems, function(e) {
          return {
            id: e.id,
            pos: e.pos,
            note: e.note.value,
            repeat: e.repeat.value,
            reTrig: e.reTrig.value,
            noteOff: e.noteOff.value
          };
        })
      };
    }

    this.updateTotalSteps = function() {
      var ts = 0;
      _.each(this.seqElems, function(e) {
        ts += e.repeat.value;
      });
      this.totalSteps = ts;
    }

    this.changeMute = function() {
      this.Stop();
    }

    this.PreInit = function() {
      this.updateTotalSteps();
    }

    this.Refresh = function() {
      this.updateTotalSteps();
    }

    this.Randomize = function() {
      var scaleNoteArr = mst.scaletab[this.scale.value].notes;
      var range = this.range.vaue;

      _.each(this.seqElems, function(e) {
        var note;
        // pick note
        do {
          note = parseInt(Math.random() * 12);
        } while (scaleNoteArr[note] != 1);
        // pick octave using base note 48. greater ranges starts lower.
        var octaveDiff =
          parseInt(Math.random()*range) - (range > 3 ? range - 3 : 0);
        note += 48 + octaveDiff * 12;
        e.note = _.find(mst.noteList, function(e) {
          return e.value == note;
        });

        e.repeat  = mst.repeatList[parseInt(Math.random()*4)];
        e.noteOff = mst.noteOffList[parseInt(Math.random()*12)];
        e.reTrig  = !!parseInt(Math.random()+0.5);
      });
      this.Refresh();
      // all note off msg
      this.sendChannelMsg(0xb0, 0x7b, 0);
    }

    this.Reset = function() {
      _.each(this.seqElems, function(e, i) {
        e.note = mst.noteList[i%2==0 ? 127-60 : 127-72]; // c4/c5
        e.repeat =  mst.repeatList[0]; // 1
        e.noteOff = mst.noteOffList[0]; // 0
        e.reTrig = true;
      });
      this.Refresh();
      // all note off msg
      this.sendChannelMsg(0xb0, 0x7b, 0);
    }

    //this.SetDefault = function() {
    //  if (this.channel == 1) {
    //    this.midiMgr.MidiOut(0xc0+this.channel-1, 38, 0); // synth bass
    //  } else if (this.channel == 2) {
    //    this.midiMgr.MidiOut(0xc0+this.channel-1, 81, 0); // saw lead
    //  }
    //}

    this.Init = function() {
      if (this.loop.value == mst.C.LOOP.REV) {
        this.currentIdx = this.numSeqElems - 1;
      } else {
        this.currentIdx = 0;
      }

      this.lastNote = 0;
      this.repPos = 0;
      this.lastNoteOff = 0;
      this.loopPos = 0;
    }

    this.Stop = function() {
      this.sendChannelMsg(0x80, this.lastnote, 0);
      // all sound off msg
      this.sendChannelMsg(0xb0, 0x78, 0);
      // all note off msg
      this.sendChannelMsg(0xb0, 0x7b, 0);
    }

    function doHighlightEffect(seqElem, color, duration) {
      var hlPanel = $('#'+seqElem+'-hl');
      hlPanel
        .css('background-color', color)
        .show()
        .fadeOut(duration);
    }

    // called each midi event 1/24 trig
    this.Playnote = function() {
      if (--this.lastNoteOff == 0) {
        this.sendChannelMsg(0x80, this.lastNote, 0);
      }
      if ((tcount % this.trigger.value) != 0) {
        return;
      }

      var cElem = this.seqElems[this.currentIdx];
      var note = cElem.note.value + this.transpose.value;
      var trg = cElem.reTrig || this.repPos === 0;
      if (trg) {
        if (!this.muted) {
          this.sendChannelMsg(0x80, this.lastNote, 0);
          this.sendChannelMsg(0x90, note, 127);
          doHighlightEffect(cElem.id, '#ff6600', 50);
        } else {
          doHighlightEffect(cElem.id, '#cccccc', 50);
        }
      }

      this.lastNote = note;
      this.lastNoteOff =
        cElem.noteOff.value * (cElem.reTrig ? 1 : cElem.repeat.value);

      this.repPos++;
      if (this.repPos >= cElem.repeat.value) {
        // move to next sequence element.
        // reset repeat counter.
        this.repPos = 0;

        var loop = this.loop.value;
        if (loop == mst.C.LOOP.FWD) {
          // forward
          this.currentIdx++;
          if (this.currentIdx >= this.numSeqElems) {
            this.currentIdx = 0;
          }
        } else if (loop == mst.C.LOOP.REV) {
          // backward
          this.currentIdx--;
          if (this.currentIdx < 0) {
            this.currentIdx = this.numSeqElems - 1;
          }
        } else if (loop == mst.C.LOOP.PINGPONG ||
            loop == mst.C.LOOP.INNER_PINGPONG) {
          if (this.loopPos == 0) {
            // pingpong/inner-pingpong forward
            this.currentIdx++;
            if (this.currentIdx >= this.numSeqElems) {
              // when turning back,
              // pingpong repeats the edge element but
              // inner-pingpong does not.
              this.currentIdx =
                loop == mst.C.LOOP.INNER_PINGPONG ?
                  this.numSeqElems - 2 : this.numSeqElems - 1;
              this.loopPos = 1;
            }
          } else {
            // pingpong/inner-pingpong backward
            this.currentIdx--;
            if (this.currentIdx < 0) {
              // when turning back,
              // pingpong repeats the edge element but
              // inner-pingpong does not.
              this.currentIdx =
                loop == mst.C.LOOP.INNER_PINGPONG ? 1 : 0;
              this.loopPos = 0
            }
          }
        } else {
          alert("Cant be here.");
        }
      }
    }
  }; // Sequencer


  // Global midi input handler
  var midiHandlerId;
  var midiInPlaying = false;
  function midiHandler(player, cmdArr) {
    var a = cmdArr[0];
    switch(a) {
      case 0xf8: // clock msg
        if (midiInPlaying) {
          player.tick();
        }
        break;
      case 0xfa: // start msg
        player.Init();
        midiInPlaying = true;
        console.log('Remote start.');
        break;
      case 0xfc: // stop msg
        player.Stop();
        midiInPlaying = false;
        console.log('Remote stop.');
        break;
      default:
        console.log('Unknown remote message');
        console.log(a);
        break;
    }
  }

  // Player object which holds one or more sequencers.
  function Player(params) {
    var mst = params.mst;
    var _this = this;

    this.midiMgr = params.midiManager;
    this.isPlaying  = false;
    this.interval = 20;
    this.loopFuncToken  = null;

    this.midiInList = this.midiMgr.MidiInList();
    this.midiOutList = this.midiMgr.MidiOutList();

    this.midiIn = this.midiInList[0];
    this.midiOut = this.midiOutList[0];
    this.tempo = mst.tempoList[80]; // 120
    this.sync = mst.syncList[0];

    this.sequencers = [
      new Sequencer({
        midiManager: params.midiManager,
        mst: mst,
        name: 'seq01',
        channel: 1
      }),
      new Sequencer({
        midiManager: params.midiManager,
        mst: mst,
        name: 'seq02',
        channel: 2
      }),
    ];

    this.sendSystemMsg = function(s1) {
      this.midiMgr.MidiOut(s1);
    };

    this.Save = function() {
      var out = {
        seq: _.map(this.sequencers, function(e) {
          return e.Export();
        })
      };
      localStorage.setItem('midiseq-xxxx', JSON.stringify(out));
    }

    this.PreInit = function() {
      this.initmidi();
      _.each(this.sequencers, function(e) {
        e.PreInit();
      });
    }

    this.Stop = function() {
      _.each(this.sequencers, function(e) {
        e.Stop();
      });
    }

    this.Init = function() {
      tcount = 0;
      _.each(this.sequencers, function(e) {
        e.Init();
      });
      this.tick();
    }

    this.TogglePlay = function() {
      if (this.isPlaying) {
        this.Stop();
        if (this.sync.value == mst.C.SYNC.SEND) {
          this.sendSystemMsg(0xfc);
        }
        this.isPlaying = false;
        clearInterval(this.loopFuncToken);
        console.log("Stopped.");
      } else {
        if (this.sync.value == mst.C.SYNC.SEND) {
          this.sendSystemMsg(0xfa);
        }
        this.isPlaying = true;
        this.Init();
        this.loopFuncToken = setInterval(function() {
          _this.tick();
        }, this.interval);
        console.log("Playing.");
      }
    }

    this.tick = function() {
      if (_this.sync.value == mst.C.SYNC.SEND) {
        _this.sendSystemMsg(0xf8);
      }
      _.each(_this.sequencers, function(e) {
        e.Playnote();
      });
      tcount++;
    }

    this.initmidi = function() {
      var mOutVal = this.midiOut.value;
      var mInVal = this.midiIn.value;
      console.log('Output Device: '+mOutVal+' Input Device: '+mInVal);
      this.midiMgr.MidiOutOpen(mOutVal);
      if (this.mInVal != 0) {
        this.midiMgr.MidiInOpen(this.mInVal, function() {
          var args = [].slice.call(arguments);
          midiHandler(_this, args);
        });
      }
    }

    this.changetempo = function() {
      this.interval = 60000.0 / this.tempo.value / 24;
    }

    this.changesync = function() {
      jq("#play").removeAttr("disabled");
      jq("#tempo").removeAttr("disabled");

      // setup midi input
      if (this.sync.value == mst.C.SYNC.RECV) {
        jq("#play").attr("disabled", "disabled");
        jq("#tempo").attr("disabled", "disabled");
        midiHandlerId =
          this.midiMgr.MidiInOpen(this.midiIn.value, function() {
            var args = [].slice.call(arguments);
            midiHandler(_this, args);
          });
      }
    }
  };
}
