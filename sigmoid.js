(function() {
    var w = 900,
        h = 600,
        padding = 20; //3:2 aspect ratio
    // viewport setup
    // The viewport is the part of SVG that is going to be visible.
    var artist = (function() {
        var bg = d3.select('body')
            .append('svg')
            .attr('class', 'background')
            .attr('width', w)
            .attr('height', h);
        return {
            drawAnalytical: function() {
                var g = bg
                    .append('g')
                    .attr('transform', 'translate(0,' + (h / 3) + ')');
                d3.xml('fofx.svg', function(e, docFragment) {
                    // Based on https://bl.ocks.org/mbostock/1014829
                    if (e) {
                        console.log(e);
                        return;
                    }
                    g.node()
                        .appendChild(docFragment.documentElement);
                    var secondEquals = g.select('#fofx')
                                .select('#secondequals');
                    var bbBox = secondEquals.node().getBBox();
                    posY = bbBox.y + (1.5*bbBox.height);
                    posX = bbBox.x + 4* padding;
                    secondEquals
                    .insert('text')
                    .attr('class', 'analytical')
                    .attr('x', posX)
                    .attr('y', posY)
                    .text('3')
                    .attr('display', 'none');
                });
            },
            drawGraphical: function() {
                var points = d3.range(-10, 11, 1);
                var xScale = d3
                    .scaleLinear()
                    .range([0 + padding, 2*w/3 - padding]);
                var yScale = d3
                    .scaleLinear()
                    .range([2*h/3 + padding, 0 - padding]);
                bg
                .append('g')
                .attr('class', 'graphical inp')
                .call(d3.axisBottom(xScale.domain([-10, 10])));
                var sigmoid = function(x) {return 1/(1+Math.exp(-x));}
                var sigmoidScaled = function(x) {return yScale(sigmoid(x));}
                var line = d3.line()
                .x(xScale)
                .y(sigmoidScaled)
                .curve(d3.curveNatural);
                bg
                .append('path')
                .attr('class', 'graphical op')
                .datum(points)
                .attr('d', line)
                ;
            }
        }
    })();
    artist.drawAnalytical();
    artist.drawGraphical();
})();