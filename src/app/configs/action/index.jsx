import React, { useEffect, useRef, useState } from 'react'
import { Button, Card, Col, Dropdown, Row } from 'react-bootstrap'
import { LocalStorage } from '@dhruv-techapps/core-common'
import PropTypes from 'prop-types'
import ActionTable from './action-table'
import { DropdownToggle } from '../../../components'
import { FilterRight, GTAG, numberWithExponential } from '../../../util'

const HIDDEN_COLUMN_KEY = 'hiddenColumns'
const defaultHiddenColumns = ['name', 'initWait', 'repeat', 'repeatInterval']

const Action = props => {
  const [hiddenColumns, setHiddenColumns] = useState(LocalStorage.getItem(HIDDEN_COLUMN_KEY, defaultHiddenColumns))
  const actionTableRef = useRef()
  const didMountRef = useRef(true)

  const onColumnChange = e => {
    const column = e.currentTarget.getAttribute('data-column')
    const columnIndex = hiddenColumns.indexOf(column)
    setHiddenColumns(prevHiddenColumns => (columnIndex !== -1 ? prevHiddenColumns.filter((_, prevColumnIndex) => prevColumnIndex !== columnIndex) : [...prevHiddenColumns, column]))
    GTAG.event({ category: 'Action', action: 'Change', label: column, value: columnIndex !== -1 ? 1 : 0 })
  }

  const addAction = () => {
    actionTableRef.current.addAction()
    GTAG.event({ category: 'Action', action: 'Click', label: 'Add' })
  }

  useEffect(() => {
    if (didMountRef.current) {
      didMountRef.current = false
      return
    }
    LocalStorage.setItem(HIDDEN_COLUMN_KEY, hiddenColumns)
  }, [hiddenColumns])

  return (
    <Card>
      <Card.Header as='h5'>
        <Row>
          <Col className='d-flex align-items-center'>
            <small>Action</small>
          </Col>
          <Col md='auto' className='d-flex align-items-center'>
            <Button variant='outline-success' onClick={addAction}>
              Add Action
            </Button>
            <Dropdown alignRight className='ml-2'>
              <Dropdown.Toggle as={DropdownToggle} id='action-dropdown'>
                <FilterRight width='28' height='28' />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={onColumnChange} data-column='name' active={hiddenColumns.indexOf('name') === -1}>
                  Name
                </Dropdown.Item>
                <Dropdown.Item onClick={onColumnChange} data-column='initWait' active={hiddenColumns.indexOf('initWait') === -1}>
                  Init Wait
                </Dropdown.Item>
                <Dropdown.Item onClick={onColumnChange} data-column='repeat' active={hiddenColumns.indexOf('repeat') === -1}>
                  Repeat
                </Dropdown.Item>
                <Dropdown.Item onClick={onColumnChange} data-column='repeatInterval' active={hiddenColumns.indexOf('repeatInterval') === -1}>
                  R-interval
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body className='p-0'>
        <ActionTable ref={actionTableRef} {...props} hiddenColumns={hiddenColumns} />
      </Card.Body>
    </Card>
  )
}
Action.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      elementFinder: PropTypes.string.isRequired,
      initWait: PropTypes.number,
      name: PropTypes.string,
      value: PropTypes.string,
      repeat: PropTypes.number,
      repeatInterval: numberWithExponential
    }).isRequired
  ).isRequired,
  configIndex: PropTypes.number.isRequired,
  setConfigs: PropTypes.func.isRequired,
  addonRef: PropTypes.shape({ current: PropTypes.shape({ showAddon: PropTypes.func.isRequired }) }).isRequired,
  actionSettingsRef: PropTypes.shape({ current: PropTypes.shape({ showSettings: PropTypes.func.isRequired }) }).isRequired,
  toastRef: PropTypes.shape({ current: PropTypes.shape({ push: PropTypes.func.isRequired }) }).isRequired,
  configEnable: PropTypes.bool.isRequired
}
export default React.memo(Action)
