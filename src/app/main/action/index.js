import React, { useState, useEffect, useRef } from 'react'
import { Card, Row, Col, Dropdown, Button } from 'react-bootstrap'
import { ReactComponent as FilterRight } from 'bootstrap-icons/icons/filter-right.svg'
import { DropdownToggle } from '../../components/DropdownToggle'
import { LocalStorage } from '@dhruv-techapps/core-common'
import ActionTable from './action-table.js'
import PropTypes from 'prop-types'
import GTAG from '../../gtag'

const HIDDEN_COLUMN_KEY = 'hiddenColumns'
const defaultHiddenColumns = ['name', 'initWait', 'repeat', 'repeatInterval']

const Action = (props) => {
  const [hiddenColumns, setHiddenColumns] = useState(LocalStorage.getItem(HIDDEN_COLUMN_KEY, defaultHiddenColumns))
  const actionTableRef = useRef()
  const didMountRef = useRef(true)

  const onColumnChange = (e) => {
    const column = e.currentTarget.getAttribute('data-column')
    const index = hiddenColumns.indexOf(column)
    setHiddenColumns(hiddenColumns => index !== -1 ? hiddenColumns.filter((_column, _index) => _index !== index) : [...hiddenColumns, column])
    GTAG.event({ category: 'Action', action: 'Change', label: column, value: index !== -1 ? 1 : 0 })
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

  return <Card>
    <Card.Header as='h5'>
      <Row>
        <Col className='d-flex align-items-center'>
          <a target='_blank' rel='noopener noreferrer' href={process.env.REACT_APP_DOCS + 'action'}>Action</a>
        </Col>
        <Col md='auto' className='d-flex align-items-center'>
          <Button variant='success' onClick={addAction}>Add Action</Button>
          <Dropdown alignRight className='ml-2'>
            <Dropdown.Toggle as={DropdownToggle} id="action-dropdown">
              <FilterRight width='28' height='28' />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={onColumnChange} data-column='name' active={hiddenColumns.indexOf('name') === -1}>Name</Dropdown.Item>
              <Dropdown.Item onClick={onColumnChange} data-column='initWait' active={hiddenColumns.indexOf('initWait') === -1}>Init Wait</Dropdown.Item>
              <Dropdown.Item onClick={onColumnChange} data-column='repeat' active={hiddenColumns.indexOf('repeat') === -1}>Repeat</Dropdown.Item>
              <Dropdown.Item onClick={onColumnChange} data-column='repeatInterval' active={hiddenColumns.indexOf('repeatInterval') === -1}>R-interval</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
    </Card.Header>
    <Card.Body>
      <ActionTable ref={actionTableRef} {...props} hiddenColumns={hiddenColumns} />
    </Card.Body>
  </Card>
}
Action.propTypes = {
  actions: ActionTable.propTypes.actions,
  configIndex: PropTypes.number.isRequired,
  setConfigs: PropTypes.func.isRequired,
  addonRef: ActionTable.propTypes.addonRef,
  actionSettingsRef: ActionTable.propTypes.actionSettingsRef,
  toastRef: ActionTable.propTypes.toastRef,
  configEnable: PropTypes.bool
}
export default React.memo(Action)
