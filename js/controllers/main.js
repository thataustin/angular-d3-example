'use strict';
angular.module('WordApp').controller('MainCtrl', ['$rootScope', '$scope', 'wordDP',
  function($rootScope, $scope, dp) {
    $scope.displayTypes = [
      {desc: 'Bar Chart', value:'bar_chart'},
      {desc: 'Word Cloud', value:'word_cloud'},
      {desc: 'All', value: 'all'}
    ];
    $scope.displayType = $scope.displayTypes[0];
    $scope.data = dp.getData();
  }]);
