(function() {
  'use strict';

  angular
    .module('frontEnd.controller', [])
    .controller('MainController', MainController );

  /** @ngInject */
  function MainController($rootScope, $scope) {
    console.log($rootScope.authenticated);
    $scope.columns = [{
        name: "column1",
        selected: true
    },
    {
        name: "column2",
        selected: false
    }];

    // GetDatasets.query().$promise.then(function(data){
    //   $scope.datasets = data
    // });
  }
})();
