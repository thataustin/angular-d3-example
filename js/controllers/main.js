'use strict';
angular.module('WordApp').controller('MainCtrl', ['$rootScope', '$scope', 'wordStorage',
  function($rootScope, $scope, dp) {
    $scope.displayTypes = [
      {desc: 'Word Cloud', value:'word_cloud'},
      {desc: 'Bar Chart - Per word', value:'bar_chart_per_word'},
      {desc: 'Bar Chart - Per letter', value:'bar_chart_per_letter'},
      {desc: 'All', value: 'all'}
    ];
    $scope.displayType = $scope.displayTypes[0];
    $scope.data = dp.getWords();
    $scope.addWord = function(word) {
      dp.addWord(word);
    };
  }]);
