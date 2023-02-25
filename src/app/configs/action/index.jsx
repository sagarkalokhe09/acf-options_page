import React, { useEffect, useRef, useState } from 'react'
import { Button, Card, Col, Dropdown, Row } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { LocalStorage } from '../../../_helpers'
import ActionTable from './action-table'
import { DropdownToggle } from '../../../components'
import { Filter, numberWithExponential } from '../../../util'

const HIDDEN_COLUMN_KEY = 'hiddenColumns'
const defaultHiddenColumns = ['name', 'initWait', 'repeat', 'repeatInterval']

function Action(props) {
  const { t } = useTranslation()
  const [hiddenColumns, setHiddenColumns] = useState(LocalStorage.getItem(HIDDEN_COLUMN_KEY, defaultHiddenColumns))
  const actionTableRef = useRef()
  const didMountRef = useRef(true)
  const [message, setMessage] = useState()
  const [error, setError] = useState()

  const onColumnChange = e => {
    const column = e.currentTarget.getAttribute('data-column')
    const columnIndex = hiddenColumns.indexOf(column)
    setHiddenColumns(prevHiddenColumns => (columnIndex !== -1 ? prevHiddenColumns.filter((_, prevColumnIndex) => prevColumnIndex !== columnIndex) : [...prevHiddenColumns, column]))
  }

  const addAction = () => {
    actionTableRef.current.addAction()
  }

  useEffect(() => {
    if (didMountRef.current) {
      didMountRef.current = false
      return
    }
    LocalStorage.setItem(HIDDEN_COLUMN_KEY, hiddenColumns)
  }, [hiddenColumns])

  return (
    <Card className='mt-3'>
      <Card.Header as='h6'>
        <Row>
          <Col className='d-flex align-items-center'>
            {t('action.title')}
            <small className='text-success ms-3'>{message}</small>
            <small className='text-danger ms-3'>{error}</small>
          </Col>
          <Col xs='auto' className='d-flex align-items-center'>
            <Button variant='outline-primary px-4' onClick={addAction} id='add-action'>
              {t('action.add')}
            </Button>
            <Dropdown className='ml-2' id='acton-column-filter'>
              <Dropdown.Toggle as={DropdownToggle} id='action-dropdown' className='pe-0' ariaLabel='Filter Action Column'>
                <Filter width='28' height='28' />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={onColumnChange} data-column='name' active={hiddenColumns.indexOf('name') === -1}>
                  {t('action.name')}
                </Dropdown.Item>
                <Dropdown.Item onClick={onColumnChange} data-column='initWait' active={hiddenColumns.indexOf('initWait') === -1}>
                  {t('action.initWait')}
                </Dropdown.Item>
                <Dropdown.Item onClick={onColumnChange} data-column='repeat' active={hiddenColumns.indexOf('repeat') === -1}>
                  {t('action.repeat')}
                </Dropdown.Item>
                <Dropdown.Item onClick={onColumnChange} data-column='repeatInterval' active={hiddenColumns.indexOf('repeatInterval') === -1}>
                  {t('action.repeatInterval')}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body className='p-0'>
        <ActionTable ref={actionTableRef} {...props} hiddenColumns={hiddenColumns} setMessage={setMessage} setError={setError} />
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
