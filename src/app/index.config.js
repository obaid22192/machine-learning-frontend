(function() {
  'use strict';

  angular
    .module('frontEnd')
    .config(config);

  /** @ngInject */
  function config($httpProvider, $logProvider, toastrConfig) {
    // Enable log
    $httpProvider.interceptors.push('RequestIntercepter');
    $logProvider.debugEnabled(true);

    $httpProvider.defaults.withCredentials = true;
    // $httpProvider.defaults.useXDomain = true;
    // $httpProvider.defaults.headers.delete = { "Content-Type": "application/json;charset=utf-8" };

    // delete $httpProvider.defaults.headers.common['X-Requested-With'];

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.preventDuplicates = true;
    toastrConfig.progressBar = true;

  }

})();
