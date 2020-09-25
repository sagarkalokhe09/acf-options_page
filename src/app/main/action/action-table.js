import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import './action-table.scss'

import { useTable } from 'react-table'
import { Button, Form, Table } from 'react-bootstrap'

import { ReactComponent as XCircle } from 'bootstrap-icons/icons/x-circle.svg'
import { ReactComponent as CodeSlash } from 'bootstrap-icons/icons/code-slash.svg'
import { ReactComponent as CaretUp } from 'bootstrap-icons/icons/caret-up.svg'
import { ReactComponent as CaretDown } from 'bootstrap-icons/icons/caret-down.svg'

import { EditableCell } from './editable-cell'
import AddonModal from './addon'
import { REGEX_NUM, REGEX_SEC } from '../../util/regex'
import ConfirmModel from '../../components/ConfirmModal'
import { ElementFinderPopover } from '../../popover/element-finder.popover'
import { ValuePopover } from '../../popover/value.popover'

const ActionTable = ({ actions, configIndex, setConfigs, hiddenColumns, addonRef, didUpdateRef, toastRef }) => {
  const [data, setData] = useState(actions)
  const [error, setError] = useState()
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
      Header: 'Element Finder',
      accessor: 'elementFinder',
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
    setError()
    if (_validateActions()) {
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
    } else {
      setError('Actions elementFinder cant be empty')
    }
  }

  const _validateActions = () => {
    let isValid = true
    data.forEach(action => {
      if (!action.elementFinder) {
        if (!action.errors) {
          action.errors = []
        }
        action.errors.push('elementFinder')
        isValid = false
      }
    })
    return isValid
  }

  const removeActionConfirm = (rowIndex) => {
    const name = `#${+rowIndex + 1} - ${data[rowIndex].name || data[rowIndex].elementFinder || 'row'}`
    confirmRef.current.confirm({
      title: 'Remove Action',
      message: <p>Are you sure to remove <span className='codecode-danger'>{name}</span> Action?</p>,
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

  const _arrayMove = (arr, oldIndex, newIndex) => {
    if (newIndex >= arr.length) {
      var k = newIndex - arr.length + 1
      while (k--) {
        arr.push(undefined)
      }
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0])
    return arr // for testing
  }

  const moveUp = (e, rowId) => {
    if (e.currentTarget.getAttribute('disabled') === null) {
      setData(actions => [..._arrayMove(actions, +rowId, rowId - 1)])
      didUpdateRef.current = true
    }
  }
  const moveDown = (e, rowId) => {
    if (e.currentTarget.getAttribute('disabled') === null) {
      setData(actions => [..._arrayMove(actions, +rowId, +rowId + 1)])
      didUpdateRef.current = true
    }
  }

  return <Form onSubmit={saveActions}>
    <Table hover {...getTableProps()} id='actions' borderless>
      <thead>
        {headerGroups.map((headerGroup, index) => (
          <tr {...headerGroup.getHeaderGroupProps()} key={index}>
            <th style={{ width: '30px' }} />
            {headerGroup.headers.map((column, index) => (
              <th {...column.getHeaderProps([{ style: column.style }])} key={index}>
                {column.render('Header')} {column.required && <small className="text-danger">*</small>}
                {column.Header === 'Element Finder' && <ElementFinderPopover/>}
                {column.Header === 'Value' && <ValuePopover/>}
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
            <td align='center'>
              <div className='d-flex flex-column align-items-center'>
                <CaretUp width='20' height='20' onClick={(e) => moveUp(e, row.id)} disabled={index === 0}/>
                <CaretDown width='20' height='20' onClick={(e) => moveDown(e, row.id)} disabled={index === rows.length - 1}/>
              </div>
            </td>
            {row.cells.map((cell, index) => (
              <td {...cell.getCellProps()} key={index}>
                {cell.render('Cell')}
              </td>
            ))}
            <td align='center'>
              <CodeSlash className='text-primary mr-3' width='20' height='20' onClick={() => showAddon(row)} />
              <Button variant='link' className='p-0' onClick={() => { removeActionConfirm(row.id) }} disabled={data.length === 1}>
                <XCircle className={'x-circle ' + (data.length === 1 ? 'text-muted' : 'text-danger')} width='20' height='20' />
              </Button>
            </td>
          </tr>)
        })}
      </tbody>
    </Table>
    {didUpdateRef.current && <div className='d-flex justify-content-end align-items-center mt-2'>
      <span className="text-danger mr-3">{error}</span>
      <Button type='submit'>Save</Button>
    </div>}
    <ConfirmModel ref={confirmRef} />
  </Form>
}

ActionTable.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape({
    elementFinder: PropTypes.string.isRequired,
    initWait: PropTypes.number,
    name: PropTypes.string,
    value: PropTypes.string,
    repeat: PropTypes.number,
    repeatInterval: PropTypes.number,
    addon: AddonModal.type.propTypes.addon
  }).isRequired).isRequired,
  didUpdateRef: PropTypes.shape({
    current: PropTypes.bool
  }),
  toastRef: PropTypes.shape({ current: PropTypes.shape({ push: PropTypes.func.isRequired }) }).isRequired,
  addonRef: PropTypes.shape({ current: PropTypes.shape({ showAddon: PropTypes.func.isRequired }) }).isRequired,
  configIndex: PropTypes.number.isRequired,
  setConfigs: PropTypes.func.isRequired,
  hiddenColumns: PropTypes.arrayOf(PropTypes.string)
}
export default ActionTable
