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
  }
});
