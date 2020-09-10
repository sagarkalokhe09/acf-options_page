import React, { useState } from 'react'
import { Card, Row, Col, Dropdown, Button } from 'react-bootstrap'
import { ReactComponent as FilterRight } from 'bootstrap-icons/icons/filter-right.svg'
import { DropdownToggle } from '../components/dropdown'
import { defaultAction } from '@dhruv-techapps/acf-common'
import ActionTable from './action/table.js'
import PropTypes from 'prop-types'

const Action = ({ actions, selected, setConfigs, toastRef }) => {
  const [hiddenColumns, setHiddenColumns] = useState({ name: true, initWait: true, repeat: true, repeatInterval: true })

  const addAction = () => {
    setConfigs(configs => configs.map((config, index) => {
      if (index === selected) {
        return { ...configs[selected], actions: [...configs[selected].actions, defaultAction] }
      }
      return config
    }))

    toastRef.current.push({
      body: 'New action added successfully !',
      header: <strong className='mr-auto'>Action</strong>,
      bodyClass: 'text-success'
    })
  }

  const onColumnChange = (e) => {
    const column = e.currentTarget.getAttribute('data-column')
    setHiddenColumns(hiddenColumns => hiddenColumns[column])
  }

  const updateAction = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    console.log(rowIndex, columnId, value)
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
              <Dropdown.Item onClick={onColumnChange} data-column='name'>Name</Dropdown.Item>
              <Dropdown.Item onClick={onColumnChange} data-column='initWait'>Init Wait</Dropdown.Item>
              <Dropdown.Item onClick={onColumnChange} data-column='repeat'>Repeat &amp; R-interval</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
    </Card.Header>
    <Card.Body>
      <ActionTable actions={actions} updateAction={updateAction} hiddenColumns={hiddenColumns} />
    </Card.Body>
  </Card>
}
Action.propTypes = {
  actions: ActionTable.propTypes.actions,
  selected: PropTypes.bool.isRequired,
  setConfigs: PropTypes.func.isRequired,
  toastRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]).isRequired
}
export default Action
