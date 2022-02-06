import React, { useContext, useEffect, useRef, useState } from 'react'
import { Button, Card, Col, Dropdown, Row } from 'react-bootstrap'
import { LocalStorage } from '@dhruv-techapps/core-common'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import ActionTable from './action-table'
import { DropdownToggle } from '../../../components'
import { FunnelFill, GTAG, numberWithExponential } from '../../../util'
import { ThemeContext } from '../../../_providers/ThemeProvider'

const HIDDEN_COLUMN_KEY = 'hiddenColumns'
const defaultHiddenColumns = ['name', 'initWait', 'repeat', 'repeatInterval']

function Action(props) {
  const { theme } = useContext(ThemeContext)
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
    <Card bg={theme} text={theme === 'light' ? 'dark' : 'white'}>
      <Card.Header as='h6'>
        <Row>
          <Col className='d-flex align-items-center'>
            {t('action.title')}
            <small className='text-success ms-3'>{message}</small>
            <small className='text-danger ms-3'>{error}</small>
          </Col>
          <Col xs='auto' className='d-flex align-items-center'>
            <Button variant='outline-primary px-4' onClick={addAction}>
              {t('action.add')}
            </Button>
            <Dropdown className='ml-2'>
              <Dropdown.Toggle as={DropdownToggle} id='action-dropdown'>
                <FunnelFill width='28' height='28' fill='rgba(0, 0, 0, 0.55)' />
              </Dropdown.Toggle>
              <Dropdown.Menu variant={theme}>
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
