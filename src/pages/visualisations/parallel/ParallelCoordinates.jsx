import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import * as d3 from "d3";
import { keys } from 'd3-array';
//import { Data, Variable } from "./data";

import useDimensions from "../useDimensions";

const DIMENSIONS = { marginTop: 50, marginRight: 50, marginBottom: 50, marginLeft: 50, innerPadding: 0 };

const COLORS = ["#e0ac2b", "#e85252", "#6689c6", "#9a6fb0", "#a53253", "#69b3a2"];


export const ParallelCoordinates = forwardRef((props, ref) => {

    useImperativeHandle(ref, () => ({
        GetId,
        SelectPoints,
        UnselectPoints,
        UpdateProperties,
    }));


    const [id, setId] = React.useState(props.id);

    const svgRef = useRef();
    const gXAxisRef = useRef();
    const gYAxisRef = useRef();
    const rectRef = useRef();
    const axesDOMRef = useRef();


    const GetId = () => {
        return id;
      };


    const SelectPoints = (pointIds) => {
        for (let i = 0; i < pointIds.length; i++)
        {
            d3.select(svgRef.current).select('[id="line' + pointIds[i] + '"]').style("stroke", "#0000ff");
        }
    };
    const UnselectPoints = () => {
        // let pointIds = [1, 3, 5];
        // for (let i = 0; i < pointIds.length; i++)
        for (let i = 0; i < data.length; i++)
        {
            d3.select(svgRef.current).select('[id="line' + i + '"]').style("stroke", "#cb1dd1");
        }
    };





    const [wrapperRef, dimensions] = useDimensions();
    const updatedDimensions = {
        ...DIMENSIONS,
        ...dimensions,
        boundedHeight: Math.max(
            dimensions.height - DIMENSIONS.marginTop - DIMENSIONS.marginBottom,
            0
        ),
        boundedWidth: Math.max(
            dimensions.width - DIMENSIONS.marginLeft - DIMENSIONS.marginRight,
            0
        )
        };
    const { boundedHeight, boundedWidth, innerPadding } = updatedDimensions;

    //const allGroups = [...new Set(data.map((d) => d.group))];


    


    let data = [];
    let csvData = [];

    const InitialiseData = () => {
        csvData = props.parentRef.getData();

        data = [];
        for (let i = 0; i < csvData.length; i++) {
            var row = csvData[i];
            var xAxisValue = Number(row["power"]);
            var yAxisValue = Number(row["cost"]);
            data.push([xAxisValue, yAxisValue]);
        }
    }
    InitialiseData();

    const dimensionss = Object.keys(csvData[0]);


    let y = {};
    // For each dimension, I build a linear scale. I store all in a y object
    for (var i in dimensionss) {
        let name = dimensionss[i]
        y[name] = d3.scaleLinear()
            .domain(d3.extent(csvData, function (d) { return +d[name]; }))
            .range([boundedHeight, 0]);
    }

    // Build the X scale -> it find the best position for each Y axis
    let x = d3.scalePoint()
        .range([0, boundedWidth])
        .padding(0.5)
        .domain(dimensionss);



    // Create g DOM which is the main g of the chart
    d3.select(svgRef.current).select("g")
        .attr("transform", "translate(" + DIMENSIONS.marginLeft + "," + DIMENSIONS.marginTop + ")");

    // =========
    // Add Lines
    // =========
    d3.select(rectRef.current).selectAll('path').remove();
    let foreground = d3.select(rectRef.current)
        //.attr("transform", "translate(" + DIMENSIONS.marginLeft + "," + DIMENSIONS.marginTop + ")")
        .selectAll("path")
        .data(csvData)
        .enter()
        .append("path")
        .attr("id", function (d, i) {
            return "line" + i;
        })
        .attr("d", function (d) {
            return d3.line()(dimensionss.map(function (p) {
                return [x(p), y[p](d[p])];
            }));
        })
        //.style("stroke", this.solutionColour)
        // .style("stroke", function (d, i) {
        //     return vision.DetermineSolutionCategoryColour(i);
        // })
        .attr('stroke', 'steelblue')
        .attr("fill", "none");


    // ========
    // Add Axes
    // ========

    let dragging = {};

    let dragStarted = false;
    let brushing = false;

    // Add a group element for each dimension.
    d3.select(axesDOMRef.current).selectAll('.dimension').remove();
    var g = d3.select(axesDOMRef.current)
        //.attr("transform", "translate(" + DIMENSIONS.marginLeft + "," + DIMENSIONS.marginTop + ")")
        .selectAll(".dimension")
        .data(dimensionss)
        .enter().append("g")
        .attr("class", "dimension")
        .attr("transform", function (d) { return "translate(" + x(d) + ")"; })
        .call(d3.drag()
            .subject(function (d) {
                return { x: x(d) };
            })
            .on("start", function (d) {
                if (brushing)
                    return;
                console.log("drag on start")
                dragging[d] = x(d);
                dragStarted = true;
            })
            .on("drag", function (event, d) {
                if (brushing)
                    return;
                if (dragStarted)
                {
                    console.log("drag on drag")
                    //dragging[d] = Math.min(boundedWidth, Math.max(0, d3.event.x));d3.pointer(event)[0]
                    dragging[d] = Math.min(boundedWidth, Math.max(0, event.x));
                    foreground.attr("d", function (d) {
                        return d3.line()(dimensionss.map(function (p) {
                            return [x(p), y[p](d[p])];
                        }));
                    });
                    dimensionss.sort(function (a, b) {
                        return position(a) - position(b);
                    });
                    x.domain(dimensionss);
                    g.attr("transform", function (d) {
                        return "translate(" + position(d) + ")";
                    })
                }
            })
            .on("end", function (event, d) {
                console.log("drag on end")
                delete dragging[d];
                transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
                transition(foreground).attr("d", function (d) {
                    return d3.line()(dimensionss.map(function (p) {
                        return [x(p), y[p](d[p])];
                    }));
                });
                dragStarted = false;
            })
        );


        let axis = d3.axisLeft();
        // Add an axis and title.
        g.append("g")
            .attr("class", "axis")
            .each(function (d) {
                
                d3.select(this).call(axis.scale(y[d]));
            })
            .append("text")
            .style("text-anchor", "middle")
            .attr("y", -9)
            .text(function (d) {
                return d;
            })
            .style("fill", "black");
        // this.SetAxesColour(this.axesColour);

        // Add and store a brush for each axis.
        g.append("g")
        .attr("class", "brush")
        .each(function (d) {
            d3.select(this).call(y[d].brush = d3.brushY()
                .extent([[-10, 0], [10, boundedHeight]])
                .on("start", function() { brushing = true; console.log("brush on start") })
                .on("brush", brush)
                .on("end", function() { brushing = false; brush();console.log("brush on end")  })
            )
        })
        .selectAll("rect")
        .attr("x", -8)
        .attr("width", 16);
    
    // Handles a brush event, toggling the display of foreground lines.
    function brush() {
        console.log("brush on brush")
        var actives = [];
        d3.select(svgRef.current).selectAll(".brush")
            .filter(function (d) {
                y[d].brushSelectionValue = d3.brushSelection(this);
                return d3.brushSelection(this);
            })
            .each(function (d) {
                // Get extents of brush along each active selection axis (the Y axes)
                actives.push({
                    dimension: d,
                    extent: d3.brushSelection(this).map(y[d].invert)
                });
            });

        // Update foreground to only display selected values
        d3.select(rectRef.current).selectAll("path").style("display", function (d) {
            return actives.every(function (active) {
                return active.extent[1] <= d[active.dimension] && d[active.dimension] <= active.extent[0];
            }) ? null : "none";
        });
    }

    function brushstop(event) {
        event.sourceEvent.stopPropagation();
    }

    
    function position(d) {
        var v = dragging[d];
        return v == null ? x(d) : v;
    }
    
    function transition(g) {
        return g.transition().duration(500);
    }


    const UpdateProperties = () => {
        if (props.propertiesRef.current != null)
            props.propertiesRef.current.updateState(ref, props.csvData);
    }

    const handleClick = () => {
        console.log('SVG clicked in parallel coordinates plot!');
        console.log(props.id);
        // Your click event handling logic goes here
        props.parentRef.UpdateProperties(props.id);
      };

    return (
        <div id="root" ref={wrapperRef} style={{ marginBottom: "2rem" }} onClick={handleClick}>
            <svg ref={svgRef} width={dimensions.width} height={dimensions.height}>
                <rect id="backgroundRect" width={dimensions.width} height={dimensions.height} fill="none" />
                <g id="common" >
                    <g id="lines" ref={rectRef} class="foreground" />
                    <g id="axes" ref={axesDOMRef} />
                </g>
            </svg>
        </div>
    );
});
