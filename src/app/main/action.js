import React, { useState, useCallback } from 'react'
import { Card, Row, Col, Dropdown, Button } from 'react-bootstrap'
import { ReactComponent as FilterRight } from 'bootstrap-icons/icons/filter-right.svg'
import { DropdownToggle } from '../components/dropdown'
import { LocalStorage } from "@dhruv-techapps/core-common"
import ActionTable from './action/table.js'
import PropTypes from 'prop-types'


const HIDDEN_COLUMN_KEY = 'hiddenColumns';
const defaultHiddenColumns = ['name', 'initWait', 'repeat', 'repeatInterval'];

const Action = ({ actions, selected, setConfigs, toastRef }) => {
  const [hiddenColumns, setHiddenColumns] = useState(LocalStorage.getItem(HIDDEN_COLUMN_KEY, defaultHiddenColumns))

  console.log('Action', JSON.stringify(actions), selected, JSON.stringify(toastRef), hiddenColumns)

  const addAction = () => {
    console.log('action add')
    setConfigs(configs => {
      console.log(configs)
      return configs.map((config, index) => {
        console.log(config, index, selected)

        return config
      })
    })
    console.log('action added')
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

  useCallback(() => {
    LocalStorage.setItem(HIDDEN_COLUMN_KEY, hiddenColumns)
  }, [hiddenColumns])

  const updateAction = (rowIndex, columnId, value) => {
    setConfigs(configs => configs.map((config, index) => {
      if (index === selected) {
        let _config = { ...config };
        _config.actions[rowIndex][columnId] = value;
        return _config;
      }
      return config
    }))
  }

  const removeAction = (rowIndex) => {
    setConfigs(configs => configs.map((config, index) => {
      if (index === selected) {
        let _config = { ...config };
        _config.actions.splice(rowIndex, 1);
        return _config;
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
      <ActionTable actions={actions} updateAction={updateAction} removeAction={removeAction} hiddenColumns={hiddenColumns} />
    </Card.Body>
  </Card>
}
Action.propTypes = {
  actions: ActionTable.propTypes.actions,
  selected: PropTypes.number.isRequired,
  setConfigs: PropTypes.func.isRequired,
  toastRef: PropTypes.shape({ current: PropTypes.shape({ push: PropTypes.func.isRequired }) }).isRequired
}
export default React.memo(Action)
