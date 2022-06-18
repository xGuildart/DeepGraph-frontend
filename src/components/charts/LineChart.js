import { useD3 } from '../../hooks/useD3';
import React from 'react';
import * as d3 from 'd3';
import { nest } from 'd3-collection';
import db from '../../storage/pouchdb';
import dateFormat from 'dateformat';

var margin, width, height, sumstat, counts, keys, scores, scores_func, func_name;
var dates_func, d_func_name, color, x, y, z, svg, dot, Tooltip;

var xAxis, xAxis_Width = 100;

function init_vars(data, dims, scale) {
    // set the dimensions and margins of the graph
    margin = { top: 40, right: 20, bottom: 30, left: 30 };
    width = dims.width * scale / 100;
    height = dims.height * 25 / 100;

    // // color palette
    // color = d3.scaleOrdinal()
    //     .domain(keys)
    //     .range(d3.schemePaired);


    // Add X axis --> it is a date format
    x = d3.scaleTime()
        .domain(d3.extent(data, function (d) { return d3.timeParse("%Y-%m-%d")(d.date); }))
        .range([0, width])
        ;

    // Add Y axis
    y = d3.scaleLinear()
        .domain([d3.min(data, function (d) { return d.logits; }), d3.max(data, function (d) { return d.logits; })])
        .range([height, 0]);
}



function LineChart({ data }) {
    const ref = useD3((svg) => {
        db.get("genz").then((dd) => {
            data = dd.data.slice(0, 300);
            data = data.sort(function (a, b) {
                return new Date(a.date) - new Date(b.date);
            });

            // set the dimensions and margins of the graph
            var margin = { top: 10, right: 10, bottom: 30, left: 60 },
                width = 460 - margin.left - margin.right,
                height = 400 - margin.top - margin.bottom;

            // append the svg object to the body of the page
            var svg = d3.select(".plot-area")
                .text("us sss")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

            var sumstat = nest() // nest function allows to group the calculation per level of a factor
                .key(function (d) { return d.category; })
                .entries(data);

            // Add X axis --> it is a date format
            var x = d3.scaleTime()
                .domain(d3.extent(data, function (d) { return d3.timeParse("%Y-%m-%d")(d.date); }))
                .range([0, width]);
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).ticks(5));

            // Add Y axis
            var y = d3.scaleLinear()
                .domain([0, d3.max(data, function (d) { return d.sentence_sent_score; })])
                .range([height, 0]);
            svg.append("g")
                .call(d3.axisLeft(y));

            // color palette
            var res = sumstat.map(function (d) { return d.category }) // list of group names
            var color = d3.scaleOrdinal()
                .domain(res)
                .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999'])

            // Draw the line
            svg.selectAll(".line")
                .data(sumstat)
                .enter()
                .append("path")
                .attr("fill", "none")
                .attr("stroke", function (d) {
                    // console.log(d);
                    return color(d.key)
                })
                .attr("stroke-width", 1.5)
                .attr("d", function (d) {
                    return d3.line()
                        .x(function (d) { return x(d3.timeParse("%Y-%m-%d")(d.date)); })
                        .y(function (d) { return y(d.sentence_sent_score); })
                        (d.values)
                })
        });
    });


    return (
        <svg
            ref={ref}
            style={{
                height: 500,
                width: "100%",
                marginRight: "0px",
                marginLeft: "0px",
            }}
        >
            <g className="plot-area" />
            <g className="x-axis" />
            <g className="y-axis" />
        </svg>
    );
}

export default LineChart;