import React, { useEffect, useMemo, useState } from 'react'

import * as d3 from 'd3'

import { Box } from '@mui/material'

import useSize from '@/hooks/useSize'

interface Datum {
  date: Date
  value: number
}

interface Props {
  data: Datum[]
}

const LineChart = ({ data: _data }: Props) => {
  const { ref, width: _w, height: _h } = useSize()

  const [data, setData] = useState<Datum[]>([])

  const svgRef = React.useRef(null)

  const x = (d: Datum) => d.date // given d in data, returns the (temporal) x-value
  const y = (d: Datum) => d.value
  const w = _w
  const h = _h
  const margin = { top: 15, right: 0, bottom: 5, left: 30 }
  const width = w - margin.left - margin.right
  const height = h - margin.top - margin.bottom
  const xType = d3.scaleTime
  const yType = d3.scaleLinear
  const xRange = [margin.left, width - margin.right]
  const yRange = useMemo(
    () => [height - margin.bottom, margin.top],
    [height, margin.bottom, margin.top],
  )
  const yLabel = '↑ Daily spending (CAD)'
  // const xLabel = '→ Date'
  const curve = d3.curveLinear
  const strokeLinecap = 'round' // stroke line cap of the line
  const strokeLinejoin = 'round' // stroke line join of the line
  const strokeWidth = 1.5 // stroke width of line, in pixels
  const strokeOpacity = 1

  const color = 'steelblue'

  // Compute values.
  const X = d3.map(data, x)
  const Y = d3.map(data, y)
  const I = d3.range(X.length)
  const defined = (d: Datum, i: number) => X[i] instanceof Date && !isNaN(Y[i])
  const D = d3.map(data, defined)

  // Compute default domains.
  const xDomain = d3.extent(X) as [Date, Date]
  const yDomain = [0, d3.max(Y)] as [number, number]

  // Construct scales and axes.
  const xScale = xType(xDomain, xRange)
  const yScale = yType(yDomain, yRange)
  const xAxis = d3
    .axisBottom<Date>(xScale)
    // .ticks(d3.utcMonth.every(1))
    // .tickFormat(d3.timeFormat('%b'))
    // .tickSizeOuter(0)
    .ticks(d3.utcDay.every(width > 300 ? 1 : 2))
    .tickFormat(d3.timeFormat('%d'))
  const yAxis = d3.axisLeft(yScale).ticks(height / 40, '~f')

  const line = d3
    .line<number>()
    .defined((d, i) => D[i])
    .curve(curve)
    .x((d, i) => xScale(X[i]))
    .y((d, i) => yScale(Y[i]))

  const svg = d3.select(svgRef.current)
  // .attr('style', `max-width: 100%; height: auto; height: intrinsic;`)

  useEffect(() => {
    if (!svgRef.current) return
    setData(_data)
    if (!data.length) return

    // Add the x-axis.
    svg
      .select<SVGGElement>('g.x-axis')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .call(
        (g) =>
          g
            .append('text')
            .attr('x', width - margin.right - 10)
            .attr('y', margin.bottom)
            .attr('fill', 'currentColor')
            .attr('text-anchor', 'start'),
        // .text(xLabel),
      )
      .transition()
      .duration(500)

    // Add the y-axis.
    svg
      .select<SVGGElement>('g.y-axis')
      .attr('transform', `translate(${margin.left},0)`)
      .call(yAxis)
      .call((g) => g.select('.domain').remove())
      .call((g) =>
        g
          .selectAll('.tick line')
          .attr('x2', width - margin.left - margin.right)
          .attr('stroke-opacity', 0.1),
      )
      .call((g) =>
        g
          .append('text')
          .attr('x', -margin.left)
          .attr('y', 10)
          .attr('fill', 'currentColor')
          .attr('text-anchor', 'start')
          .text(yLabel),
      )
      .transition()
      .duration(500)

    const path = svg
      .select('g.line')
      .select<SVGPathElement>('path')
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', strokeWidth)
      .attr('stroke-linecap', strokeLinecap)
      .attr('stroke-linejoin', strokeLinejoin)
      .attr('stroke-opacity', strokeOpacity)
      .attr('d', line(I))
      .transition()
      .duration(1000)
      .attrTween('d', () => {
        return (t: number) => {
          const yInterpolate = (v: number) => d3.interpolate(yRange[0], v)
          line.y((d, i) => yInterpolate(yScale(Y[i]))(t))
          return line(I) || ''
        }
      })

    // Draw the line.
    // const pathLength = path.node()?.getTotalLength() || 0
    // console.log(pathLength)

    // if (pathLength) {
    //   path
    //     .attr('stroke-dashoffset', pathLength)
    //     .attr('stroke-dasharray', pathLength)
    //     .transition()
    //     .ease(d3.easeSin)
    //     .duration(2500)
    //     .attr('stroke-dashoffset', 0)
    // }

    svg
      .select('g.dots')
      .selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', (d) => xScale(x(d)))
      .attr('cy', (d) => yScale(y(d)))
      .attr('r', 3)
      .attr('fill', 'currentColor')
      .attr('stroke', 'white')
      .attr('stroke-width', 1)
      .transition()
      .duration(1000)
      .attrTween('cy', (d) => {
        return (t: number) => {
          const yInterpolate = (v: number) => d3.interpolate(yRange[0], v)
          return String(yInterpolate(yScale(y(d)))(t)) || ''
        }
      })
  }, [
    I,
    Y,
    _data,
    data,
    height,
    line,
    margin.bottom,
    margin.left,
    margin.right,
    svg,
    width,
    xAxis,
    xScale,
    yAxis,
    yRange,
    yScale,
  ])

  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
      ref={ref}>
      <svg height="100%" width="100%" ref={svgRef}>
        <g className="x-axis"></g>
        <g className="y-axis"></g>
        <g className="line">
          <path />
        </g>
        <g className="dots"></g>
      </svg>
    </Box>
  )
}

export default LineChart
