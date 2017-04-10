(function() {
    var w = 900,
        h = 600,
        padding = 20; //3:2 aspect ratio
    // viewport setup
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
                    var bbBox = g.select('#fofx')
                                .select('#secondequals')
                                .node().getBoundingClientRect();
                    posY = (bbBox.top + bbBox.bottom)/2;
                    posX = bbBox.right + padding;
                    console.log(posY, posX);
                    g
                    .append('text')
                    .attr('x', posX)
                    .attr('y', posY);
                    // Append number here
                });
            }
        }
    })();
    artist.drawAnalytical();
})();