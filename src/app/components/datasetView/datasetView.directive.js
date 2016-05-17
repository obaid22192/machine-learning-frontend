(function() {
  'use strict';

  angular
    .module('frontEnd')
    .directive('datasetView', datasetView);

  /** @ngInject */
    function datasetView() {
        var directive = {
          restrict: 'E',
          templateUrl: 'app/components/datasetView/datasetView.html',
          scope: {
              creationDate: '='
          },
          controllerAs: 'vm',
          bindToController: true
        };

        return directive;
    }

})();
