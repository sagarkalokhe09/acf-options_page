import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import './action-table.scss'

import { useTable } from 'react-table'
import { Table } from 'react-bootstrap'

import { ReactComponent as XCircle } from 'bootstrap-icons/icons/x-circle.svg'
import { ReactComponent as CodeSlash } from 'bootstrap-icons/icons/code-slash.svg'

import { EditableCell } from './editable-cell'
import AddonModal from './addon'

const ActionTable = ({ actions, configIndex, setConfigs, removeAction, hiddenColumns, addonRef }) => {
  console.log('ActionTable', hiddenColumns)
  const data = React.useMemo(() => actions, [actions])
  const didMountRef = useRef(true)
  // Set our editable cell renderer as the default Cell renderer
  const defaultColumn = {
    Cell: EditableCell
  }

  const columns = React.useMemo(() => [
    {
      Header: 'Init Wait',
      style: { width: '90px' },
      accessor: 'initWait',
      dataType: 'number'
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
      accessor: 'repeat',
      dataType: 'number'
    }, {
      Header: 'R-Interval',
      style: { width: '100px' },
      accessor: 'repeatInterval',
      dataType: 'number'
    }
  ], [])

  const initialState = { hiddenColumns }

  const updateAction = (rowIndex, columnId, value) => {
    setConfigs(configs => configs.map((config, index) => {
      if (index === configIndex) {
        config.actions = [...config.actions]
        config.actions[rowIndex][columnId] = value
        return config
      }
      return config
    }))
  }

  const tableInstance = useTable({ columns, data, defaultColumn, initialState, updateAction })

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, setHiddenColumns } = tableInstance

  useEffect(() => {
    if (didMountRef.current) {
      didMountRef.current = false
      return
    }
    setHiddenColumns(hiddenColumns)
  }, [hiddenColumns, setHiddenColumns])

  const showAddon = (row) => {
    addonRef.current.showAddon(row.id, row.original.addon)
  }

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
              <CodeSlash className='text-primary mr-3' width='20' height='20' onClick={() => showAddon(row)} />
              <XCircle className={actions.length === 1 ? 'text-muted' : 'text-danger'} width='20' height='20' onClick={() => { removeAction(row.id) }} disabled={actions.length === 1} />
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
    repeatInterval: PropTypes.number,
    addon: AddonModal.type.propTypes.addon
  }).isRequired).isRequired,
  addonRef: PropTypes.shape({
    current: PropTypes.shape({
      showAddon: PropTypes.func
    })
  }),
  configIndex: PropTypes.number.isRequired,
  setConfigs: PropTypes.func.isRequired,
  removeAction: PropTypes.func.isRequired,
  hiddenColumns: PropTypes.arrayOf(PropTypes.string)
}
export default React.memo(ActionTable)
