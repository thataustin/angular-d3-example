angular.module('WordApp').directive('wordStatBarChartPerWord', ['wordDP', function(wordDP) {
  'use strict';
  var h = 500;
  var w = 900;

  return {
    restrict: 'A',
    link: function (scope, el, attrs) {
      var data = wordDP.getData();
      var highestFrequency = wordDP.getHighestFrequency(data);

      var padding = 1;
      var yAxisPadding = 40;
      var margin = {top: 10, bottom: 10};

      var yScale = d3.scale.linear().domain([highestFrequency + 10, 0]).range([margin.bottom, h - margin.top]);
      var calcY = function(d) { return yScale(d.count); };
      var calcHeight = function (d) { return h - yScale(d.count) - margin.bottom; };

      var barWidth = Math.floor((w - yAxisPadding) / data.length);
      var calcX = function(d, i) { return (yAxisPadding + i * barWidth); };
      var paddedBarWidth = barWidth - padding;

      var svg = d3.select('#' + attrs.id)
        .append('svg')
        .attr('width', w)
        .attr('height', h);

      var rect = svg.selectAll('rect').data(data)
          .enter()
        .append('rect')
          .attr('x', calcX)
          .attr('y', calcY)
          .attr('height', calcHeight)
          .attr('width', paddedBarWidth);

      svg.selectAll('text').data(data)
          .enter()
        .append('text')
          .text(function(d) { return d.word; })
          .attr('x', function(d, i) { return (calcX(d, i) + paddedBarWidth / 2); })
          .attr('y', function (d, i) { return calcY(d, i) + calcHeight(d, i) / 2; })
          .attr('fill', 'white')
          .attr('text-anchor', 'middle');

      var yAxis = d3.svg.axis()
          .scale(yScale)
          .orient('left');
      svg.append('g')
          .attr('transform', 'translate(' + yAxisPadding.toString() + ')')
          .attr('class', 'axis')
          .call(yAxis);
    }
  };
}]);
