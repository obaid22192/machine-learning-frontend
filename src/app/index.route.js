(function() {
  'use strict';

  angular
    .module('frontEnd')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'app/main/main.html',
            controller: 'MainController',
            controllerAs: 'main'
        })
        .state('home.route1', {
            url: "/route1",
            templateUrl: "app/components/datasetView/datasetView.html",
            controller: 'datasetViewController',
            params: {
                dataset: null,
                project_id: null
            }
        })
        .state('home.route2', {
            url: "/route2",
            templateUrl: "app/components/runView/runView.html",
            controller: 'runViewController'
        })
        .state('home.adddataset', {
            url: "/upload",
            templateUrl: "app/components/upload/upload.html",
            controller: 'uploadDataploadController',
            params: {
              project_id: null
            }
        });

    $urlRouterProvider.otherwise('/');
  }

})();
