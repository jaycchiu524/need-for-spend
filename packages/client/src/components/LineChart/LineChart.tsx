import React, { useEffect, useMemo, useState } from 'react'

import * as d3 from 'd3'

import { Box } from '@mui/material'

import Tooltip from '@mui/material/Tooltip'

import { motion } from 'framer-motion'

import { format } from 'date-fns'

import useSize from '@/hooks/useSize'

import { Datum, Timespan } from './types'

// import { fakeData, fakeGenerator } from './faker'

interface Props {
  data: Datum[]
  timespan: Timespan
}

const LineChart = ({ data: _data, timespan }: Props) => {
  const { ref, width: _w, height: _h } = useSize()

  const [data, setData] = useState<Datum[]>([])
  const [showCircle, setShowCircle] = useState(false)

  const svgRef = React.useRef(null)

  const x = (d: Datum) => d.date // given d in data, returns the (temporal) x-value
  const yExpense = (d: Datum) => d.expense
  const yIncome = (d: Datum) => d.income
  const w = _w
  const h = _h
  const margin = { top: 15, right: 0, bottom: 5, left: 30 }
  const width = w - margin.left - margin.right
  const height = h - margin.top - margin.bottom
  const xType = d3.scaleUtc
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
  const color2 = 'red'

  // Compute values.
  const X = d3.map(data, x)
  const YExpense = d3.map(data, yExpense)
  const YIncome = d3.map(data, yIncome)
  const I = d3.range(X.length)
  const defined = (d: Datum, i: number) =>
    X[i] instanceof Date && !isNaN(YExpense[i]) && !isNaN(YIncome[i])
  const D = d3.map(data, defined)

  // Compute default domains.
  const xDomain = d3.extent(X) as [Date, Date]

  const yDomain = [
    0,
    Math.max(d3.max(YExpense) || 0, d3.max(YIncome) || 0),
  ] as [number, number]
  const ticks = timespan === Timespan.Daily ? d3.timeDay.every(7) : d3.timeMonth
  const timeFormat = timespan === Timespan.Daily ? '%-d/%-m' : '%b'

  console.log('ticks: ', ticks)

  // Construct scales and axes.
  const xScale = xType(xDomain, xRange)
  const yScale = yType(yDomain, yRange)
  const xAxis = d3
    .axisBottom<Date>(xScale)
    // .ticks(d3.utcMonth.every(1))
    // .tickFormat(d3.timeFormat('%b'))
    .tickSizeOuter(0)
    .ticks(ticks)
    .tickFormat(d3.timeFormat(timeFormat))
  const yAxis = d3.axisLeft(yScale).ticks(height / 20, '~f')

  const Expenseline = d3
    .line<number>()
    .defined((d, i) => D[i])
    .curve(curve)
    .x((d, i) => xScale(X[i]))
    .y((d, i) => yScale(YExpense[i]))

  const Incomeline = d3
    .line<number>()
    .defined((d, i) => D[i])
    .curve(curve)
    .x((d, i) => xScale(X[i]))
    .y((d, i) => yScale(YIncome[i]))

  const svg = d3.select(svgRef.current)
  // .attr('style', `max-width: 100%; height: auto; height: intrinsic;`)
  // useEffect(() => {
  //   if (tab === Categories.Monthly) setData(f1)
  // }, [tab])

  useEffect(() => {
    if (!svgRef.current) return
    setData(_data)
    if (!data.length) return

    // Add the x-axis.
    svg
      .select<SVGGElement>('g.x-axis')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .call((g) =>
        g
          .append('text')
          .attr('x', width - margin.right - 10)
          .attr('y', margin.bottom)
          .attr('fill', 'currentColor')
          .attr('text-anchor', 'start'),
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

    // Add the expense line path.
    svg
      .select('g.line-expense')
      .select<SVGPathElement>('path')
      .attr('fill', 'none')
      .attr('stroke', color2)
      .attr('stroke-width', strokeWidth)
      .attr('stroke-linecap', strokeLinecap)
      .attr('stroke-linejoin', strokeLinejoin)
      .attr('stroke-opacity', strokeOpacity)
      .attr('d', Expenseline(I))
      .transition()
      .duration(1000)
      .attrTween('d', () => {
        return (t: number) => {
          const yInterpolate = (v: number) => d3.interpolate(yRange[0], v)
          Expenseline.y((d, i) => yInterpolate(yScale(YExpense[i]))(t))
          return Expenseline(I) || ''
        }
      })

    // Add the income line path.
    svg
      .select('g.line-income')
      .select<SVGPathElement>('path')
      .attr('fill', 'none')
      .attr('stroke', color)
      .attr('stroke-width', strokeWidth)
      .attr('stroke-linecap', strokeLinecap)
      .attr('stroke-linejoin', strokeLinejoin)
      .attr('stroke-opacity', strokeOpacity)
      .attr('d', Incomeline(I))
      .transition()
      .duration(1000)
      .attrTween('d', () => {
        return (t: number) => {
          const yInterpolate = (v: number) => d3.interpolate(yRange[0], v)
          Incomeline.y((d, i) => yInterpolate(yScale(YIncome[i]))(t))
          return Incomeline(I) || ''
        }
      })

    setShowCircle(true)

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

    // svg
    //   .select('g.dots')
    //   .selectAll('circle')
    //   .data(data)
    //   .join('circle')
    //   .attr('cx', (d) => xScale(x(d)))
    //   .attr('cy', (d) => yScale(y(d)))
    //   .attr('r', 3)
    //   .attr('fill', 'currentColor')
    //   .attr('stroke', 'white')
    //   .attr('stroke-width', 1)
    //   .transition()
    //   .duration(1000)
    // .attrTween('cy', (d) => {
    //   return (t: number) => {
    //     const yInterpolate = (v: number) => d3.interpolate(yRange[0], v)
    //     return String(yInterpolate(yScale(y(d)))(t)) || ''
    //   }
    // })

    return () => {
      setShowCircle(false)
    }
  }, [
    Expenseline,
    I,
    Incomeline,
    YExpense,
    YIncome,
    _data,
    data.length,
    height,
    margin.bottom,
    margin.left,
    margin.right,
    svg,
    width,
    xAxis,
    yAxis,
    yRange,
    yScale,
  ])

  const DotToolTip = ({
    type,
    d,
  }: {
    d: Datum
    type: 'income' | 'expense'
  }) => (
    <Tooltip
      title={`${format(d.date, 'yyyy/MM')} - ${type}: ${d[type]}`}
      placement="right">
      <motion.circle
        initial={{
          r: 3,
          cx: xScale(x(d)),
          fill: 'currentColor',
          cy: yRange[0],
          stroke: 'black',
          strokeWidth: 1,
        }}
        animate={{
          r: 3,
          cx: xScale(x(d)),
          cy: yScale(type === 'expense' ? yExpense(d) : yIncome(d)),
          fill: 'currentColor',
          stroke: 'white',
          strokeWidth: 1,
        }}
        transition={{
          duration: 1,
        }}></motion.circle>
    </Tooltip>
  )

  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        height: '100%',
      }}>
      <Box
        sx={{
          display: 'flex',
          flex: 5,
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
        ref={ref}>
        <svg height="100%" width="100%" ref={svgRef}>
          <g className="x-axis"></g>
          <g className="y-axis"></g>
          <g className="line-expense">
            <path />
          </g>
          <g className="line-income">
            <path />
          </g>
          <g className="dots" height="100%" width="100%">
            {showCircle &&
              data.map((d, i) => {
                return (
                  <DotToolTip key={`${d.date}-expense`} d={d} type="expense" />
                )
              })}
            {showCircle &&
              data.map((d, i) => {
                return (
                  <DotToolTip key={`${d.date}-income`} d={d} type="income" />
                )
              })}
          </g>
        </svg>
      </Box>
    </Box>
  )
}

export default LineChart
