'use strict';
angular.module('WordApp').controller('MainCtrl', ['$rootScope', '$scope', 'wordStorage',
  function($rootScope, $scope, dp) {
    $scope.displayTypes = [
      {desc: 'Word Cloud', value:'word_cloud'},
      {desc: 'All', value: 'all'},
      {desc: 'Bar Chart - Per letter', value:'bar_chart_per_letter'},
      {desc: 'Bar Chart - Per word', value:'bar_chart_per_word'}
    ];
    $scope.displayType = $scope.displayTypes[0];
    $scope.words = dp.getWords();
    $scope.highestFrequency = dp.getHighestFrequency($scope.words);
    $scope.addWord = function(word) {
      dp.addWord(word);
    };

    $scope.updateWord = function(word, count) {
      console.log(word, count);
    };
    $scope.$on('wordUpdate', function(targetScope, currentScope) {
      $rootScope.$apply(function() { $scope.words = dp.getWords(); });
    });
  }]);
