(function() {
    var w = 900,
        h = 600,
        padding = 20; //3:2 aspect ratio
    // Background setup
    var background = function(w, h) {
        return d3.select('body')
            .append('svg')
            .attr('class', 'background')
            .attr('width', w)
            .attr('height', h)
    }
    
})();