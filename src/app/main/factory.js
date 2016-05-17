(function() { 'use strict';

  angular
    .module('frontEnd.services', ['frontEnd','ngResource'])

    .factory('LoginUser', LoginUser)
    .factory('LogoutUser', LogoutUser)
    .factory('CreateUser', CreateUser)

    .factory('GetDatasets', GetDatasets)
    .factory('UploadDataset', UploadDataset)
    .factory('DeleteProjectDatasets', DeleteProjectDatasets)
    .factory('GetProjects', GetProjects)
    .factory('CreateNewProject', CreateNewProject)
    .factory('Authenticated', Authenticated)
    .factory('GetMLAlgos', GetMLAlgos)
    .factory('LoadPredictObj', LoadPredictObj)
    .factory('RegPredict', RegPredict)
    .factory('LoadExperiments', LoadExperiments)
    .factory('DeleteDataset', DeleteDataset)
    .factory('AddDatasetsToProject', AddDatasetsToProject)
    .factory('RetrieveResults', RetrieveResults)
    .factory('NotifyService', NotifyService)
    .factory('RequestIntercepter', RequestIntercepter);

    var serviceBase = "data/";


    /** @ngInject */

  function LoginUser($resource, baseUrl) {
    return $resource(baseUrl + '/login', {},
    {
      login:
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
    });
  }

  function Authenticated($window, $cookies) {
    return function() {
      if($cookies.get('user')) {
        console.log($cookies.get('user'));
        return true;
      }
      else {
        return false;
      }
    }
  }

  function LogoutUser($resource) {
    return $resource(serviceBase + 'logoutUser', {}, {});
  }

  function CreateUser($resource, baseUrl) {
    return $resource(baseUrl + '/register', {},
    {
      signup:
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
    });
  }

  function CreateNewProject($resource, baseUrl) {
        return $resource(baseUrl + '/create_new_project', {},
        {
          create:
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            }
        });
      }

  function GetProjects($resource, baseUrl) {
    return $resource(baseUrl + '/get_projects', {},
    {
      query:
        {
          method: 'Get',
          isArray: true
        }
    });
  }

  function GetDatasets($resource, baseUrl) {
    return $resource(baseUrl + '/datasets', {},
    {
      query:
        {
          method: 'GET',
          cache: false,
          isArray: true
        }
    });
  }

  function UploadDataset($resource, baseUrl) {
      return $resource(baseUrl + '/upload_data/:pId', {pId: '@pId'},
      {
        upload:
          {
            method: 'POST',
            transformRequest: angular.identity,
            headers: {
              'Content-Type': undefined
            }
          }
      });
    }

  function DeleteProjectDatasets($resource, baseUrl) {
    return $resource(baseUrl + '/delete-data/:pId/:dId', {
       pId:'@pId', dId:'@dId'
    },
    {
      del:
        {
          method: 'GET',
           headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          isArray: true
        }
    });
  }

  function DeleteDataset($resource, baseUrl) {
    return $resource(baseUrl + '/delete-data/:dId', {
      dId: '@dId'
    },
    {
      delete:
        {
          method: 'GET',
          transformRequest: angular.identity,
          headers: {
            'Content-Type': undefined
          },
          cache: false
        }
    });
  }

  function AddDatasetsToProject($resource, baseUrl) {
    return $resource(baseUrl + '/add-data/:pId/:dId', {
       pId:'@pId',
       dId:'@dId'
    },
    {
      add:
        {
          method: 'POST',
           headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          isArray: true
        }
    });
  }

  function RetrieveResults($resource, baseUrl) {
    return $resource(baseUrl + '/results/:eId', {
       dId:'@eId'
    },
    {
      query:
        {
          method: 'GET',
           headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          isArray: true
        }
    });
  }

  function GetMLAlgos($resource, baseUrl) {
    return $resource(baseUrl + '/predict', {},
    {
      query:
        {
          method: 'GET',
          cache: false,
          isArray: true
        }
    });
  }

  function RegPredict($resource, baseUrl) {
    return $resource(baseUrl + '/predict', {},
    {
      predict:
        {
          method: 'POST',
          transformRequest: angular.identity,
          headers: {
            'Content-Type': undefined
          },
          cache: false,
          isArray: true
        }
    });
  }

  function LoadPredictObj($resource, baseUrl) {
    return $resource(baseUrl + '/load-project', {},
    {
      load:
        {
          method: 'POST',
          transformRequest: angular.identity,
          headers: {
            'Content-Type': undefined
          },
          cache: false
        }
    });
  }

  function LoadExperiments($resource, baseUrl) {
    return $resource(baseUrl + '/experiments/:pId', {
      pId: '@pId'
    },
    {
      load:
        {
          method: 'GET',
          transformRequest: angular.identity,
          headers: {
            'Content-Type': undefined
          },
          cache: false,
          isArray: true
        }
    });
  }

  function NotifyService($injector) {

    return {
      notify: function(message) {
        var $mdToast = $injector.get("$mdToast")
        $mdToast.show(
          $mdToast.simple()
            .content(message)
            // .position({bottom: true})
            .hideDelay(3000)
        );
      }
    }
  }

  function RequestIntercepter(NotifyService) {
    return {
      responseError: function(response) {
        console.log(response);
        if(response.status === 401) {
          NotifyService.notify('Please log in!');
          return response;
        }
        else if(response.status === -1){
          NotifyService.notify('Error occured while connection to remote serve. kindly check your internet connection and try again!');
          return response;
        }
        else {
          NotifyService.notify(response.data);
          return response;
        }
      }
    }
  }

})();
