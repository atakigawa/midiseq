angular
  .module('midiseq', [
    'ngRoute',
    'ngResource',
  ])
  .config(configureMatrixApp);

configureMatrixApp.$inject = [
  '$locationProvider',
  '$httpProvider'
];

function configureMatrixApp(
  $locationProvider,
  $httpProvider
) {
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: true
  });

  $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
}
