angular.module('WordApp').directive('wordStatBarChartPerLetter', ['wordStorage', function(wordStorage) {

  var margins = {top: 20, right: 20, bottom: 50, left: 40};

  // SVG Height/Width
  var outerH = 500;
  var outerW = 960;

  // inner chart height/width - excluding axis
  var h = outerH - margins.top - margins.bottom;
  var w = outerW - margins.left - margins.right;

  // prepare what we can of range functions
  var x = d3.scale.ordinal().rangeRoundBands([0, w], 0.1);
  var y = d3.scale.linear().range([h, 0]);

  return {
    restrict: 'A',
    link: function (scope, el, attrs) {

      var data = wordStorage.getWordsByLetter();
      x.domain(data.map(function(d) { return d.letter; }));

      y.domain([0, wordStorage.getHighestFrequency(data)]);
      var svg = d3.select('#' + attrs.id)
        .append('svg')
          .attr('width', outerW)
          .attr('height', outerH);

      var chart = svg.append('g')
          .attr('height', h)
          .attr('width', w)
          .attr('transform', 'translate(' + margins.left + ', ' + margins.top + ')');

      chart.selectAll('rect').data(data)
          .enter()
        .append('rect')
          .attr('x', function(d) { return x(d.letter); })
          .attr('y', function(d) { return y(d.count); })
          .attr('height', function(d) { return h - y(d.count); })
          .attr('width', x.rangeBand());

      chart.selectAll('text').data(data)
           .enter()
        .append('text')
          .attr('x', function(d) { return x(d.letter) + x.rangeBand() / 2; })
          .attr('y', function(d) { return y(d.count) + (h - y(d.count)) / 2; })
          .attr('text-anchor', 'middle')
          .attr('fill', 'white')
          .text(function(d) { return d.count; });

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient('bottom');
      chart.append('g')
          .attr('transform', 'translate(0, ' + h + ')')
          .attr('class', 'x axis')
          .call(xAxis);
      svg.append('text')
          .text("First Letter of Word (Zero values ommitted)")
          .attr('text-anchor', 'middle')
          .attr('x', outerW/2)
          .attr('y', outerH - 10);

      var yAxis = d3.svg.axis() .scale(y) .orient('left');

      chart.append('g')
          .attr('x', 0)
          .attr('y', 0)
          .attr('class', 'axis')
          .call(yAxis);

    }
  };
}]);
