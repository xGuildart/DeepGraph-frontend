import { useD3 } from '../../hooks/useD3';
import React from 'react';
import * as d3 from 'd3';
import { nest } from 'd3-collection';
import db from '../../storage/pouchdb';
import dateFormat from 'dateformat';
import { Translate } from '@material-ui/icons';

var margin, width, height;
var min_func, min_net, x, y, y2, svg, c_stat, c_func, percent_f, line1, line2, circle1, circle2;

var df = (d) => { var k = d3.format(".1"); return d >= 0 ? k(d) * 100 : k(d * (-1)) * (-1) * 100; };

function init_vars(data, dims, scale, gstate) {
    // set the dimensions and margins of the graph
    margin = { top: 40, right: 20, bottom: 30, left: 30 };
    width = dims.width * scale / 100;
    height = dims.height * 25 / 100;


    // // color palette
    // color = d3.scaleOrdinal()
    //     .domain(keys)
    //     .range(d3.schemePaired);

    c_stat = (d) => gstate.stats == "Logits" ? d.logits : gstate.stats == "Logits_Mean" ? d.logits_mean : d.MA_logits;
    c_func = (d) => gstate.funcs == "Net_Sent" ? d.net_sent : gstate.funcs == "MA_Net_Sent" ? d.MA_net_sent : gstate.funcs == "MA_NS_EMA@0.1" ? d.MA_net_sent_ema_alpha_0[1] : gstate.funcs == "MA_NS_EMA@0.3" ? d.MA_net_sent_ema_alpha_0[3] : d.MA_net_sent_ema_alpha_0[5];

    percent_f = (d) => { return df(d) + "%"; }
    min_func = d3.min(data, function (d) { return c_stat(d); });
    min_net = d3.min(data, function (d) { return df(c_func(d)); });
    // Add X axis --> it is a date format
    x = d3.scaleBand()
        .domain(data.map(function (d) { return d3.timeParse("%Y-%m-%d")(d.date); }))
        .range([0, width]);

    // Add Y axis
    y = d3.scaleLinear()
        .domain([min_func, d3.max(data, function (d) { return c_stat(d); })])
        .range([height, 0]);

    // Add Y axis
    y2 = d3.scaleLinear()
        .domain([min_net, d3.max(data, function (d) { return df(c_func(d)); })])
        .range([height, 0]);
}

export function update_stats(data, stats) {
    c_stat = (d) => stats == "Logits" ? d.logits : stats == "Logits_Mean" ? d.logits_mean : d.MA_logits;
    min_func = d3.min(data, function (d) { return c_stat(d); });

    svg.selectAll("line#line1")
        .transition()
        .duration(2000)
        .attr("y1", function (d) { return y(c_stat(d)); });

    svg.selectAll("circle#circle1")
        .transition()
        .duration(2000)
        .attr("cy", function (d) { return y(c_stat((d))); });
};

export function update_funcs(data, funcs) {
    c_func = (d) => funcs == "Net_Sent" ? d.net_sent : funcs == "MA_Net_Sent" ? d.MA_net_sent : funcs == "MA_NS_EMA@0.1" ? d.MA_net_sent_ema_alpha_0[1] : funcs == "MA_NS_EMA@0.3" ? d.MA_net_sent_ema_alpha_0[3] : d.MA_net_sent_ema_alpha_0[5];
    min_net = d3.min(data, function (d) { return df(c_func(d)); });

    svg.selectAll("line#line2")
        .transition()
        .duration(2000)
        .attr("y1", function (d) { return y2(df(c_func(d))); });

    svg.selectAll("circle#circle2")
        .transition()
        .duration(2000)
        .attr("cy", function (d) { return y2(df(c_func((d)))); });
};

function ConstructLollipop(data) {

    svg = d3.select("div#container")
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 800 800")
        .classed("svg-content", true)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .style("font", "7.5px times")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(d3.timeMonth, 1)
            .tickFormat(d3.timeFormat('%b %y')))
        .selectAll("text")
        .attr("transform", "translate(-10,5)rotate(-80)")
        .style("text-anchor", "end");

    svg.append("g")
        .call(d3.axisLeft(y))
        .style("fill", "#69b3a2")
        .style("stroke", "#69b3a2");



    svg.append("g")
        .attr("transform", "translate(" + width + ",0)")
        .call(d3.axisRight(y2).tickFormat(function (d) { return d + "%"; }))
        .style("fill", "#F68D1E")
        .style("stroke", "#F68D1E")
        .selectAll("text")
        .attr("transform", "translate(10, 0)");

    // Lines stats
    svg.selectAll("myline1")
        .data(data)
        .enter()
        .append("line")
        .attr("id", "line1")
        .attr("x1", function (d) { return x(d3.timeParse("%Y-%m-%d")(d.date)); })
        .attr("x2", function (d) { return x(d3.timeParse("%Y-%m-%d")(d.date)); })
        .attr("y1", function (d) { return y(c_stat(d)); })
        .attr("y2", function (d) { return y(min_func); })
        .attr("stroke", "grey")

    // Lines stats
    svg.selectAll("myline2")
        .data(data)
        .attr("class", "line2")
        .enter()
        .append("line")
        .attr("id", "line2")
        .attr("x1", function (d) { return x(d3.timeParse("%Y-%m-%d")(d.date)); })
        .attr("x2", function (d) { return x(d3.timeParse("%Y-%m-%d")(d.date)); })
        .attr("y1", function (d) { return y2(df(c_func(d))); })
        .attr("y2", function (d) { return y2(min_net); })
        .attr("stroke", "#F68D1E")


    // Circles
    svg.selectAll("mycircle")
        .data(data)
        .enter()
        .append("circle")
        .attr("id", "circle1")
        .attr("cx", function (d) { return x(d3.timeParse("%Y-%m-%d")(d.date)); })
        .attr("cy", function (d) { return y(c_stat((d))); })
        .attr("r", "4")
        .style("fill", "#69b3a2")
        .attr("stroke", "black")

    // Circles
    svg.selectAll("mycircle_s")
        .data(data)
        .enter()
        .append("circle")
        .attr("id", "circle2")
        .attr("cx", function (d) { return x(d3.timeParse("%Y-%m-%d")(d.date)); })
        .attr("cy", function (d) { return y2(df(c_func(d))); })
        .attr("r", "2")
        .style("fill", "#F68D1E");

}

function draw_graph(data, dims, scale, gstate) {
    init_vars(data, dims, scale, gstate);
    ConstructLollipop(data);
}

function LollipopChart({ data, dims, scale, gstate }) {
    const styles = {
        height: '100%',
        backgroundColor: 'white',
        marginRight: "0px",
        marginLeft: "0px",
    };

    const ref = useD3((svg) => {
        if (data.length !== 0) {

            d3.select('div#container')
                .select('svg')
                .remove();

            draw_graph(data, dims, scale, gstate);
        }
    }, [data]);

    return (
        <div ref={ref}>
            <div id="container" className="svg-container" style={styles}></div>
        </div>
    );
}

export default LollipopChart;