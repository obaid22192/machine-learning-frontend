(function() {
  'use strict';
  angular
    .module('frontEnd')
    .directive('acmeNavbar', acmeNavbar);

  /** @ngInject */
  function acmeNavbar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/navbar/navbar.html',
      scope: {
          creationDate: '='
      },
      controller: NavbarController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function NavbarController($mdDialog, $mdMedia, $scope, $mdSidenav, $window, moment, $httpParamSerializer) {
      var vm = this;
      $scope.projctName = '';
      $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

      // "vm.creation" is avaible by directive option "bindToController: true"
      vm.relativeDate = moment(vm.creationDate).fromNow();

      $scope.toggleSidenav = function(menuId) {
          $mdSidenav(menuId).toggle();
      };
      $scope.closeSidenav = function(menuId) {
          $mdSidenav(menuId).close();
      };
      $scope.showLoginDialog = function(ev) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
        $mdDialog.show({
          controller: DialogController,
          templateUrl: 'app/components/login/login.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: useFullScreen
        });
      };

      $scope.showSignupDialog = function(ev) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
        $mdDialog.show({
          controller: DialogController,
          templateUrl: 'app/components/signup/signup.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: useFullScreen
        });
      };

      $scope.showNewDialog = function(ev) {
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
        $mdDialog.show({
          controller: DialogController,
          templateUrl: 'app/components/navbar/newProjectDialog.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: useFullScreen
        });
      };

    function DialogController($rootScope, $scope, $mdDialog, $httpParamSerializer, $window, LoginUser, CreateNewProject, CreateUser) {
      $scope.hide = function() {
        $mdDialog.hide();
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      $scope.login = function(user) {
        LoginUser.login($httpParamSerializer({
          email: user.email,
          password: user.password
        })).$promise.then(function(data) {
          $mdDialog.hide(user);
          $window.location.reload();
        }, function(error){
          console.log(error);
        });
      };
      $scope.signup = function(user) {
        CreateUser.signup($httpParamSerializer({
          email: user.email,
          password: user.password
        })).$promise.then(function(data) {
          $mdDialog.hide(user);
        });

      };

      $scope.createNewProject = function() {
           CreateNewProject.create($httpParamSerializer({
             project_name: $scope.projctName
           })).$promise.then(function(data) {
             $scope.projctName = '';
             $window.localStorage.clear();
             $window.localStorage.setItem('currentProject', JSON.stringify(data));
             $window.location.reload();
           });
         }
      };

    }

  }

})();
