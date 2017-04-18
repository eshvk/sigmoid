(function() {
    var w = 900,
        h = 600,
        padding = 15; //3:2 aspect ratio
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
                    .attr('transform', 'translate(' + padding + ',' + (h / 3) + ')');
                d3.xml('fofx.svg', function(e, docFragment) {
                    // Based on https://bl.ocks.org/mbostock/1014829
                    if (e) {
                        console.log(e);
                        return;
                    }
                    // Note that g and the rest of the SVG don't 
                    // realize that docFragment is a nested svg which
                    // should be contained within their bounding box.
                    console.log(bg.node().getBBox()); // Returns empty
                    g.node()
                        .appendChild(docFragment.documentElement);
                    var secondEquals = g.select('#fofx')
                        .select('#secondequals');
                    // Gets bounding box in user space values around secondEquals
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
                    .domain([-10, 10])
                    .range([0 + padding, 2 * w / 3 - padding])
                    .clamp(true);
                var yScale = d3
                    .scaleLinear()
                    .range([2 * h / 3 - padding, h/3 + padding]);
                // Create a chart because you can explicitly position it
                var chart = bg
                    .append('svg')
                    .attr('width', w)
                    .attr('height', 2*h/3 + padding)
                    .attr('x', w / 3 - padding)
                    .attr('y', 2 * h / 3)
                    .attr('id', 'chart')
                    .attr('overflow', 'visible');
                chart.append('g')
                    .attr('class', 'graphical inp')
                    .call(d3.axisBottom(xScale));
                console.log(chart.node().getBBox()); // This will just enclose the g
                /*
                Code to generate the function.
                */
                var sigmoid = function(x) {
                    return 1 / (1 + Math.exp(-x));
                }
                var sigmoidScaled = function(x) {
                    return yScale(sigmoid(x));
                }
                var line = d3.line()
                    .x(xScale)
                    .y(sigmoidScaled)
                    .curve(d3.curveNatural);
                /* Note on overflow visible. So the parent svg 'chart' contains
                   this object. Now we'd like to position the slider in relation to
                   this coordinate system. We can do so in a couple of ways:
                    - Create a new SVG element and do the following:
                    chart.append('svg').attr('overflow', 'visible')
                    .attr('y', '-2%')
                    or use groups (used for the slider).
                    Note, that -percentage moves the y by a percentage of the size 
                    of svg.
                    Refer here: https://sarasoueidan.com/blog/mimic-relative-positioning-in-svg/
                 */
                chart
                    .append('svg')
                    .attr('overflow', 'visible')
                    .attr('y', '-100%')
                    .selectAll('.graphical.op-static')
                    .data([points])
                    .enter()
                    .append('path')
                    .classed('graphical op-static', 1)
                    .attr('d', line)
                    .select(function() {
                        return this.parentNode.appendChild(this.cloneNode(true));
                    })
                    .attr('class', 'graphical op-dynamic')
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
                var slider = chart
                    .append('g')
                    .attr('transform', 'translate(0,' + -padding + ')' )
                    .attr('class', 'sigmaslider');
                var handle = slider
                    .append('circle')
                    .attr('cx', xScale(-10))
                    .attr('r', 6)
                    .attr('class', 'slider handle');
                var dragBehavior = d3.drag().on('start drag', function() {
                    xCurr = Math.min(xScale(10), Math.max(xScale(-10), d3.event.x));
                    handle.attr('cx', xCurr);
                    bg
                        .selectAll('.graphical.op-dynamic')
                        .data([d3.range(-10, xScale.invert(xCurr) + 1, 1)])
                        .attr('d', line)
                        .classed('hidden', 0);
                })
                slider
                    .append('line')
                    .attr('x1', xScale(-10))
                    .attr('x2', xScale(10))
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