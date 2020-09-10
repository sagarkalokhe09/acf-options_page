import React from 'react'
import PropTypes from 'prop-types'

import './table.scss'

import { useTable } from 'react-table'
import { Table } from 'react-bootstrap'

import { ReactComponent as XCircle } from 'bootstrap-icons/icons/x-circle.svg'
import { ReactComponent as CodeSlash } from 'bootstrap-icons/icons/code-slash.svg'

import { EditableCell } from './editable-cell'

const ActionTable = ({ actions, updateAction, hiddenColumns }) => {
  const data = React.useMemo(() => actions, [actions])

  // Set our editable cell renderer as the default Cell renderer
  const defaultColumn = {
    Cell: EditableCell
  }

  const columns = React.useMemo(() => [
    {
      Header: 'Init Wait',
      style: { width: '90px' },
      accessor: 'initWait' // accessor is the "key" in the data
    }, {
      Header: 'Name',
      style: { width: '90px' },
      accessor: 'name'
    }, {
      Header: 'Element',
      accessor: 'element'
    }, {
      Header: 'Value',
      accessor: 'value'
    }, {
      Header: 'Repeat',
      style: { width: '90px' },
      accessor: 'repeat'
    }, {
      Header: 'R-Interval',
      style: { width: '100px' },
      accessor: 'repeatInterval'
    }
  ], [])

  const initialState = { hiddenColumns: ['name'] }

  const tableInstance = useTable({ columns, data, defaultColumn, initialState, updateAction })

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = tableInstance

  return <>
    <Table hover {...getTableProps()} id='actions'>
      <thead>
        {headerGroups.map((headerGroup, index) => (
          <tr {...headerGroup.getHeaderGroupProps()} key={index}>
            {headerGroup.headers.map((column, index) => (
              <th {...column.getHeaderProps([{ style: column.style }])} key={index}>
                {column.render('Header')}
              </th>
            ))}
            <th style={{ width: '80px' }} />
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, index) => {
          prepareRow(row)
          return (<tr {...row.getRowProps()} key={index}>
            {row.cells.map((cell, index) => (
              <td {...cell.getCellProps()} key={index}>
                {cell.render('Cell')}
              </td>
            ))}
            <td align='center'>
              <CodeSlash className='text-primary mr-3' width='20' height='20' onClick={() => { console.log(row.id) }} />
              <XCircle className='text-danger' width='20' height='20' onClick={() => { console.log(row.id) }} />
            </td>
          </tr>)
        })}
      </tbody>
    </Table>
  </>
}

ActionTable.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape({
    element: PropTypes.string.isRequired,
    initWait: PropTypes.number,
    name: PropTypes.string,
    value: PropTypes.string,
    repeat: PropTypes.number,
    repeatInterval: PropTypes.number
  }).isRequired).isRequired,
  updateAction: PropTypes.func.isRequired,
  hiddenColumns: PropTypes.object
}
export default ActionTable
