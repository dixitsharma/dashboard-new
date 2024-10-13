import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const PieChart = ({ data }) => {
  const ref = useRef();

  useEffect(() => {
    const svg = d3.select(ref.current)
      .attr('width', 400)
      .attr('height', 400)
      .append('g')
      .attr('transform', 'translate(200,200)');

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pie = d3.pie().value(d => d.value);
    const arc = d3.arc().innerRadius(0).outerRadius(100);

    const arcs = svg.selectAll('arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.label))
      .on('mouseover', function(event, d) {
        d3.select(this).transition().duration(200).attr('d', d3.arc().innerRadius(0).outerRadius(110));
        tooltip.transition().duration(200).style('opacity', .9);
        tooltip.html(`Label: ${d.data.label}<br>Value: ${d.data.value}`)
          .style('left', (event.pageX + 5) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function(d) {
        d3.select(this).transition().duration(200).attr('d', arc);
        tooltip.transition().duration(500).style('opacity', 0);
      });

    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    svg.append('g')
      .attr('transform', 'translate(-100, 150)')
      .selectAll('text')
      .data(data)
      .enter()
      .append('text')
      .text(d => `${d.label}: ${d.value}`)
      .attr('fill', d => color(d.label))
      .attr('y', (d, i) => i * 20);
  }, [data]);

  return <svg ref={ref}></svg>;
};

export default PieChart;
