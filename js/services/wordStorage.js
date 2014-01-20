angular.module('WordApp')
.service('wordStorage', ['remoteUrl', '$rootScope', '$log', function (url, $rootScope, $log) {
  this.remoteUrl = url || null;

  this.data = [ {word: 'welcome', count: 1} ];

  this.loadDataFromRemote = function() {
    if (! url) {
      $log.error('Must set remote url before you can start using remote stuff!');
      return;
    }
  };

  this.addWord = function (word) {
    this.data.push({word: this.normalizeWord(word), count: 1});
  };

  this.getWords = function() {
    return this.data;
  };

  this.getHighestFrequency = function() {
    var data = this.getWords();
    return d3.max(data, function(d) { return d.count; });
  };

  this.getWordsByLetter = function() {
    // TODO: refactor this to use fewer lodash calls

    var data = this.getWords();

    // results in {'h': 11, 'c': 4...}  -- all keys are lower-cased
    var letterCounts = _.reduce(data, function(result, obj) {
      var letter = obj.word[0].toLowerCase();
      result[letter] = result[letter] || 0;
      result[letter] += obj.count;
      return result;
    }, {} /* the result to start with */ );

    // return [ { letter: 'a', count: 4}, ...]
    var letterMap = _.map(letterCounts, function (count, letter) {
      return {letter: letter, count: count};
    });

    return _.sortBy(letterMap, 'letter');
  };

  this.normalizeWord = function(word) {
    return word.toString().replace(/[^a-zA-Z]+/g, '');
  };


}]);

