import React, { useEffect, useRef, useState } from 'react'

import * as d3 from 'd3'

import { Box } from '@mui/material'

import useSize from '@/hooks/useSize'

interface Datum {
  name: string
  value: number
}

interface Props {
  data: Datum[]
}

const PieChart = (props: Props) => {
  const { ref, width, height } = useSize()
  const svgRef = useRef(null)
  const [data, setData] = useState<Datum[]>([])

  // setting up svg container
  const w = width
  const radius = w / 2
  const svg = d3
    .select(svgRef.current)
    .attr('viewBox', [-w / 2, -w / 2, w, w])
    // .attr('width', w)
    // .attr('height', w)
    .attr('style', `max-width: 100%; height: auto; height: intrinsic;`)

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

  useEffect(() => {
    setData(props.data)

    if (!svgRef.current) return
    if (!data) return

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
      .attr('font-size', '1vw')
      .attr('text-anchor', 'middle')
      .selectAll('text')
      .data(arcs)
      .join('text')
      .text((d) => `${d.data.name} (${d.data.value})`)
      .attr('transform', (d) => `translate(${arcGenerator.centroid(d)})`)

    return () => {
      svg.selectAll('*').remove()
    }
  }, [arcGenerator, arcs, color, data, props.data, svg])

  return (
    <Box ref={ref}>
      <svg ref={svgRef} />
    </Box>
  )
}

export default PieChart
