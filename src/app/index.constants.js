/* global malarkey:false, moment:false */
(function() {
  'use strict';

  angular
    .module('frontEnd')
    .constant('malarkey', malarkey)
    .constant('moment', moment)
    .provider('baseUrl', baseUrl);


  function baseUrl() {
    var apiUrl;
    var location = window.location;
    if(window.jasmine) {
      // We're unittesting.
      apiUrl = '';
    } else if(/localhost|((\d{1,3}\.){3}\d{1,3})/.test(location.hostname)) {
      // We're debugging on a host without a domain name.
      apiUrl = 'http://' + location.hostname + ':8901';
    } else {
      // We're running live.
      apiUrl = '';
    }

    this.$get = function() {
      return apiUrl;
    };
  }

})();
