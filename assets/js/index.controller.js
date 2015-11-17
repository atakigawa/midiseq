angular
  .module('midiseq')
  .controller('IndexController', IndexController);

IndexController.$inject = [
  '$location', '$window', '$routeParams', '$controller',
  '$log', '_', 'jq',
  'MidiLibModel', 'PlayerLibModel', 'MasterData'
];

function IndexController(
  $location, $window, $routeParams, $controller,
  $log, _, jq,
  MidiLibModel, PlayerLibModel, MasterData
) {
  var vm = this;

  vm.mst = MasterData;
  vm.player = null;
  vm.isSetupPanelVisible = true;

  vm.toggleSetupPanelVisible = toggleSetupPanelVisible;

  init();

  function init() {
    var url = location.host + '/ws/midi';
    var midiMgr = new MidiLibModel().getMidiManager({
      url: url
    });
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
