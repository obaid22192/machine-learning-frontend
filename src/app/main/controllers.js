/**
 * Created by timvaniersel on 18-12-15.
 */
'use strict';

angular.module('frontEnd.controllers', [])

.controller('runViewController', function($scope, $window,
                                          GetMLAlgos, RegPredict,
                                          LoadPredictObj, LoadExperiments,
                                          RetrieveResults, NotifyService) {
  $scope.currentProject = JSON.parse($window.localStorage.getItem('currentProject'));
  $scope.experiments = [];
  $scope.selected = [];
  $scope.loaded = false;
  $scope.clicked = false;
  $scope.inprogressProject = '';
  $scope.sp = function(input) {
    return input.split(' ');
  };
  $scope.files = [0];
  // var fd = new FormData();
  $scope.fileChanged = function(ele) {
    $scope.files = ele.files;
    // console.log($scope.files);
    // $scope.$apply();

    var reader = new FileReader();

    // A handler for the load event (just defining it, not executing it right now)
    reader.onload = function(e) {
        $scope.$apply(function() {
            $scope.article = reader.result;;
        });
    };
    // var csvFile = csvFileInput.files[0];
    reader.readAsText($scope.files[0]);
    // fd.append('article', $scope.files[0])
  }

  $scope.toggle = function (item, list) {
      var idx = list.indexOf(item);
      if (idx > -1) list.splice(idx, 1);
      else list.push(item);
  };

  $scope.exists = function (item, list) {
      return list.indexOf(item) > -1;
  };
  $scope.trainPercentage = 25;
  GetMLAlgos.query().$promise.then(function(data) {
    $scope.algorithms = data;
  }).then(function() {
    LoadExperiments.load({
      pId: $scope.currentProject.project_id
    }).$promise.then(function(reponse) {
      $scope.experiments = reponse;
      if(reponse.length > 0) {
        $scope.loaded = true;
      }

    });
  });

  $scope.run = function() {
      var data = $scope.inprogressProject;
      data['article'] =  $scope.article;
      if($scope.selected.length === 0) {
        $scope.showSimpleToast('Kindly select atleast one regression algorithm..!');
        return;
      }
      // $scope.clicked = true;
      RegPredict.predict({}, angular.toJson(data))
      .$promise.then(function(data) {
        $scope.clicked = true;
        $scope.regResults = data;
        var accuracy_values = [];
        angular.forEach(data, function(value, key) {
          this.push([value.algorithm, value.accuracy_score]);
        }, accuracy_values);

        $scope.accuracyVisualData = [
          {
             "key": "Series 1",
             "values": accuracy_values
          }
        ];
      });
  }

  $scope.load = function() {
    if($scope.selected.length === 0) {
        $scope.showSimpleToast('Kindly select atleast one regression algorithm..!');
        return;
      }
    if($window.localStorage.getItem('features') === null
      || $window.localStorage.getItem('labels') === null) {
      $scope.showSimpleToast('Kindly select atleast one feature and label');
      return;
    }
    LoadPredictObj.load({}, angular.toJson({
      features: $window.localStorage.getItem('features'),
      labels: $window.localStorage.getItem('labels'),
      algorithms: $scope.selected,
      project_id: $scope.currentProject.project_id,
      test_size: 100 - $scope.trainPercentage,
      article: $scope.article
    }))
    .$promise.then(function(data) {
      $scope.inprogressProject = data;
      $scope.experiments.push(data);
      $scope.loaded = true;
    });
  };

  $scope.loadExperiment = function(experiment) {
    $scope.inprogressProject = experiment;
    RetrieveResults.query({
      eId: experiment.project_data_id
    }).$promise.then(function (response) {
      $scope.regResults = response;
      $scope.clicked = true;
      var accuracy_values = [];
      angular.forEach(response, function(value, key) {
        this.push([value.algorithm, value.accuracy_score]);
      }, accuracy_values);

      $scope.accuracyVisualData = [
        {
           "key": "Series 1",
           "values": accuracy_values
        }
      ];
    });
  };

  $scope.showSimpleToast = function(error) {
    NotifyService.notify(error);
  };
})
.controller('ToastCtrl', function($scope, $mdToast) {
  $scope.closeToast = function() {
    $mdToast.hide();
  };

  $scope.sortExperiment = function(expriment) {
    var date = new Date(expriment.creation_timestamp);
    return date;
  };
})

.controller('datasetViewController', function($mdSidenav, $rootScope, $scope,
                                              $stateParams, $state, $window,
                                              DeleteProjectDatasets, NotifyService) {
    $scope.currentProject = $scope.currentProject = JSON.parse($window.localStorage.getItem('currentProject'));
    var vm = this;
    if($rootScope.labels === undefined) {
      $rootScope.labels = [];
    }
    if($rootScope.features === undefined) {
      $rootScope.features = [];
    }
    // $scope.remov
    $scope.remove = function (item, list, type) {
      var idx = list.indexOf(item);
      if (idx > -1) list.splice(idx, 1);
      if(angular.equals(type, 'label')) {
        $window.localStorage.setItem('labels', JSON.stringify(list));
      }
      else if(type === 'feature') {
        $window.localStorage.setItem('features', JSON.stringify(list));
      }
    };
    $scope.dataset = $stateParams.dataset;
    $scope.selected = [];

    $scope.removeProjectData = function() {
      DeleteProjectDatasets.del({
        pId: $stateParams.project_id,
        dId: $stateParams.dataset.data_set_id
      }).$promise.then(function(data) {
        $rootScope.datasets = data;
        NotifyService.notify('Dataset has been deleted sucessfully');
        $state.go('home.route2');
      });
    }
    // add features and lables in to rootscope features and lables variables
    $scope.toggle = function (item, list) {
      var idx = list.indexOf(item);
      if (idx > -1) list.splice(idx, 1);
      else list.push(item);
    };

    $scope.exists = function (item, list) {
      return list.indexOf(item) > -1;
    };

    $scope.addLabels = function() {
      if($rootScope.labels.length > 0) {
        angular.forEach($scope.selected, function(lable){
          var count = 0;
          angular.forEach($rootScope.labels, function(obj) {
            if(obj.lable === lable) {
              count = 1;
            }
          });
          if(count === 0) {
            $rootScope.labels.push({
              lable:lable,
              dataset: $scope.dataset.data_set_id
            });
          }
        });
        $window.localStorage.setItem('labels', JSON.stringify($rootScope.labels));
      }
      else {
        angular.forEach($scope.selected, function(lable){
          $rootScope.labels.push({
            lable:lable,
            dataset: $scope.dataset.data_set_id
          });
        });
        $window.localStorage.setItem('labels', JSON.stringify($rootScope.labels));
      }
    }

    $scope.addFeatures = function() {
      if($rootScope.features.length > 0) {
        angular.forEach($scope.selected, function(feature) {
          var count = 0;
          angular.forEach($rootScope.features, function(obj) {
            if(obj.feature === feature) {
              count = 1;
            }
          });
          if(count === 0) {
            $rootScope.features.push({
              feature:feature,
              dataset: $scope.dataset.data_set_id
            });
          }
        });
        $window.localStorage.setItem('features', JSON.stringify($rootScope.features));
      }
      else {
        angular.forEach($scope.selected, function(feature){
          $rootScope.features.push({
            feature:feature,
            dataset: $scope.dataset.data_set_id
          });
        });
        $window.localStorage.setItem('features', JSON.stringify($rootScope.features));
      }
    }
})
.controller('uploadDataploadController', function($rootScope, $scope,
                                                  $stateParams, $state, $window,
                                                  UploadDataset, NotifyService) {
    $scope.currentProject = $scope.currentProject = JSON.parse($window.localStorage.getItem('currentProject'));
    $scope.fileChanged = function(ele) {
      $scope.files = ele.files;
      $scope.$apply();
    }

    $scope.submit = function() {
      if($scope.files === undefined) {
        NotifyService.notify('Please select a dataset to upload');
      }
      else {
        var fd = new FormData();
        fd.append('file', $scope.files[0])
        UploadDataset.upload({pId: $stateParams.project_id}, fd).$promise.then(function(data) {
          if($rootScope.datasets === undefined) {
            $rootScope.datasets = data;
          }
          else {
            $rootScope.datasets.push(data);
          }
          NotifyService.notify('Dataset has been uploaded sucessfully');
          $state.go('home.route1', {dataset: data, project_id: $scope.currentProject.project_id});
        });
      }
    }
});
