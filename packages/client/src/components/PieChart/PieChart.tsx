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
  const pieRef = useRef(null)
  const [data, setData] = useState<Datum[]>([])

  // setting up svg container
  const w = width
  const radius = w / 2

  // setting up chart
  const generator = d3.pie<void, Datum>()
  const arcs = generator
    .padAngle(1 / radius)
    .sort(null)
    .value((d) => d.value)(data)

  const arcGenerator = d3
    .arc<d3.PieArcDatum<Datum>>()
    .innerRadius(radius / 2)
    .outerRadius(radius)
  const color = d3.scaleOrdinal<number, string>().range(d3.schemeSet2)

  const sizes = {
    innerRadius: radius / 2,
    outerRadius: radius,
  }

  const durations = {
    entryAnimation: 2000,
  }

  // For animating the chart
  const angleInterpolation = d3.interpolate(
    generator.startAngle()(data),
    generator.endAngle()(data),
  )

  // For expanding the chart
  const innerRadiusInterpolation = d3.interpolate(0, sizes.innerRadius)
  const outerRadiusInterpolation = d3.interpolate(0, sizes.outerRadius)

  useEffect(() => {
    setData(props.data)

    if (!svgRef.current) return
    if (!pieRef.current) return
    if (!data) return

    d3.select(svgRef.current)
      // .select('#demo-pie-chart')
      .attr('viewBox', [-w / 2, -w / 2, w, w])
      // .attr('width', w)
      // .attr('height', w)
      .attr('style', `max-width: 100%; height: auto; height: intrinsic;`)

    // setting up svg data
    d3.select(pieRef.current)
      // .attr('stroke', 'red')
      // .attr('stroke-width', 2)
      .selectAll('path')
      .data(arcs)
      .join('path')
      .attr('d', arcGenerator)
      .attr('fill', (d) => color(d.value))
      .style('opacity', 0.7)
      .transition()
      .duration(durations.entryAnimation)
      .attrTween('d', (d) => {
        const originalEnd = d.endAngle
        return (t) => {
          const currentAngle = angleInterpolation(t)
          if (currentAngle < d.startAngle) {
            return ''
          }

          d.endAngle = Math.min(currentAngle, originalEnd)

          return arcGenerator(d) || ''
        }
      })

    // setting up annotations
    d3.select(pieRef.current)
      .attr('font-family', 'roboto')
      .attr('font-weight', 'bold')
      .attr('text-anchor', 'middle')
      .selectAll('text')
      .data(arcs)
      .join('text')
      .text((d) => `${d.data.name} (${d.data.value})`)
      .attr('transform', (d) => `translate(${arcGenerator.centroid(d)})`)
      .transition()
      .duration(durations.entryAnimation)
      .attrTween('font-size', (d) => {
        const fontSize = d3.interpolateNumber(0, 1)
        return (t) => `${fontSize(t)}vw`
      })
    // .tween('text', (d) => {
    //   const i = d3.interpolateNumber(0, d.endAngle - d.startAngle)
    //   return (t) => {
    //     d.endAngle = d.startAngle + i(t)
    //   }
    // })

    // expanding chart
    d3.select(svgRef.current)
      .transition()
      .duration(durations.entryAnimation)
      .tween('arcRadii', () => {
        return (t: number) =>
          arcGenerator
            .innerRadius(innerRadiusInterpolation(t))
            .outerRadius(outerRadiusInterpolation(t))
      })
    // setting up legend
    // const legend = svg
    //   .select('g.legend')
    //   .attr('font-family', 'sans-serif')
    //   .attr('font-size', '1vw')
    //   .attr('text-anchor', 'end')
    //   .selectAll('g')
    //   .data(arcs)
    //   .join('g')
    //   .attr('transform', (d, i) => `translate(0,${i * 20})`)

    // legend
    //   .append('rect')
    //   .attr('x', w / 2 - 19)
    //   .attr('width', 19)
    //   .attr('height', 19)
    //   .attr('fill', (d) => color(d.value))

    // legend
    //   .append('text')
    //   .attr('x', w / 2 - 24)
    //   .attr('y', 9.5)
    //   .attr('dy', '0.35em')
    //   .text((d) => d.data.name)
  }, [
    angleInterpolation,
    arcGenerator,
    arcs,
    color,
    data,
    durations.entryAnimation,
    innerRadiusInterpolation,
    outerRadiusInterpolation,
    props.data,
    w,
  ])

  return (
    <Box ref={ref}>
      <svg ref={svgRef} id="demo-pie-chart">
        <g ref={pieRef}></g>
        {/* <g className="legend" /> */}
      </svg>
    </Box>
  )
}

export default PieChart
