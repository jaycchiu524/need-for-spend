import React, { useEffect, useState } from 'react'

import * as d3 from 'd3'

interface Datum {
  date: Date
  value: number
}

interface Props {
  data: Datum[]
}

// [
//   { date: new Date('2020-01-01'), value: 1 },
//   { date: new Date('2020-02-02'), value: 2 },
//   { date: new Date('2020-03-03'), value: 3 },
//   { date: new Date('2020-04-04'), value: 4 },
//   { date: new Date('2020-05-05'), value: 5 },
//   { date: new Date('2020-06-06'), value: 4 },
//   { date: new Date('2020-07-06'), value: 8 },
//   { date: new Date('2020-08-06'), value: 10 },
//   { date: new Date('2020-09-06'), value: 14 },
//   { date: new Date('2020-10-06'), value: 3 },
//   { date: new Date('2020-11-06'), value: 6 },
// ]

const LineChart = ({ data: _data }: Props) => {
  const [data, setData] = useState<Datum[]>([])

  const svgRef = React.useRef(null)

  useEffect(() => {
    setData(_data)

    if (!svgRef.current) return
    if (!data) return

    const x = (d: Datum) => d.date // given d in data, returns the (temporal) x-value
    const y = (d: Datum) => d.value
    const w = 640
    const h = 400
    const margin = { top: 20, right: 30, bottom: 30, left: 40 }
    const width = w - margin.left - margin.right
    const height = h - margin.top - margin.bottom
    const xType = d3.scaleTime
    const yType = d3.scaleLinear
    const xRange = [margin.left, width - margin.right]
    const yRange = [height - margin.bottom, margin.top]
    const yLabel = '↑ Daily close ($)'
    const xLabel = '→ Date'
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
    const defined = (d: Datum, i: number) =>
      X[i] instanceof Date && !isNaN(Y[i])
    const D = d3.map(data, defined)

    // Compute default domains.
    const xDomain = d3.extent(X) as [Date, Date]
    const yDomain = [0, d3.max(Y)] as [number, number]

    // Construct scales and axes.
    const xScale = xType(xDomain, xRange)
    const yScale = yType(yDomain, yRange)
    const xAxis = d3
      .axisBottom<Date>(xScale)
      .ticks(d3.utcMonth.every(2))
      .tickFormat(d3.timeFormat('%b'))
      .tickSizeOuter(0)
    const yAxis = d3.axisLeft(yScale).ticks(height / 40, '~f')

    const line = d3
      .line<number>()
      .defined((d, i) => D[i])
      .curve(curve)
      .x((d, i) => xScale(X[i]))
      .y((d, i) => yScale(Y[i]))

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .attr('style', 'max-width: 100%; height: auto; height: intrinsic;')

    // Add the x-axis.
    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .call((g) =>
        g
          .append('text')
          .attr('x', width - margin.right - 10)
          .attr('y', margin.bottom)
          .attr('fill', 'currentColor')
          .attr('text-anchor', 'start')
          .text(xLabel),
      )

    // Add the y-axis.
    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(yAxis)
      .call((g) => g.select('.domain').remove())
      .call((g) =>
        g
          .selectAll('.tick line')
          .clone()
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

    svg
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', strokeWidth)
      .attr('stroke-linecap', strokeLinecap)
      .attr('stroke-linejoin', strokeLinejoin)
      .attr('stroke-opacity', strokeOpacity)
      .attr('d', line(I))

    return () => {
      svg.selectAll('*').remove()
    }
  }, [_data, data])

  return (
    <>
      <svg ref={svgRef} />
    </>
  )
}

export default LineChart
