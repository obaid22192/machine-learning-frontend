(function() {
  'use strict';

  angular
    .module('frontEnd')
    .run(runBlock);

  /** @ngInject */
  function runBlock($http , $rootScope, $log, baseUrl) {
    $rootScope.authenticated = false;
    $rootScope.$on('$stateChangeStart',
      function(event, toState, toParams, fromState, fromParams){
          // event.preventDefault();
          $http({
            method: 'GET',
            url: baseUrl
          }).then(function(response){
            if(response.status === 401) {
              $rootScope.authenticated = false;
            }
            else {
              $rootScope.authenticated = true;
            }
          });
      })

    $log.debug('runBlock end');
  }
})();
