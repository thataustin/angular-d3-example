angular.module('WordApp')
.directive('wordStatBarChartPerWord', ['wordStorage', function(wordStorage) {
  var margins = {top: 20, right: 20, bottom: 20, left: 40};
  var padding = 1;

  // SVG Height/Width
  var outerH = 500;
  var outerW = 960;

  // inner chart height/width - excluding axis
  var h = outerH - margins.top - margins.bottom;
  var w = outerW - margins.left - margins.right;

  // cache re-usable variables in outer scope
  var svg = null, chart = null, yAxis = null, t = null;
  var y = d3.scale.linear().range([h, 0]);

  var link = function (scope, el, attrs) {
    if (svg === null) {
      svg = d3.select('#' + attrs.id).append('svg').attr('width', outerW).attr('height', outerH);

      chart = svg.append('g')
          .attr('height', h)
          .attr('width', w)
          .attr('transform', 'translate(' + margins.left + ', ' + margins.top + ')');

      t = svg.transition().duration(750);

      yAxis = d3.svg.axis().scale(y).orient('left');
      svg.append('g')
        .attr('class', 'yaxis')
        .attr('width', 20)
        .attr('transform', 'translate(' + margins.left +', ' + margins.top + ')')
        .attr('x', 0)
        .attr('y', 0)
        .call(yAxis);
    }

    var updateChart = function(newWords) {

      y.domain([0, wordStorage.getHighestFrequency(newWords)]);

      var t = svg.transition().duration(750);
      t.select('.yaxis').call(yAxis.scale(y));

      var getYPos = function(d) { return y(d.count); };
      var calcHeight = function (d) { return h - y(d.count); };

      var barWidth = Math.floor(w / newWords.length);
      var getXPos = function(d, i) { return (i * barWidth); };
      var paddedBarWidth = barWidth - padding;

      var centerOfBarX = function(d, i) { return getXPos(d, i) + paddedBarWidth / 2; };
      var centerOfBarY = function (d, i) { return getYPos(d, i) + calcHeight(d, i) / 2; };

      var rect = chart.selectAll('rect').data(newWords);
      rect
          .attr('x', getXPos)
          .attr('y', getYPos)
          .attr('height', calcHeight)
          .attr('width', paddedBarWidth)
        .enter()
        .append('rect')
          .attr('x', getXPos)
          .attr('y', getYPos)
          .attr('height', calcHeight)
          .attr('width', paddedBarWidth);
      rect.exit().remove();

      var rectText = chart.selectAll('text').data(newWords);
      rectText
          .text(function(d) { return d.word; })
          .attr('x', centerOfBarX)
          .attr('y', centerOfBarY)
          .attr('fill', 'white')
          .attr('text-anchor', 'middle')
        .enter()
        .append('text')
          .text(function(d) { return d.word; })
          .attr('x', centerOfBarX)
          .attr('y', centerOfBarY)
          .attr('fill', 'white')
          .attr('text-anchor', 'middle');
      rectText.exit().remove();

    };
    /*
     * Watch deep-copy changes to words (note 3rd argument to $watch)
     */
    scope.$watch('words', updateChart, true);
  };

  return {
    restrict: 'A',
    link: link
  };
}]);
