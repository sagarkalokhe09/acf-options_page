import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useTable } from 'react-table'
import { Button, Dropdown, Form, Table } from 'react-bootstrap'
import { defaultAction } from '@dhruv-techapps/acf-common'
import { EditableCell } from './editable-cell'
import { CaretDown, CaretUp, GTAG, REGEX_NUM, ThreeDots, numberWithExponential } from '../../../util'
import { AddonModal, ConfirmModal } from '../../../modal'
import { ElementFinderPopover, ValuePopover } from '../../../popover'
import { DropdownToggle } from '../../../components'

const ActionTable = forwardRef(({ actions, configIndex, setConfigs, hiddenColumns, addonRef, toastRef, actionSettingsRef }, ref) => {
  const [data, setData] = useState(actions)
  const [error, setError] = useState()
  const confirmRef = useRef()
  const didMountRef = useRef(true)
  const didUpdateRef = useRef(false)

  useImperativeHandle(ref, () => ({
    addAction() {
      setData([...data, { ...defaultAction, focus: true }])
      didUpdateRef.current = true
    }
  }))

  useEffect(() => {
    if (didMountRef.current) {
      didMountRef.current = false
      return
    }
    setData(actions)
  }, [actions])

  // Set our editable cell renderer as the default Cell renderer
  const defaultColumn = {
    Cell: EditableCell
  }

  const columns = React.useMemo(
    () => [
      {
        Header: 'Init Wait',
        style: { width: '80px' },
        accessor: 'initWait',
        dataType: 'number',
        list: 'interval',
        validate: value => !Number.isNaN(value)
      },
      {
        Header: 'Name',
        style: { width: '10%' },
        accessor: 'name'
      },
      {
        Header: 'Element Finder',
        accessor: 'elementFinder',
        list: 'elementFinder',
        required: true
      },
      {
        Header: 'Value',
        list: 'value',
        accessor: 'value'
      },
      {
        Header: 'Repeat',
        style: { width: '70px' },
        accessor: 'repeat',
        dataType: 'number',
        list: 'repeat',
        pattern: REGEX_NUM
      },
      {
        Header: 'R-Interval',
        style: { width: '90px' },
        accessor: 'repeatInterval',
        dataType: 'number',
        list: 'interval',
        validate: value => !Number.isNaN(value)
      }
    ],
    []
  )

  const initialState = { hiddenColumns }

  const updateAction = (rowIndex, columnId, value) => {
    setData(prevActions =>
      prevActions.map((action, index) => {
        if (index === rowIndex) {
          return { ...action, [columnId]: value }
        }
        return action
      })
    )
    didUpdateRef.current = true
  }

  const removeAction = rowIndex => {
    setData(prevActions => prevActions.filter((_, index) => index !== rowIndex))
    didUpdateRef.current = true
    GTAG.event({ category: 'Action', action: 'Click', label: 'Remove' })
  }

  const validateActions = () => {
    let isValid = true
    data.forEach((action, index) => {
      document.querySelector(`#actions tbody tr:nth-child(${index + 1}) input[name=elementFinder]`).classList.remove('is-invalid')
      if (!action.elementFinder) {
        document.querySelector(`#actions tbody tr:nth-child(${index + 1}) input[name=elementFinder]`).classList.add('is-invalid')
        isValid = false
      }
    })
    return isValid
  }

  const saveActions = e => {
    e.preventDefault()
    setError()
    if (validateActions()) {
      setConfigs(configs =>
        configs.map((config, index) => {
          if (index === configIndex) {
            config.actions = [...data]
            return config
          }
          return config
        })
      )
      didUpdateRef.current = false
      toastRef.current.push({
        body: (
          <p>
            <span className='badge badge-success'>actions</span> saved successfully !
          </p>
        ),
        header: <strong className='mr-auto'>Actions</strong>
      })
    } else {
      setError('Element Finder cant be empty')
    }
    GTAG.event({ category: 'Action', action: 'Click', label: 'Save' })
  }

  const removeActionConfirm = rowIndex => {
    const name = `#${+rowIndex + 1} - ${data[rowIndex].name || data[rowIndex].elementFinder || 'row'}`
    confirmRef.current.confirm({
      title: 'Remove Action',
      message: (
        <p>
          Are you sure to remove <span className='text-danger'>{name}</span> Action?
        </p>
      ),
      confirmFunc: removeAction.bind(null, Number(rowIndex))
    })
    GTAG.event({ category: 'Action', action: 'Click', label: 'Remove Confirmation' })
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

  const showAddon = row => {
    GTAG.event({ category: 'Action', action: 'Click', label: 'Show Addon' })
    addonRef.current.showAddon(row.id, row.original.addon)
  }

  const showSettings = row => {
    GTAG.event({ category: 'Action', action: 'Click', label: 'Show Settings' })
    actionSettingsRef.current.showSettings(row.id, row.original.settings)
  }

  const arrayMove = (arr, oldIndex, newIndex) => {
    if (newIndex >= arr.length) {
      let k = newIndex - arr.length + 1
      k -= 1
      while (k) {
        arr.push(undefined)
      }
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0])
    return arr // for testing
  }

  const moveUp = (e, rowId) => {
    if (e.currentTarget.getAttribute('disabled') === null) {
      setData(prevActions => [...arrayMove(prevActions, +rowId, rowId - 1)])
      didUpdateRef.current = true
      GTAG.event({ category: 'Action', action: 'Move', label: 'Up' })
    }
  }
  const moveDown = (e, rowId) => {
    if (e.currentTarget.getAttribute('disabled') === null) {
      setData(prevActions => [...arrayMove(prevActions, +rowId, +rowId + 1)])
      didUpdateRef.current = true
      GTAG.event({ category: 'Action', action: 'Move', label: 'Down' })
    }
  }
  return (
    <Form onSubmit={saveActions}>
      <Table {...getTableProps()} id='actions' bordered>
        <thead>
          {headerGroups.map((headerGroup, headerGroupIndex) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroupIndex}>
              <th style={{ width: '30px' }}>&nbsp;</th>
              {headerGroup.headers.map((column, headerIndex) => (
                <th {...column.getHeaderProps([{ style: column.style }])} key={headerIndex}>
                  {column.render('Header')} {column.required && <small className='text-danger'>*</small>}
                  {column.Header === 'Element Finder' && <ElementFinderPopover />}
                  {column.Header === 'Value' && <ValuePopover />}
                </th>
              ))}
              <th style={{ width: '54px' }}>&nbsp;</th>
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, index) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()} key={index} className={actions[index] ? '' : 'border border-warning'}>
                <td align='center'>
                  <div className='d-flex flex-column align-items-center'>
                    <CaretUp width='20' height='20' onClick={e => moveUp(e, row.id)} disabled={index === 0} />
                    <CaretDown width='20' height='20' onClick={e => moveDown(e, row.id)} disabled={index === rows.length - 1} />
                  </div>
                </td>
                {row.cells.map((cell, cellIndex) => (
                  <td {...cell.getCellProps()} key={cellIndex}>
                    {cell.render('Cell')}
                  </td>
                ))}
                <td align='center'>
                  {actions[row.id] && (
                    <Dropdown alignRight>
                      <Dropdown.Toggle as={DropdownToggle} id='dropdown-basic'>
                        <ThreeDots width='24' height='24' />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => showAddon(row)}>Addon</Dropdown.Item>
                        <Dropdown.Item onClick={() => showSettings(row)}>Settings</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item
                          onClick={() => {
                            removeActionConfirm(row.id)
                          }}
                          className={data.length === 1 ? 'text-muted' : 'text-danger'}
                          disabled={data.length === 1}>
                          Remove Action
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
      {didUpdateRef.current && (
        <div className='d-flex justify-content-end align-items-center my-2 px-2'>
          <span className='text-danger mr-3'>{error}</span>
          <Button type='submit' variant='outline-primary'>
            Save
          </Button>
        </div>
      )}
      <ConfirmModal ref={confirmRef} />
    </Form>
  )
})

ActionTable.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      elementFinder: PropTypes.string.isRequired,
      initWait: PropTypes.number,
      name: PropTypes.string,
      value: PropTypes.string,
      repeat: PropTypes.number,
      repeatInterval: numberWithExponential,
      addon: AddonModal.type.propTypes.addon
    }).isRequired
  ).isRequired,
  toastRef: PropTypes.shape({ current: PropTypes.shape({ push: PropTypes.func.isRequired }) }).isRequired,
  addonRef: PropTypes.shape({ current: PropTypes.shape({ showAddon: PropTypes.func.isRequired }) }).isRequired,
  actionSettingsRef: PropTypes.shape({ current: PropTypes.shape({ showSettings: PropTypes.func.isRequired }) }).isRequired,
  configIndex: PropTypes.number.isRequired,
  setConfigs: PropTypes.func.isRequired,
  hiddenColumns: PropTypes.arrayOf(PropTypes.string).isRequired
}
export default ActionTable
