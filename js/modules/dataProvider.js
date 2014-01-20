'use strict';
angular.module('DataProvider', [])
.value('wordDP', {
  getData: function() {
    return [
      {word: 'math', count: 28},
      {word: 'science', count: 51},
      {word: 'english', count: 37},
      {word: 'computers', count: 12},
      {word: 'talk', count: 95},
      {word: 'speak', count: 39},
      {word: 'you', count: 19},
      {word: 'me', count: 88},
      {word: 'he', count: 28},
      {word: 'she', count: 17},
      {word: 'E.T.', count: 33}
    ];
  },
  getHighestFrequency: function(data) {
    var data = data || this.getData();
    return d3.max(data, function(d) { return d.count; });
  },
  getDataByLetter: function(data) {
    // TODO: refactor this to use fewer lodash calls

    var data = data || this.getData();

    // results in {'h': 11, 'c': 4...}  -- all keys are lower-cased
    var letter_counts = _.reduce(data, function(result, obj) {
      var letter = obj.word[0].toLowerCase();
      result[letter] = result[letter] || 0;
      result[letter] += obj.count;
      return result;
    }, {} /* the result to start with */ );

    // return [ { letter: 'a', count: 4}, ...]
    var letter_map = _.map(letter_counts, function (count, letter) {
      return {letter: letter, count: count};
    });

    return _.sortBy(letter_map, 'letter');
  }
});
