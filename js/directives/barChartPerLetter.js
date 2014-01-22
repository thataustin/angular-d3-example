angular.module('WordApp')
.directive('wordStatBarChartPerLetter', ['wordStorage', function(wordStorage) {

  var margins = {top: 10, right: 0, bottom: 50, left: 30};

  // SVG Height/Width
  var outerH = 500;
  var outerW = 960;

  // inner chart height/width - excluding axis
  var h = outerH - margins.top - margins.bottom;
  var w = outerW - margins.left - margins.right;

  // prepare what we can of range functions
  var x = d3.scale.ordinal().rangeRoundBands([0, w], 0.1);
  var y = d3.scale.linear().range([h, 0]);

  // cache objects that don't need re-created every time
  var svg = null, chart = null;
  var xAxis = d3.svg.axis().orient('bottom').scale(x);
  var yAxis = d3.svg.axis().orient('left').scale(y);

  var link = function(scope, el, attrs) {
    if (svg === null) {
      svg = d3.select('#' + attrs.id)
        .append('svg')
          .attr('width', outerW)
          .attr('height', outerH);

      chart = svg.append('g')
          .attr('height', h)
          .attr('width', w)
          .attr('transform', 'translate(' + margins.left + ', ' + margins.top + ')');

      svg.append('g')
        .attr('transform', 'translate(' + margins.left + ', ' + (h + margins.top) +  ')')
        .attr('class', 'xaxis')
        .call(xAxis);
      svg.append('g')
        .attr('x', 0)
        .attr('y', 0)
        .attr('transform', 'translate(' + margins.left + ', ' + margins.top + ')')
        .attr('class', 'yaxis')
        .call(yAxis);
      svg.append('text')
        .text("By First Letter of Words (Non-present values ommitted)")
        .attr('text-anchor', 'middle')
        .attr('x', outerW/2)
        .attr('y', outerH - 10);
    }
    var updateChart = function(newWords) {

      var letters = wordStorage.getWordsByLetter(newWords);
      x.domain(_.uniq(letters.map(function(d) { return d.letter; })));
      y.domain([0, d3.max(letters, function(d) { return d.count; })]);

      var rects = chart.selectAll('rect').data(letters);
      rects
          .attr('x', function(d) { return x(d.letter); })
          .attr('y', function(d) { return y(d.count); })
          .attr('height', function(d) { return h - y(d.count); })
          .attr('width', x.rangeBand())
        .enter()
        .append('rect')
          .attr('x', function(d) { return x(d.letter); })
          .attr('y', function(d) { return y(d.count); })
          .attr('height', function(d) { return h - y(d.count); })
          .attr('width', x.rangeBand());
      rects.exit().remove();

      var texts = chart.selectAll('text').data(letters);
      texts
          .attr('x', function(d) { return x(d.letter) + x.rangeBand() / 2; })
          .attr('y', function(d) { return y(d.count) + (h - y(d.count)) / 2; })
          .attr('text-anchor', 'middle')
          .attr('fill', 'white')
          .text(function(d) { return d.letter.toUpperCase(); })
        .enter()
        .append('text')
          .attr('x', function(d) { return x(d.letter) + x.rangeBand() / 2; })
          .attr('y', function(d) { return y(d.count) + (h - y(d.count)) / 2; })
          .attr('text-anchor', 'middle')
          .attr('fill', 'white')
          .text(function(d) { return d.letter.toUpperCase(); });
        texts.exit().remove();

      var t = svg.transition().duration(750);
      t.select('.xaxis').call(xAxis.scale(x));
      t.select('.yaxis').call(yAxis.scale(y));
    };
    scope.$watch('words', updateChart, true);
  };

  return { restrict: 'A', link: link };
}]);
