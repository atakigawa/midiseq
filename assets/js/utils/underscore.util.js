// register underscore library with '_'
angular
  .module('midiseq')
  .factory('_', function() {
    return _;
  });
