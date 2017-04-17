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
                    posY = bbBox.y + (1.5 * bbBox.height);
                    posX = bbBox.x + 4 * padding;
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
                    .range([0 + padding, 2 * w / 3 - padding])
                    .clamp(true);
                var yScale = d3
                    .scaleLinear()
                    .range([2 * h / 3 + padding, 0 - padding]);
                bg
                    .append('g')
                    .attr('class', 'graphical inp')
                    .call(d3.axisBottom(xScale.domain([-10, 10])));
                /*
                Code to generate the function.
                */
                var sigmoid = function(x) {return 1/(1+Math.exp(-x));}
                var sigmoidScaled = function(x) {return yScale(sigmoid(x));}
                var line = d3.line()
                .x(xScale)
                .y(sigmoidScaled)
                .curve(d3.curveNatural);
                bg
                .selectAll('.graphical.op-static')
                .data([points])
                .enter()
                .append('path')
                .classed('graphical op-static',1)
                .attr('d', line)
                .select(function(){
                    return this.parentNode.appendChild(this.cloneNode(true));
                })
                .attr('class', 'graphical op-dynamic')
                .style('fill', 'none')
                .classed('hidden', 1);
                /*
                Slider. There are four components to a slider.
                - The handle, the circle thing that moves.
                - The track which is the thing that the circle moves on
                - The track overlay which is a large area where drags can
                  happen.
                - The track inset which is the tiny line that seems to guide
                  the circle.
                */
                var slider = bg.append('g')
                    .attr('class', 'sigmaslider');
                var handle = slider
                    .append('circle')
                    .attr('cx', xScale(-10))
                    .attr('cy', h / 2)
                    .attr('r', 6)
                    .attr('class', 'slider handle');
                var dragBehavior = d3.drag().on('start drag', function() {
                    handle.attr('cx', Math.min(xScale(10), Math.max(xScale(-10), d3.event.x)));
                })
                slider
                    .append('line')
                    .attr('x1', xScale(-10))
                    .attr('x2', xScale(10))
                    .attr('y1', h / 2)
                    .attr('y2', h / 2)
                    .attr('class', 'slider track')
                    .select(function() {
                        return this.parentNode.appendChild(this.cloneNode(true));
                    })
                    .attr('class', 'slider track-inset')
                    .select(function() {
                        return this.parentNode.appendChild(this.cloneNode(true));
                    })
                    .attr('class', 'slider track-overlay')
                    .call(dragBehavior);

            }
        }
    })();
    artist.drawAnalytical();
    artist.drawGraphical();
})();