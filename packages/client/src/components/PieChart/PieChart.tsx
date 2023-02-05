import React, { useEffect, useRef, useState } from 'react'

import * as d3 from 'd3'

interface Datum {
  name: string
  value: number
}

const PieChart = () => {
  const svgRef = useRef(null)
  const [data] = useState([
    { name: 'A', value: 10 },
    { name: 'B', value: 20 },
    { name: 'C', value: 30 },
  ])

  useEffect(() => {
    // setting up svg container
    const w = 500
    const h = 500
    const radius = w / 2
    const svg = d3
      .select(svgRef.current)
      .attr('viewBox', [-w / 2, -h / 2, w, h])
      .attr('width', w)
      .attr('height', h)
    // .attr('style', 'max-width: 100%; height: auto; height: intrinsic;')

    // setting up chart
    const arcs = d3
      .pie<void, Datum>()
      .padAngle(1 / radius)
      .sort(null)
      .value((d) => d.value)(data)
    const arcGenerator = d3
      .arc<d3.PieArcDatum<Datum>>()
      .innerRadius(radius / 2)
      .outerRadius(radius)
    const color = d3.scaleOrdinal<number, string>().range(d3.schemeSet2)

    // setting up svg data
    svg
      .append('g')
      // .attr('stroke', 'red')
      // .attr('stroke-width', 2)
      .selectAll('path')
      .data(arcs)
      .join('path')
      .attr('d', arcGenerator)
      .attr('fill', (d) => color(d.value))
      .style('opacity', 0.7)

    // setting up annotations
    svg
      .append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('text-anchor', 'middle')
      .selectAll('text')
      .data(arcs)
      .join('text')
      .text((d) => `${d.data.name} (${d.data.value})`)
      .attr('transform', (d) => `translate(${arcGenerator.centroid(d)})`)

    return () => {
      svg.selectAll('*').remove()
    }
  }, [data])

  return (
    <div
      id="pie-chart"
      style={{
        display: 'inline-block',
        margin: '0 auto',
        width: '100%',
        height: '100%',
      }}>
      <svg ref={svgRef} />
    </div>
  )
}

export default PieChart
