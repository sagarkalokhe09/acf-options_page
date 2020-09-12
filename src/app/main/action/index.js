import React, { useState, useEffect, useRef } from 'react'
import { Card, Row, Col, Dropdown, Button } from 'react-bootstrap'
import { ReactComponent as FilterRight } from 'bootstrap-icons/icons/filter-right.svg'
import { DropdownToggle } from '../../components/dropdown'
import { LocalStorage } from '@dhruv-techapps/core-common'
import { defaultAction } from '@dhruv-techapps/acf-common'
import ActionTable from './action-table.js'
import PropTypes from 'prop-types'

const HIDDEN_COLUMN_KEY = 'hiddenColumns'
const defaultHiddenColumns = ['name', 'initWait', 'repeat', 'repeatInterval']

const Action = ({ actions, configIndex, setConfigs, addonRef, toastRef }) => {
  const [hiddenColumns, setHiddenColumns] = useState(LocalStorage.getItem(HIDDEN_COLUMN_KEY, defaultHiddenColumns))
  const didMountRef = useRef(true)
  const addAction = () => {
    setConfigs(configs => {
      return configs.map((config, index) => {
        if (index === configIndex) {
          config.actions = [...config.actions]
          config.actions.push({ ...defaultAction })
          return config
        }
        return config
      })
    })
    toastRef.current.push({
      body: 'New action added successfully !',
      header: <strong className='mr-auto'>Action</strong>,
      bodyClass: 'text-success'
    })
  }

  const onColumnChange = (e) => {
    const column = e.currentTarget.getAttribute('data-column')
    const index = hiddenColumns.indexOf(column)
    setHiddenColumns(hiddenColumns => index !== -1 ? hiddenColumns.filter((_column, _index) => _index !== index) : [...hiddenColumns, column])
  }

  useEffect(() => {
    if (didMountRef.current) {
      didMountRef.current = false
      return
    }
    LocalStorage.setItem(HIDDEN_COLUMN_KEY, hiddenColumns)
  }, [hiddenColumns])

  const removeAction = (rowIndex) => {
    setConfigs(configs => configs.map((config, index) => {
      if (index === configIndex) {
        config.actions = [...config.actions]
        config.actions.splice(rowIndex, 1)
        return config
      }
      return config
    }))
  }

  return <Card>
    <Card.Header as='h5'>
      <Row>
        <Col className='d-flex align-items-center'>
          <a target='_blank' rel='noopener noreferrer' href='https://getautoclicker.com/docs/action'>Action</a>
        </Col>
        <Col md='auto' className='d-flex align-items-center'>
          <Button variant='success' onClick={addAction}>Add Action</Button>
          <Dropdown alignRight className='ml-2'>
            <Dropdown.Toggle as={DropdownToggle}>
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
      <ActionTable actions={actions} configIndex={configIndex} setConfigs={setConfigs} removeAction={removeAction} hiddenColumns={hiddenColumns} addonRef={addonRef} />
    </Card.Body>
  </Card>
}
Action.propTypes = {
  actions: ActionTable.propTypes.actions,
  configIndex: PropTypes.number.isRequired,
  setConfigs: PropTypes.func.isRequired,
  addonRef: ActionTable.propTypes.addonRef,
  toastRef: PropTypes.shape({ current: PropTypes.shape({ push: PropTypes.func.isRequired }) }).isRequired
}
export default React.memo(Action)
