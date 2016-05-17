
(function() {
  'use strict';

  angular
    .module('frontEnd')
    .directive('leftSidebar', leftSidebar);

  /** @ngInject */
  function leftSidebar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/leftSidebar/leftSidebar.html',
      scope: {
          creationDate: '='
      },
      controller: leftSidebarController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function leftSidebarController($rootScope, $scope, $state, $window, GetProjects, GetDatasets, DeleteDataset, AddDatasetsToProject) {

      $scope.currentProject = '';
      if(JSON.parse($window.localStorage.getItem('currentProject')) !== null) {
        $scope.currentProject = JSON.parse($window.localStorage.getItem('currentProject'))
      }

      $rootScope.datasets = ''
      // load all projects and datasets from current user.
      GetProjects.query().$promise.then(function(data) {
        $scope.projects = data;
        if(data.length > 0 &&  $scope.currentProject === '') {
          $window.localStorage.setItem('currentProject', JSON.stringify(data));
          $scope.currentProject = $scope.projects[0];
        }
      })
      .then(function() {
        GetDatasets.query().$promise.then(function(data){
          $rootScope.datasets = data;
        });
      });

      $scope.$watch('currentProject', function(newValue, oldValue) {
        if(newValue !== oldValue) {
          $scope.currentProject = newValue;
          $window.localStorage.clear();
          $window.localStorage.setItem('currentProject', JSON.stringify(newValue));
          $state.go('home.route2', {}, { reload: true });
        }
      });

      $scope.openMenu = function($mdOpenMenu, ev) {
        $mdOpenMenu(ev);
      };

      $scope.deleteData = function(data) {
        DeleteDataset.delete({
          dId: data.data_set_id
        }).$promise.then(function(data_) {
          var index = $rootScope.datasets.indexOf(data);
          if (index > -1) $rootScope.datasets.splice(index, 1);
        }), function(error) {
          console.log(error);
        };
      };

      $scope.addToProject = function(data) {
        AddDatasetsToProject.add({
          pId: $scope.currentProject.project_id,
          dId: data.data_set_id
        }).$promise.then(function(response) {
          $rootScope.datasets = response;
        });
      };
    }

  }

})();
