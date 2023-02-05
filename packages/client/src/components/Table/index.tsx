import React, { useMemo } from 'react'
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from '@tanstack/react-table'

import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'

import { Transaction } from '@/api/types'

function TransactionsTable({ transactions }: { transactions: Transaction[] }) {
  // Table by react-table
  // https://react-table.tanstack.com/docs/overview
  const columnHelper = createColumnHelper<Transaction>()
  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: (row) => <div>{row.getValue()}</div>,
      }),
      columnHelper.accessor('amount', {
        header: 'Amount',
        cell: (row) => <div>{row.getValue()}</div>,
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
  })

  return (
    <>
      <Table color="white" sx={{ marginY: 2 }}>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
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
