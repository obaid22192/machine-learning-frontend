(function() {
  'use strict';

  angular
    .module('frontEnd')
    .directive('rightSidebar', rightSidebar);

  /** @ngInject */
  function rightSidebar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/rightSidebar/rightSidebar.html',
      scope: {
          creationDate: '='
      },
      controller: rightSidebarController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function rightSidebarController(moment, $rootScope, $scope) {
      var vm = this;
      $rootScope.labels = [];
      $rootScope.features = [];
      $scope.remove = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) list.splice(idx, 1);
      };

      // GetLabels.query().$promise.then(function(data){
      //   $scope.labels = data
      // });

      // GetFeatures.query().$promise.then(function(data){
      //   $scope.features = data
      // });


      // "vm.creation" is avaible by directive option "bindToController: true"
      vm.relativeDate = moment(vm.creationDate).fromNow();
    }
  }

})();
