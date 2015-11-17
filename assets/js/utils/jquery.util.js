// register jquery library with 'jq'
angular
  .module('midiseq')
  .factory('jq', function() {
    return $;
  });
