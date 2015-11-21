angular
  .module('midiseq')
  .controller('IndexController', IndexController);

IndexController.$inject = [
  '$location', '$window', '$routeParams', '$controller',
  '$log', '_', 'jq',
  'MidiService', 'SeqGenClientService', 'PlayerLibModel', 'MasterData'
];

function IndexController(
  $location, $window, $routeParams, $controller,
  $log, _, jq,
  MidiService, SeqGenClientService, PlayerLibModel, MasterData
) {
  var vm = this;

  vm.mst = MasterData;
  vm.player = null;
  vm.midiMgr = null;
  vm.isSetupPanelVisible = true;

  vm.toggleSetupPanelVisible = toggleSetupPanelVisible;
  vm.refreshDeviceList = refreshDeviceList;

  init();

  function init() {
    var urlSeqGen = location.host + '/ws/seq-gen';
    var urlMidi = location.host + '/ws/midi';
    var midiMgr = MidiService.getMidiManager({
      url: urlMidi
    });
    vm.midiMgr = midiMgr;

    midiMgr.init(
      function() {
        vm.player = new PlayerLibModel().getPlayer({
          mst: vm.mst,
          midiManager: midiMgr
        });
        vm.player.PreInit();

        midiMgr.onMidiStateChange = function() {
          vm.player.refreshDeviceList();
        };
      },
      function() {
        console.log('midiMgr init failed');
      });
  }

  function toggleSetupPanelVisible() {
    vm.isSetupPanelVisible = !vm.isSetupPanelVisible;
  }

  function refreshDeviceList() {
    vm.player.refreshDeviceList();
  }
}
