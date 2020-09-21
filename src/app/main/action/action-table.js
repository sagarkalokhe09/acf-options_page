import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import './action-table.scss'

import { useTable } from 'react-table'
import { Button, Form, Table } from 'react-bootstrap'

import { ReactComponent as XCircle } from 'bootstrap-icons/icons/x-circle.svg'
import { ReactComponent as CodeSlash } from 'bootstrap-icons/icons/code-slash.svg'

import { EditableCell } from './editable-cell'
import AddonModal from './addon'
import { REGEX_NUM, REGEX_SEC } from '../../util/regex'
import ConfirmModel from '../../components/ConfirmModal'

const ActionTable = ({ actions, configIndex, setConfigs, hiddenColumns, addonRef, didUpdateRef, toastRef }) => {
  const [data, setData] = useState(actions)
  const confirmRef = useRef()

  useEffect(() => {
    if (didMountRef.current) {
      didMountRef.current = false
      return
    }
    setData(actions)
  }, [actions])

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
      dataType: 'number',
      pattern: REGEX_SEC
    }, {
      Header: 'Name',
      style: { width: '90px' },
      accessor: 'name'
    }, {
      Header: 'Element',
      accessor: 'element',
      required: true
    }, {
      Header: 'Value',
      accessor: 'value'
    }, {
      Header: 'Repeat',
      style: { width: '90px' },
      accessor: 'repeat',
      dataType: 'number',
      pattern: REGEX_NUM
    }, {
      Header: 'R-Interval',
      style: { width: '100px' },
      accessor: 'repeatInterval',
      dataType: 'number',
      pattern: REGEX_SEC
    }
  ], [])

  const initialState = { hiddenColumns }

  const updateAction = (rowIndex, columnId, value) => {
    setData(actions => actions.map((action, index) => {
      if (index === rowIndex) {
        return { ...action, [columnId]: value }
      }
      return action
    }))
    didUpdateRef.current = true
  }

  const removeAction = (rowIndex) => {
    setData(actions => actions.filter((_action, index) => index !== rowIndex))
    didUpdateRef.current = true
  }

  const saveActions = (e) => {
    e.preventDefault()
    setConfigs(configs => configs.map((config, index) => {
      if (index === configIndex) {
        config.actions = [...data]
        return config
      }
      return config
    }))
    didUpdateRef.current = false
    toastRef.current.push({
      body: 'Actions saved successfully !',
      header: <strong className='mr-auto'>Actions</strong>,
      bodyClass: 'text-success'
    })
  }

  const removeActionConfirm = (rowIndex) => {
    const name = `#${+rowIndex + 1} - ${data[rowIndex].name || data[rowIndex].element || 'row'}`
    confirmRef.current.confirm({
      title: 'Remove Action',
      message: <p>Are you sure to remove <span className='badge badge-danger'>{name}</span> Action?</p>,
      confirmFunc: removeAction.bind(null, Number(rowIndex))
    })
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

  return <Form onSubmit={saveActions}>
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
              <Button variant='link' className='p-0' onClick={() => { removeActionConfirm(row.id) }} disabled={data.length === 1}>
                <XCircle className={data.length === 1 ? 'text-muted' : 'text-danger'} width='20' height='20' />
              </Button>
            </td>
          </tr>)
        })}
      </tbody>
    </Table>
    {didUpdateRef.current && <div className='d-flex justify-content-end mt-2'>
      <Button type='submit'>Save</Button>
    </div>}
    <ConfirmModel ref={confirmRef} />
  </Form>
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
  didUpdateRef: PropTypes.shape({
    current: PropTypes.shape({
      showAddon: PropTypes.func
    })
  }),
  toastRef: PropTypes.shape({ current: PropTypes.shape({ push: PropTypes.func.isRequired }) }).isRequired,
  addonRef: PropTypes.shape({ current: PropTypes.bool }),
  configIndex: PropTypes.number.isRequired,
  setConfigs: PropTypes.func.isRequired,
  hiddenColumns: PropTypes.arrayOf(PropTypes.string)
}
export default ActionTable
