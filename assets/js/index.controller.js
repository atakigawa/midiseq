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
  vm.isSetupPanelVisible = true;

  vm.toggleSetupPanelVisible = toggleSetupPanelVisible;

  init();

  function init() {
    var midiMgr = MidiService.getMidiManager();
    console.log(midiMgr)
    var seqGenClient = SeqGenClientService.getClient({
      url: location.host + '/ws/midi'
    })
    vm.player = new PlayerLibModel().getPlayer({
      mst: vm.mst,
      midiManager: midiMgr
    });
    vm.player.PreInit();
  }

  function toggleSetupPanelVisible() {
    vm.isSetupPanelVisible = !vm.isSetupPanelVisible;
  }
}
