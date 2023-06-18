import React, { memo, useEffect, useMemo, useState } from 'react'

import * as d3 from 'd3'

import {
  Box,
  Checkbox as MuiCheckbox,
  CheckboxProps,
  FormControlLabel,
  FormGroup,
} from '@mui/material'

import Tooltip from '@mui/material/Tooltip'

import { motion } from 'framer-motion'

import { format } from 'date-fns'

import useSize from '@/hooks/useSize'

import { LineDatum, Timespan } from './types'

interface Props {
  data: LineDatum[]
  timespan: Timespan
}

type DotToopTipProps = {
  d: LineDatum
  type: 'income' | 'expense'
  title?: string
}

const CheckBox = ({
  boxColor,
  label,
  ...props
}: {
  boxColor: string
  label: string
} & CheckboxProps) => (
  <FormControlLabel
    control={
      <MuiCheckbox
        {...props}
        sx={{
          color: boxColor,
          '&.Mui-checked': {
            color: boxColor,
          },
        }}
      />
    }
    label={label}
  />
)

const LineChart = memo(({ data: _data, timespan }: Props) => {
  const { ref, width: _w, height: _h } = useSize()

  const [data, setData] = useState<LineDatum[]>([])
  const [showCircle, setShowCircle] = useState(false)
  const [showIncome, setShowIncome] = useState(true)
  const [showExpense, setShowExpense] = useState(true)

  const svgRef = React.useRef(null)

  const x = (d: LineDatum) => d.date // given d in data, returns the (temporal) x-value
  const yExpense = showExpense
    ? (d: LineDatum) => d.expense
    : (d: LineDatum) => 0
  const yIncome = showIncome ? (d: LineDatum) => d.income : (d: LineDatum) => 0
  const w = _w
  const h = _h
  const margin = { top: 25, right: 0, bottom: 5, left: 30 }
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
  const defined = (d: LineDatum, i: number) =>
    X[i] instanceof Date && !isNaN(YExpense[i]) && !isNaN(YIncome[i])
  const D = d3.map(data, defined)

  // Compute default domains.
  const xDomain = d3.extent(X) as [Date, Date]
  const yMax = Math.max(d3.max(YExpense) || 0, d3.max(YIncome) || 0)
  const yDomain = [0, yMax] as [number, number]
  const ticks = timespan === Timespan.Daily ? d3.timeDay.every(2) : d3.timeMonth
  const timeFormat = timespan === Timespan.Daily ? '%-d/%-m' : '%b'

  // Construct scales and axes.
  // nice() rounds the domain to the nearest round number.
  const xScale = xType(xDomain, xRange).nice()
  const yScale = yType(yDomain, yRange).nice()
  const xAxis = d3
    .axisBottom<Date>(xScale)
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
          .select('.x-axis-label')
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
          .select('.y-axis-label')
          .attr('x', -margin.left)
          .attr('y', 10)
          .attr('fill', 'currentColor')
          .attr('text-anchor', 'start')
          .text(yLabel),
      )
      .transition()
      .duration(500)
  }, [
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
  ])

  useEffect(() => {
    if (!svgRef.current) return
    if (showExpense) {
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
        .ease(d3.easeLinear)
        .duration(500)
        .attrTween('d', () => {
          return (t: number) => {
            const yInterpolate = (v: number) => d3.interpolate(yRange[0], v)
            Expenseline.y((d, i) => yInterpolate(yScale(YExpense[i]))(t))
            return Expenseline(I) || ''
          }
        })
    }

    if (showIncome) {
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
        .ease(d3.easeLinear)
        .duration(500)
        .attrTween('d', () => {
          return (t: number) => {
            const yInterpolate = (v: number) => d3.interpolate(yRange[0], v)
            Incomeline.y((d, i) => yInterpolate(yScale(YIncome[i]))(t))
            return Incomeline(I) || ''
          }
        })
    }
    setShowCircle(true)

    return () => {
      setShowCircle(false)
    }
  }, [
    Expenseline,
    I,
    Incomeline,
    YExpense,
    YIncome,
    showExpense,
    showIncome,
    svg,
    yRange,
    yScale,
  ])

  const DotToolTip = ({ type, d, title }: DotToopTipProps) => (
    <Tooltip
      title={
        title
          ? title
          : timespan === Timespan.Daily
          ? `${format(d.date, 'dd MMM yy')}-${type}: $${d[type].toFixed(2)}`
          : `${format(d.date, 'MMM yy')}-${type}: $${d[type].toFixed(2)}`
      }
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
          duration: 0.5,
          ease: 'linear',
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
          <g className="x-axis">
            <text className="x-axis-label"></text>
          </g>
          <g className="y-axis">
            <text className="y-axis-label"></text>
          </g>
          {showExpense && (
            <g className="line-expense">
              <path />
            </g>
          )}
          {showIncome && (
            <g className="line-income">
              <path />
            </g>
          )}
          <g className="dots" height="100%" width="100%">
            {showCircle &&
              showExpense &&
              data.map((d) => {
                return (
                  <DotToolTip key={`${d.date}-expense`} d={d} type="expense" />
                )
              })}
            {showCircle &&
              showIncome &&
              data.map((d) => {
                return (
                  <DotToolTip key={`${d.date}-income`} d={d} type="income" />
                )
              })}
          </g>
        </svg>
      </Box>
      <Box>
        <FormGroup row={true}>
          <CheckBox
            boxColor={color}
            label="Income"
            checked={showIncome}
            onChange={(e, v) => {
              setShowIncome(v)
            }}
          />
          <CheckBox
            boxColor={color2}
            label="Expense"
            checked={showExpense}
            onChange={(e, v) => {
              setShowExpense(v)
            }}
          />
        </FormGroup>
      </Box>
    </Box>
  )
})

export default LineChart
