$(function() {  // assumes jQuery has been loaded

    var n = 180, // secs, 3 minutes displayed
        duration = 1000, // msec, per update
        now = new Date(Date.now() - duration),
        data = d3.range(n).map(function() { return 0; });  // init data to array of 0's
    
    // define canvas properties
    var margin = {top: 6, right: 30, bottom: 20, left: 20},
        width = 960 - margin.right - margin.left,
        height = 120 - margin.top - margin.bottom;
    
    // define x-axis   
    var x = d3.time.scale()
        .domain([now - (n - 2) * duration, now - duration])
        .range([0, width]);
    
    // define y-axis
    var y = d3.scale.linear()
        .domain([0, 100])
        .range([height, 0]);
    
    // define chart line
    var line = d3.svg.line()
        .interpolate("basis") // adds smoothing
        .x(function(d, i) { return x(now - (n - 1 - i) * duration); })
        .y(function(d, i) { return y(d); });
    
    // add chart svg to DOM
    var svg = d3.select("body").append("p").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .style("margin-left", margin.left + "px")
        .style("margin-right", margin.right + "px")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    // add x-axis
    var x_axis = svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(x.axis = d3.svg.axis().scale(x).orient("bottom"));
    
    // add y-axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + width + ", 0)")
        .call(y.axis = d3.svg.axis().scale(y).orient('right').tickValues([0, 20, 40, 60, 80, 100]));
    
    // add chart line
    var path = svg.append("g")
        .append("path")
        .datum(data)
        .attr("class", "line");
    
    // subscribe to event stream
    var source = new EventSource('/update-stream');
    source.onmessage = function(msg) {  // callback function
        console.log(JSON.parse(msg.data).cpu);
    
        // update the domain for the x-axis
        now = new Date();
        x.domain([now - (n - 2) * duration, now - duration]);
    
        // push the new data point on the data array
        data.push(JSON.parse(msg.data).cpu);
    
        // redraw the line
        svg.select(".line")
            .attr("d", line)
            .attr("transform", null);
    
        // slide the x-axis left
        x_axis.call(x.axis);
    
        // slide the line left
        path.attr("transform", "translate(" + x(now - (n - 1) * duration) + ")")
    
        // pop the old data point off the front
        data.shift();
    };
    
});
