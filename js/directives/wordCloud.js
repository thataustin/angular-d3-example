angular.module('WordApp').directive('wordStatWordCloud', ['wordDP', function(wordDP) {
  'use strict';
  return {
    restrict: 'A',
    link: function (scope, el, attrs) {
      var data = wordDP.getData();
      var highestFrequency = wordDP.getHighestFrequency(data);
      var textScale = d3.scale.linear().domain([0, highestFrequency]).range([12, 150]);

      d3.select('#' + attrs.id)
        .selectAll('span')
        .data(data)
        .enter()
        .append('span')
        .text(function(d) { return d.word; })
        .style('color', function() {
          var hexAlphabet = [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'];
          var color = '#';
          for (var i = 0; i < 6; i++) {
            color += hexAlphabet[Math.floor(Math.random() * 16)].toString();
          }
          return color;
        })
        .style('float', 'left')
        .style('font-size', function(d) { return textScale(d.count).toString() + 'px'; });
    }
  };

}]);

