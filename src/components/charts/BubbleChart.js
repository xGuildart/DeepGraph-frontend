import { useD3 } from '../../hooks/useD3';
import React from 'react';
import * as d3 from 'd3';
import { nest } from 'd3-collection';
import { GetAxisWidth } from '../../storage/pouchdb';

var margin, width, height, sumstat, counts, keys, scores, scores_func, func_name;
var dates_func, d_func_name, color, x, y, z, svg, dot, Tooltip;

var xAxis, xAxis_Width = 100;

// Add legend: circles
var valuesToShow = [10, 100, 500],
    xCircle = 10,
    xLabel = 70,
    yCircle = 30;

function dates(sumstat, f) {
    if (sumstat) {
        return new Map(sumstat.map(function (d) {
            return [d.key, f(d.values.map(function (x) {
                return new Date(x.date);
            }))];
        }));
    } else {
        return;
    }

}

function init_vars(data, dims, scale, funcs) {
    // set the dimensions and margins of the graph
    margin = { top: 15, right: 20, bottom: 30, left: 30 };
    width = dims.width * scale / 100;
    height = dims.height * 25 / 100;

    sumstat = nest() // nest function allows to group the calculation per level of a factor
        .key(function (d) { return d.category; })
        .entries(data);

    counts = new Map(sumstat.map(function (d) {
        return [d.key, d.values.length];
    }));

    valuesToShow = [10, 100, 500].filter(function (value) {
        return value > 5 * d3.max(counts.values()) ? null : value;
    });
    xCircle = 20;
    xLabel = 70;
    yCircle = 100;

    sumstat.sort(function (a, b) {
        return counts.get(b.key) - counts.get(a.key);
    });


    keys = sumstat.map(function (d) { return d.key; }) // list of group names
    scores = (f) => new Map(sumstat.map(function (d) {
        return [d.key, f(d.values.map(function (x) {
            return x.sentence_sent_score;
        }))];
    }));

    var func = d3.mean;
    switch (funcs.score) {
        case "Mean":
            func = d3.mean; break;
        case "Max":
            func = d3.max; break;
        case "Min":
            func = d3.min; break;
        case "Median":
            func = d3.median; break;

        default:
            func = d3.mean; break;
    };

    scores_func = scores(func);
    func_name = funcs.score;

    var func_t = d3.mean;
    switch (funcs.time) {
        case "Mean":
            func_t = d3.mean; break;
        case "Max":
            func_t = d3.max; break;
        case "Min":
            func_t = d3.min; break;
        case "Median":
            func_t = d3.median; break;

        default:
            func_t = d3.mean; break;
    };

    dates_func = dates(sumstat, func_t);
    d_func_name = funcs.time;

    // color palette
    color = d3.scaleOrdinal()
        .domain(keys)
        .range(d3.schemePaired);


    // Add X axis --> it is a date format
    x = d3.scaleTime()
        .domain(d3.extent(data, function (d) { return d3.timeParse("%Y-%m-%d")(d.date); }))
        .range([0, width])
        ;

    // Add Y axis
    y = d3.scaleLinear()
        .domain([d3.min(data, function (d) { return d.sentence_sent_score; }), d3.max(data, function (d) { return d.sentence_sent_score; })])
        .range([height, 0]);


    // Add a scale for bubble size
    z = d3.scaleLinear()
        .domain([1, d3.max(counts.values())])
        .range([4, 25]);
}

function draw_graph(data, dims, scale, funcs) {
    init_vars(data, dims, scale, funcs);
    constructBubble();
}

const mouse_over = function (e, d) {
    GetAxisWidth().then((wd) => {
        if (wd !== 0 && wd) {
            xAxis_Width = wd;
        }
    });
    Tooltip
        .style("opacity", 1)
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .html('<span class="tooltiptexxt">'
            + '<h5>' + d.key + '</h5>'
            + "Counts of S: " + counts.get(d.key) + "</br>"
            + func_name + " SSS: " + scores_func.get(d.key) + "</br>"
            + d_func_name + " Time: " + new Date(dates_func.get(d.key)).toDateString('%D %B %YYYY') +
            '</span>')
        .style('left', xAxis_Width + margin.left + 'px')
    d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1);
};


var mouseleave = function (d) {
    Tooltip
        .style("opacity", 0)
    d3.select(this)
        .style("stroke", "none")
        .style("opacity", 0.5)
}

function setAxisDimensions() {
    xAxis = d3.select('.xAxis').node();
    // setxAxisWidth(xAxis.getBoundingClientRect().width);
    //PouchDB
    //SaveAxisWidth(xAxis.getBoundingClientRect().width);
    if (xAxis)
        xAxis_Width = xAxis.getBoundingClientRect().width;

}

function constructBubble() {
    // append the svg object to the body of the page
    svg = d3.select("div#container")
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 800 800")
        .classed("svg-content", true)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // attach x        
    svg.append("g")
        .style("font", "7.5px times")
        .style("text-orientation", "sideways")
        .text("Date")
        .attr('class', 'xAxis')
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(d3.timeMonth, 1)
            .tickFormat(d3.timeFormat('%b %y')))
        .selectAll("text")
        .attr("transform", function (d, e, n) {
            if (n.length > 12)
                return "translate(-14," + 20 + ") rotate(-80)";
        });


    xAxis = d3.select('.xAxis').node();
    if (xAxis != null)
        if (xAxis.getBoundingClientRect() != null) {
            // dispatch({ type: 'setxAxisWidth', payload: xAxis.getBoundingClientRect().width });
            // pouch db
            // SaveAxisWidth(xAxis.getBoundingClientRect().width);
            xAxis_Width = xAxis.getBoundingClientRect().width;
        }

    // attach y
    svg.append("g")
        .style("font", "9px times")
        .call(d3.axisLeft(y));

    // define tooltip
    Tooltip = d3
        .selectAll('div#container')
        .attr('transform', "translate(" + (width + 30) + ",0)")
        .append('div')
        .attr('class', 'tooltip')
        .style('left', xAxis_Width + margin.left + 'px')
        .style('opacity', 1);

    // Add dots
    dot = svg.append('g')
        .selectAll("dot")
        .data(sumstat)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(dates_func.get(d.key)); })
        .attr("cy", function (d) {
            return y(scores_func.get(d.key));
        })
        .attr("r", function (d) { return z(counts.get(d.key)); })
        .style("fill", d => color(d.key))
        .style("opacity", "0.5")
        .attr("stroke", "white")
        .style("stroke-width", "0px")
        .on('mouseover', mouse_over)
        .on('mouseleave', mouseleave);

    svg.selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("circle")
        .attr('transform', "translate(" + (width + 30) + ",0)")
        .attr("cx", xCircle)
        .attr("cy", function (d) { return yCircle - z(d) })
        .attr("r", function (d) { return z(d) })
        .style("fill", "none")
        .attr("stroke", "black");

    // Add legend: segments
    svg
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("line")
        .attr('transform', "translate(" + (width + 30) + ",0)")
        .attr('x1', function (d) { return xCircle + z(d) })
        .attr('x2', xLabel)
        .attr('y1', function (d) { return yCircle - z(d) })
        .attr('y2', function (d) { return yCircle - z(d) })
        .attr('stroke', 'black')
        .style('stroke-dasharray', ('2,2'))

    // Add legend: labels
    svg
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("text")
        .attr('transform', "translate(" + (width + 30) + ",0)")
        .attr('x', xLabel)
        .attr('y', function (d) { return yCircle - z(d) })
        .text(function (d) { return d })
        .style("font-size", 10)
        .attr('alignment-baseline', 'middle');
}


export function update_x(selectedGroup) {
    var func = d3.mean;
    switch (selectedGroup) {
        case "Mean":
            func = d3.mean; break;
        case "Max":
            func = d3.max; break;
        case "Min":
            func = d3.min; break;
        case "Median":
            func = d3.median; break;

        default:
            func = d3.mean; break;
    };

    dates_func = dates(sumstat, func);
    d_func_name = selectedGroup;

    dot
        .data(sumstat)
        .transition()
        .duration(1000)
        .attr("cx", function (d) { return x(dates_func.get(d.key)); })
        .attr("cy", function (d) {
            return y(scores_func.get(d.key));
        })
        .attr("r", function (d) { return z(counts.get(d.key)); })
        .style("fill", d => color(d.key));

};

export function update_y(selectedGroup) {
    var func = d3.mean;

    switch (selectedGroup) {
        case "Mean":
            func = d3.mean; break;
        case "Max":
            func = d3.max; break;
        case "Min":
            func = d3.min; break;
        case "Median":
            func = d3.median; break;

        default:
            func = d3.mean; break;
    };

    scores_func = scores(func);
    func_name = selectedGroup;

    dot
        .data(sumstat)
        .transition()
        .duration(1000)
        .attr("cx", function (d) { return x(dates_func.get(d.key)); })
        .attr("cy", function (d) {
            return y(scores_func.get(d.key));
        })
        .attr("r", function (d) { return z(counts.get(d.key)); });
};

export function update_data(data, dims, scale, funcs) {
    d3.select("div#container").select('svg').remove();
    d3.select("div#container").select("legend").remove();
    //re-drwgrraph
    draw_graph(data, dims, scale, funcs);
    setAxisDimensions();
}


function BubbleChart({ dims, data, scale, funcs }) {
    // for pouchdB
    // if (xAxisWidth == 0) {
    //     GetAxisWidth().then((res) => {
    //         if (res != null) {
    //             setxAxisWidth(res);
    //         }
    //     });
    // } else {
    //     SaveAxisWidth(xAxisWidth);
    // }

    const ref = useD3((svg) => {
        if (data.length !== 0) {

            d3.select('div#container')
                .select('svg')
                .remove();
            d3.select('div#container')
                .select('.tooltip')
                .remove();

            // d3.select("#selectButton").on("change", function (d) {
            //     // recover the option that has been chosen
            //     var selectedOption = d3.select(this).property("value")
            //     // run the updateChart function with this selected option
            //     update_y(selectedOption)
            // });

            // d3.select("#selectButton2").on("change", function (d) {
            //     // recover the option that has been chosen
            //     var selectedOption = d3.select(this).property("value")
            //     console.log("d3 cpture change on x");
            //     // run the updateChart function with this selected option
            //     update_x(selectedOption)
            // });


            // redraw_graph = () => {
            //     d3.select("div#container").select('svg').remove();
            //     d3.select("div#container").select("legend").remove();
            //     //re-drwgrraph
            //     console.log(dd);
            //     draw_graph();
            //     //setAxisDimensions();
            // }

            // d3.select("#skip").on("change", function (d) {
            //     // recover the option that has been chosen
            //     skip = d3.select(this).property("value")
            //     limit = state.limit;
            //     // run the updateChart function with this selected option
            //     update_data(skip, limit)
            // });

            // d3.select("#limit").on("change", function (d) {
            //     // recover the option that has been chosen
            //     skip = state.skip;
            //     limit = d3.select(this).property("value")
            //     // run the updateChart function with this selected option
            //     update_data(skip, limit)
            // });

            draw_graph(data, dims, scale, funcs);
        }

    }, [data]);

    const styles = {
        height: '100%',
        backgroundColor: 'white',
        marginRight: "0px",
        marginLeft: "0px",
    };

    return (
        <div ref={ref}>
            <div id="container" className="svg-container" style={styles}></div>
        </div>
    );
}

export default BubbleChart;