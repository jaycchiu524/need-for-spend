import React, { useMemo } from 'react'
import {
  createColumnHelper,
  getCoreRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  sortingFns,
  getSortedRowModel,
  FilterFn,
  SortingFn,
  // ColumnDef,
  useReactTable,
  flexRender,
} from '@tanstack/react-table'
import {
  RankingInfo,
  rankItem,
  compareItems,
} from '@tanstack/match-sorter-utils'

import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material'

import InputAdornment from '@mui/material/InputAdornment'

import SearchIcon from '@mui/icons-material/Search'

import styled from '@emotion/styled'

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'

import { Transaction } from '@/api/types'

import DebouncedInput from './DebouncedInput'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

const HeaderCell = styled.div<{ canSort: boolean }>`
  display: flex;
  align-items: center;
  cursor: ${({ canSort }) => (canSort ? 'pointer' : 'default')};
`

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank,
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId].itemRank,
      rowB.columnFiltersMeta[columnId].itemRank,
    )
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}

function TransactionsTable({ transactions }: { transactions: Transaction[] }) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [globalFilter, setGlobalFilter] = React.useState<string | number>('')

  console.log(transactions)

  // Table by react-table
  // https://react-table.tanstack.com/docs/overview
  const columnHelper = createColumnHelper<Transaction>()
  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: (row) => <div>{row.getValue()}</div>,
        filterFn: 'fuzzy',
        sortingFn: fuzzySort,
      }),
      columnHelper.accessor('isoCurrencyCode', {
        header: 'Currency',
        cell: (row) => <div>{row.getValue()}</div>,
        enableColumnFilter: false,
        enableGlobalFilter: true,
        enableSorting: false,
      }),
      columnHelper.accessor('amount', {
        header: `Amount`,
        cell: (row) => {
          //
          const _amount = -row.getValue()
          // prepend a + if the amount is positive
          const displayAmount = _amount > 0 ? `+${_amount}` : _amount
          return (
            <div
              style={{
                color: _amount > 0 ? 'green' : 'red',
              }}>
              {displayAmount}
            </div>
          )
        },
      }),
      columnHelper.accessor('date', {
        header: 'Date',
        cell: (row) => <div>{row.getValue()}</div>,
      }),
    ],
    [columnHelper],
  )

  const table = useReactTable({
    data: transactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: fuzzyFilter,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  })

  return (
    <>
      <Stack mt={2} minWidth={200} maxWidth={300}>
        <DebouncedInput
          placeholder="Search..."
          variant="outlined"
          size="small"
          value={globalFilter ?? ''}
          onChange={(v) => setGlobalFilter(v)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Stack>
      <Table color="white" sx={{ marginY: 2 }}>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell key={header.id}>
                  {header.isPlaceholder ? null : (
                    <>
                      <HeaderCell
                        canSort={header.column.getCanSort()}
                        {...{
                          onClick: header.column.getToggleSortingHandler(),
                        }}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: <ArrowDropDownIcon />,
                          desc: <ArrowDropUpIcon />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </HeaderCell>
                      {/* {header.column.getCanFilter() ? (
                        <div>
                          <FilterCell column={header.column} table={table} />
                        </div>
                      ) : null} */}
                    </>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default TransactionsTable
