var t1 = {
    triangle_div :  null,
    color :  {},
    chart :  null,
    xScale :  null,
    yScale :  null,
    tooltip :  null,
    getChartData : function (data_arr) {
        var chart_data = [];
        data_arr.forEach(function (data, idx) {
            var c2h4 = data.c2h4;
            var c2h2 = data.c2h2;
            var ch4 = data.ch4;
            var timestamp = data.timestamp;
            var interpretation = data.interpretation;

            var tr_l = 100; //Equilateral triangle side length = 100, Origin at 33.33% of length of each side
            var tr_h = Math.sqrt(Math.pow(tr_l, 2) - Math.pow(tr_l / 2, 2)); //86.60254038
            var tr_ymax = (tr_l / 2) / Math.cos((30/180) * Math.PI); //57.73502692
            var tr_ymin = tr_ymax - tr_h;  //-28.86751346


            var dt1_total = c2h4 + c2h2 + ch4; //Getting the percentage of each value
            var c2h4_pc = (c2h4 / dt1_total) * 100;
            var c2h2_pc = (c2h2 / dt1_total) * 100;
            var ch4_pc = (ch4 / dt1_total) * 100;

            var dt1_x = (c2h4_pc - c2h2_pc) * Math.sin(30 * Math.PI / 180);
            var dt1_y = (ch4_pc / 100) * tr_h + tr_ymin;
            
            var chart_data_obj = {
                key : idx,
                x : dt1_x,
                y : dt1_y,
                c2h4 : c2h4,
                c2h2 : c2h2,
                ch4 : ch4,
                c2h4_pc : c2h4_pc,
                c2h2_pc : c2h2_pc,
                ch4_pc : ch4_pc,
                date : timestamp,
                fault : interpretation,
                color : t1.getHexColor(idx, data_arr.length),
            };

            chart_data.push(chart_data_obj);
        });

        return chart_data;
    },
    getHexColor : function (idx, total) { //get the color assigned to specific plot from yellow(oldest) to red(newest)
        var r = 255;
        var g = 0;
        var b = 0;

        //yellow to red (255, 255, 0) - (255, 0, 0)
        var interval = 255 / total;
        var green = 255 - Math.floor(((idx + 1 ) * interval));
        var r_hex = Number(r).toString(16).length < 2 ? "0" + Number(r).toString(16) : Number(r).toString(16);
        var g_hex = Number(green).toString(16).length < 2 ? "0" + Number(green).toString(16) : Number(green).toString(16);
        var b_hex = Number(b).toString(16).length < 2 ? "0" + Number(b).toString(16) : Number(b).toString(16);

        var hex_color = r_hex + g_hex + b_hex;
        return "#"+ hex_color;
    }
};

var duvals1 = {
    load : function (container, config, data) {
        t1.triangle_div = container;
        var div_id = container.replace("#", "");

        t1.color = {
            PD : (config.pd_color != undefined ? config.pd_color : 'pink'),
            T1 : (config.t1_color != undefined ? config.t1_color : 'orange'),
            T2 : (config.t2_color != undefined ? config.t2_color : 'LimeGreen'),
            T3 : (config.t3_color != undefined ? config.t3_color : 'HotPink'),
            DT : (config.dt_color != undefined ? config.dt_color : 'blue'),
            D1 : (config.d1_color != undefined ? config.d1_color : 'SkyBlue'),
            D2 : (config.d2_color != undefined ? config.d2_color : '#679A00'),
        };
        var points = [
            {"x":0, "y":57.73502692}, //1
            {"x":-1, "y":56.003}, //2
            {"x":1, "y":56.003}, //3
            {"x":-2, "y":54.271}, //4
            {"x":8, "y":36.95}, //5
            {"x":10, "y":40.415}, //6
            {"x":23, "y":10.96965511}, //7
            {"x":25, "y":14.43375673}, //8
            {"x":17.5, "y":1.443375673}, //9
            {"x":35, "y":-28.86751346}, //10
            {"x":50, "y":-28.86751346}, //11
            {"x":-6.5, "y":46.47669667}, //12
            {"x":13.5, "y":11.83568052}, //13
            {"x":5.5, "y":-2.020725942}, //14
            {"x":21, "y":-28.86751346}, //15
            {"x":5, "y":26.55811238}, //16
            {"x":-27, "y":-28.86751346}, //17
            {"x":-50, "y":-28.86751346} //18            
               
         ];

        var orders = [
            {"name":"PD", "order":[1, 2, 3]},
            {"name":"T1", "order":[3, 2, 4, 5, 6]},
            {"name":"T2", "order":[6, 5, 7, 8]},
            {"name":"T3", "order":[8, 9, 10, 11]},
            {"name":"DT", "order":[4, 12, 13, 14, 15, 10, 9, 7]},
            {"name":"D1", "order":[12, 18, 17, 16]},
            {"name":"D2", "order":[16, 17, 15, 14, 13]}
        ];

        zones = [];

        orders.forEach(function (o) {
            var polygon_pts = [];
            o.order.forEach(function (z) {
                polygon_pts.push({"x" : points[z - 1].x, "y" : points[z - 1].y});
            });

            zones.push({name : o.name, points : polygon_pts});
        });

        var margin = {top: 0, right: 0, bottom: 0, left: 0};
        width = 438.8 - margin.left - margin.right;
        height = 380 - margin.top - margin.bottom;
        var svg = d3.select(t1.triangle_div).append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 438.8 380")
        t1.chart = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        t1.xScale = d3.scaleLinear().range([0,width]);
        t1.yScale = d3.scaleLinear().range([height,0]);
        t1.xScale
            .domain([-50, 50])
            .nice();
        t1.yScale
            .domain([-40, 60])
            .nice();
        t1.chart.selectAll("polygon2")
            .data(zones)
            .enter().append("polygon")
            .attr("points",function(d) { return d.points.map(function(d) { 
                    return [t1.xScale(d.x), t1.yScale(d.y)].join(","); 
                }).join(" ");})
            .attr("fill", function(d){
                return t1.color[d.name];
            })
        //.attr("stroke","#666")
            .attr("stroke-width",2);

        svg.append("svg:text")
            .attr("x", 300)
            .attr("y", -210)
            .attr("transform", "rotate(60)")
            .attr("text-anchor", "middle")
            .style("font", "sans-serif")
            .style("font-size", "10px")
            .text("% C2H4 --->")
            .style("fill", "#333")
            .style("stroke-width", "0px")
            .style("font-family", "calibri");

        svg.append("svg:text")
            .attr("x", 205)
            .attr("y", 360)
            .attr("text-anchor", "middle")
            .style("font", "sans-serif")
            .style("font-size", "10px")
            .text("<--- % C2H2")
            .style("fill", "#333")
            .style("stroke-width", "0px")
            .style("font-family", "calibri");

        svg.append("svg:text")
            .attr("x", -100)
            .attr("y", 164)
            .attr("transform", "rotate(-60)")
            .attr("text-anchor", "middle")
            .style("font", "sans-serif")
            .style("font-size", "10px")
            .text("% CH4 --->")
            .style("fill", "#333")
            .style("stroke-width", "0px")
            .style("font-family", "calibri");


        t1.tooltip = d3.select('body')
            .append('div')
            .attr('id', div_id + '-tooltip')
            .style('padding', '10px')
            .style('font-size', '10px')
            .style('background', '#fff')
            .style('opacity', 0)
            .style('position', 'absolute')
            .style('visibility', 'hidden')
            .style('font-family', 'calibri');

        var chart_data = t1.getChartData(data);
        t1.chart.selectAll("points")
            .data(chart_data)
            .enter().append("circle")
            .attr("r", 2.5)
            .attr("cx", function(d) { return t1.xScale(d.x); })
            .attr("cy", function(d) { return t1.yScale(d.y); })
            .attr("id", function (d) { return "plot-" + div_id + "-" + d.key; })
            .style("opacity", 0.2)
            .style("fill", function(d) { d.color; })
            .on("mouseover", function(d) {
                var html = '<table width="100%" class="basic-table" style="font-size:11px;">';
                html += '<tr><td style="font-weight:bold;">Timestamp </td><td>' + d.date + '</td></tr>';
                html += '<tr><td style="font-weight:bold;">C2H4 </td><td>' + d.c2h4 + '('+ d.c2h4_pc.toFixed(2) +'%)' + '</td></tr>';
                html += '<tr><td style="font-weight:bold;">C2H2 </td><td>' + d.c2h2 + '('+ d.c2h2_pc.toFixed(2) +'%)' + '</td></tr>';
                html += '<tr><td style="font-weight:bold;">CH4 </td><td>' + d.ch4 + '('+ d.ch4_pc.toFixed(2) +'%)' + '</td></tr>';
                html += '<tr><td style="font-weight:bold;">Fault </td><td>' + d.interpretation + '</td></tr>';
                html += '</table>';
                t1.tooltip.html(html)
                    .style("left", (d3.event.pageX + 10) + "px")
                    .style("top", (d3.event.pageY - 10) + "px")
                t1.tooltip.transition()
                .duration(300)
                .style("opacity", 1)
                .style("visibility", "visible");
            })
            .on("mouseout", function(d) {
                t1.tooltip.transition()
                    .duration(300)
                    .style("opacity", 0)
                    .style("visibility", "hidden");
            });

        var duration = 1000 / chart_data.length;
        chart_data.forEach(function (val, idx) {
            var plot = d3.select('#plot-' + div_id + '-' + idx).transition()
                .duration((idx + 1) * duration)
                .style('fill', val.color)
                .style("opacity", 1)
                .style("cursor", "pointer");

                if(idx == chart_data.length - 1) {
                    plot.attr('r', 4);
                }
        });

        //Legend
        var legend_table = '<table style="font-size:12px; font-family: calibri; text-align:left;">';
        legend_table += '<tr><td style="width:14px;"><div id="'+ div_id + '-legend-0' + '" style="border:1px solid #757575; vertical-align:middle; background : '+ t1.color.PD +'; width:10px;height:8px;"></td><td>PD: Coronal Partial Discharge</td></tr>';
        legend_table += '<tr><td style="width:10px;"><div id="'+ div_id + '-legend-1' + '" style="border:1px solid #757575; vertical-align:middle; background : '+ t1.color.T1 +'; width:10px;height:8px;"></td><td>T1: Thermal Faults, T</td></tr>';
        legend_table += '<tr><td style="width:10px;"><div id="'+ div_id + '-legend-2' + '" style="border:1px solid #757575; vertical-align:middle; background : '+ t1.color.T2 +'; width:10px;height:8px;"></td><td>T2: Thermal Faults, 300&#8451 < T < 700&#8451</td></tr>';
        legend_table += '<tr><td style="width:10px;"><div id="'+ div_id + '-legend-3' + '" style="border:1px solid #757575; vertical-align:middle; background : '+ t1.color.T3 +'; width:10px;height:8px;"></td><td>T3: Thermal faults, T > 700&#8451;</td></tr>';
        legend_table += '<tr><td style="width:10px;"><div id="'+ div_id + '-legend-4' + '" style="border:1px solid #757575; vertical-align:middle; background : '+ t1.color.DT +'; width:10px;height:8px;"></td><td>DT: Mixture of electrical, thermal faults</td></tr>';
        legend_table += '<tr><td style="width:10px;"><div id="'+ div_id + '-legend-5' + '" style="border:1px solid #757575; vertical-align:middle; background : '+ t1.color.D1 +'; width:10px;height:8px;"></td><td>D1: Low energy discharges</td></tr>';
        legend_table += '<tr><td style="width:10px;"><div id="'+ div_id + '-legend-6' + '" style="border:1px solid #757575; vertical-align:middle; background : '+ t1.color.D2 +'; width:10px;height:8px;"></td><td>D2: High energy discharges</td></tr>';
        legend_table += '</table>';
        var legend = d3.select(container)
            .append('div')
            .style('padding', '0 10px')
            .html(legend_table)

    },
    refreshData : function (data) {
        t1.chart.selectAll("circle").remove();
        var div_id = t1.triangle_div.replace("#", "");
        var chart_data = t1.getChartData(data);
        t1.chart.selectAll("points")
            .data(chart_data)
            .enter().append("circle")
            .attr("r", 2.4)
            .attr("cx", function(d) { return t1.xScale(d.x); })
            .attr("cy", function(d) { return t1.yScale(d.y); })
            .attr("id", function (d) { return "plot-" + div_id + "-" + d.key; })
            .style("fill", function(d) { return d.color })
            .style("cursor", "pointer")
            .on("mouseover", function(d) {
                var html = '<table width="100%" class="basic-table" style="font-size:12px;">';
                html += '<tr><td style="font-weight:bold;">Timestamp </td><td>' + d.date + '</td></tr>';
                html += '<tr><td style="font-weight:bold;">C2H4 </td><td>' + d.c2h4 + '('+ d.c2h4_pc.toFixed(2) +'%)' + '</td></tr>';
                html += '<tr><td style="font-weight:bold;">C2H2 </td><td>' + d.c2h2 + '('+ d.c2h2_pc.toFixed(2) +'%)' + '</td></tr>';
                html += '<tr><td style="font-weight:bold;">CH4 </td><td>' + d.ch4 + '('+ d.ch4_pc.toFixed(2) +'%)' + '</td></tr>';
                html += '<tr><td style="font-weight:bold;">Fault </td><td>' + d.fault + '</td></tr>';
                html += '</table>';
                t1.tooltip.html(html)
                    .style("left", (d3.event.pageX + 10) + "px")
                    .style("top", (d3.event.pageY - 10) + "px")
                t1.tooltip.transition()
                .duration(300)
                .style("opacity", 1)
                .style("visibility", "visible");
            })
            .on("mouseout", function(d) {
                t1.tooltip.transition()
                    .duration(300)
                    .style("opacity", 0)
                    .style("visibility", "hidden");
            });

            d3.select("#plot-" + div_id + "-" + (chart_data.length - 1)).transition().duration(100).attr('r', 4);
    },
    changeConfig : function (config) {
        d3.select(t1.chart.selectAll("polygon").nodes()[0]).style("fill", config.pd_color);
        d3.select(t1.chart.selectAll("polygon").nodes()[1]).style("fill", config.t1_color);
        d3.select(t1.chart.selectAll("polygon").nodes()[2]).style("fill", config.t2_color);
        d3.select(t1.chart.selectAll("polygon").nodes()[3]).style("fill", config.t3_color);
        d3.select(t1.chart.selectAll("polygon").nodes()[4]).style("fill", config.dt_color);
        d3.select(t1.chart.selectAll("polygon").nodes()[5]).style("fill", config.d1_color);
        d3.select(t1.chart.selectAll("polygon").nodes()[6]).style("fill", config.d2_color);

        d3.select(t1.triangle_div + '-legend-0').style('background', config.pd_color);
        d3.select(t1.triangle_div + '-legend-1').style('background', config.t1_color);
        d3.select(t1.triangle_div + '-legend-2').style('background', config.t2_color);
        d3.select(t1.triangle_div + '-legend-3').style('background', config.t3_color);
        d3.select(t1.triangle_div + '-legend-4').style('background', config.dt_color);
        d3.select(t1.triangle_div + '-legend-5').style('background', config.d1_color);
        d3.select(t1.triangle_div + '-legend-6').style('background', config.d2_color);
    },
    reanimate : function (data) {
        t1.chart.selectAll("circle").remove();
        var div_id = t1.triangle_div.replace("#", "");
        var chart_data = t1.getChartData(data);
        t1.chart.selectAll("points")
            .data(chart_data)
            .enter().append("circle")
            .attr("r", 2.5)
            .attr("cx", function(d) { return t1.xScale(d.x); })
            .attr("cy", function(d) { return t1.yScale(d.y); })
            .attr("id", function (d) { return "plot-" + div_id + "-" + d.key; })
            .style("opacity", 0.2)
            .style("fill", function(d) { d.color; })
            .on("mouseover", function(d) {
                var html = '<table width="100%" class="basic-table" style="font-size:11px;">';
                html += '<tr><td style="font-weight:bold;">Timestamp </td><td>' + d.date + '</td></tr>';
                html += '<tr><td style="font-weight:bold;">C2H4 </td><td>' + d.c2h4 + '('+ d.c2h4_pc.toFixed(2) +'%)' + '</td></tr>';
                html += '<tr><td style="font-weight:bold;">C2H2 </td><td>' + d.c2h2 + '('+ d.c2h2_pc.toFixed(2) +'%)' + '</td></tr>';
                html += '<tr><td style="font-weight:bold;">CH4 </td><td>' + d.ch4 + '('+ d.ch4_pc.toFixed(2) +'%)' + '</td></tr>';
                html += '<tr><td style="font-weight:bold;">Fault </td><td>' + d.interpretation + '</td></tr>';
                html += '</table>';
                t1.tooltip.html(html)
                    .style("left", (d3.event.pageX + 10) + "px")
                    .style("top", (d3.event.pageY - 10) + "px")
                t1.tooltip.transition()
                .duration(300)
                .style("opacity", 1)
                .style("visibility", "visible");
            })
            .on("mouseout", function(d) {
                t1.tooltip.transition()
                    .duration(300)
                    .style("opacity", 0)
                    .style("visibility", "hidden");
            });

            var duration = 1000 / chart_data.length;
            chart_data.forEach(function (val, idx) {
                var plot = d3.select('#plot-' + div_id + '-' + idx).transition()
                    .duration((idx + 1) * duration)
                    .style('fill', val.color)
                    .style("opacity", 1)
                    .style("cursor", "pointer")

                    if(idx == chart_data.length - 1) {
                        plot.attr('r', 4);
                    }
            });
    }
}