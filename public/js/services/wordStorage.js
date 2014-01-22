angular.module('WordApp')
.service('wordStorage', ['$rootScope', '$log', function ($rootScope, $log) {
  var words = [ {word: 'welcome', count: 1} ];
  var socket = null;

  /*
   *  Connect client to server for push updates
   */
  (function(self) {
    socket = io.connect('http://localhost:8000');
    socket.on('haveSomeWords', function (data) {
      _.forEach(data, function(updatedWord) {
        self.addWord(updatedWord.word, updatedWord.count, true);
      });
      $rootScope.$broadcast('wordUpdate');
    });
  }(this));

  this.addWord = function addWord (newWord, count, fromServer) {
    count = count || 1;
    fromServer = fromServer || false;
    newWord = this.normalizeWord(newWord);
    _.forEach(words, function(currentWord) {
      if (currentWord.word == newWord) {
        count = ++currentWord.count; // increment before assigning
        return false; // to break out of the for loop early
      }
    }, this);
    if (count == 1) { // didn't find the word yet
      words.push({word: newWord, count: count});
    }
    if (socket && ! fromServer) {
      socket.emit("userUpdatedWord", {word: newWord, count: count});
    }
  };

  this.getWords = function() {
    return words;
  };

  this.getHighestFrequency = function() {
    var words = this.getWords();
    return d3.max(words, function(d) { return d.count; });
  };

  this.getWordsByLetter = function() {
    // TODO: refactor this to use fewer lodash calls

    var words = this.getWords();

    // results in {'h': 11, 'c': 4...}  -- all keys are lower-cased
    var letterCounts = _.reduce(words, function(result, obj) {
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
    return word.toString().replace(/[^a-zA-Z]+/g, '').toLowerCase();
  };
}]);

