angular
  .module('midiseq')
  .config(routeMatrixApp);

routeMatrixApp.$inject = [
  '$routeProvider'
];

function routeMatrixApp($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/templates/top.index',
      controller: 'IndexController',
      controllerAs: 'vm',
      title: 'midiseq'
    })
    .otherwise({redirectTo: '/'});
}
