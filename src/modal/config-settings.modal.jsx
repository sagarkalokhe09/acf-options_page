import React, { forwardRef, useImperativeHandle, useState } from 'react'
import PropTypes from 'prop-types'
import { Card, Col, Form, FormControl, Modal, Row } from 'react-bootstrap'
import { LOAD_TYPES, START_TYPES, defaultConfig } from '@dhruv-techapps/acf-common'
import { Trans, useTranslation } from 'react-i18next'

import { HotkeyPopover } from '../popover'
import { getElementProps } from '../util/element'
import { StartTimePopover } from '../popover/start-time.popover'
import { dataLayerInput, dataLayerModel } from '../util/data-layer'

const ConfigSettingsModal = forwardRef(({ config, configIndex, setConfigs }, ref) => {
  const { t } = useTranslation()
  const [show, setShow] = useState(false)
  const [message, setMessage] = useState()
  const [dev, setDev] = useState(false)

  useImperativeHandle(ref, () => ({
    showSettings() {
      setShow(true)
      setDev(localStorage.getItem('DEV'))
    }
  }))

  const handleClose = () => {
    dataLayerModel('config-settings', 'close')
    setShow(false)
  }

  const onKeyDown = e => {
    e.preventDefault()
    let value = ''
    if (e.ctrlKey) {
      value += 'Ctrl + '
    } else if (e.altKey) {
      value += 'Alt + '
    }
    if (e.shiftKey) {
      value += 'Shift + '
    }
    if (value) {
      if (e.keyCode >= 65 && e.keyCode < 91) {
        value += String.fromCharCode(e.keyCode)
        e.currentTarget.value = value
      }
    }
    return false
  }

  const onUpdate = e => {
    const update = getElementProps(e)
    if (update) {
      setConfigs(configs =>
        configs.map((_config, index) => {
          if (index === configIndex) {
            return { ..._config, ...update }
          }
          return _config
        })
      )
      dataLayerInput(update, 'config-settings')
      setMessage(t('modal.configSettings.saveMessage'))
      setTimeout(setMessage, 1500)
    }
  }

  return (
    <Modal show={show} size='lg' onHide={handleClose} onShow={() => dataLayerModel('config-settings', 'open')}>
      <Form>
        <Modal.Header closeButton>
          <Modal.Title as='h6'>{t('modal.configSettings.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card className='mb-3'>
            <Card.Body>
              <Row>
                <Col md={12} sm={12}>
                  {t('modal.configSettings.start')}&nbsp;
                  <Form.Check
                    inline
                    type='radio'
                    id='startAuto'
                    name='startType'
                    value={START_TYPES.AUTO}
                    onChange={onUpdate}
                    checked={config.startType === START_TYPES.AUTO}
                    label={t('modal.configSettings.auto')}
                  />
                  <Form.Check
                    inline
                    type='radio'
                    id='startManual'
                    name='startType'
                    onChange={onUpdate}
                    value={START_TYPES.MANUAL}
                    checked={config.startType === START_TYPES.MANUAL}
                    label={t('modal.configSettings.manual')}
                  />
                  <small>
                    <ul className='mb-0 mt-2'>
                      <li>
                        <Trans i18nKey='modal.configSettings.autoHint' components={{ b: <b /> }} />
                      </li>
                      <li>
                        <Trans i18nKey='modal.configSettings.manualHint' components={{ b: <b /> }} />
                      </li>
                    </ul>
                  </small>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col md={12} sm={12} hidden={config.startType === START_TYPES.AUTO}>
                  <Form.Group controlId='hotkey'>
                    <FormControl placeholder={defaultConfig.hotkey} onKeyDown={onKeyDown} defaultValue={config.hotkey} name='hotkey' onBlur={onUpdate} pattern='HOT_KEY' />
                    <Form.Label>{t('modal.configSettings.hotkey')}</Form.Label>
                    <HotkeyPopover />
                  </Form.Group>
                </Col>
                <Col md={12} sm={12} hidden={config.startType === START_TYPES.MANUAL}>
                  {t('modal.configSettings.extensionLoad')}&nbsp;
                  <Form.Check
                    inline
                    type='radio'
                    id='loadTypeWindow'
                    value={LOAD_TYPES.WINDOW}
                    onChange={onUpdate}
                    checked={config.loadType === LOAD_TYPES.WINDOW}
                    name='loadType'
                    label={t('modal.configSettings.window')}
                  />
                  <Form.Check
                    inline
                    type='radio'
                    id='loadTypeDocument'
                    value={LOAD_TYPES.DOCUMENT}
                    onChange={onUpdate}
                    checked={config.loadType === LOAD_TYPES.DOCUMENT}
                    name='loadType'
                    label={t('modal.configSettings.document')}
                  />
                  <small>
                    <ul className='mb-0 mt-2'>
                      <li>
                        <Trans i18nKey='modal.configSettings.windowHint' components={{ b: <b /> }} />
                      </li>
                      <li>
                        <Trans i18nKey='modal.configSettings.documentHint' components={{ b: <b /> }} />
                      </li>
                    </ul>
                  </small>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Card className='mb-2'>
            <Card.Body>
              <Row>
                <Col md='12' sm='12'>
                  {dev ? (
                    <Form.Group controlId='config-start-time'>
                      <FormControl name='startTime' pattern='START_TIME' autoComplete='off' defaultValue={config.startTime} onBlur={onUpdate} placeholder='HH:mm:ss:fff' list='start-time' />
                      <Form.Label>{t('configuration.startTime')}&nbsp;</Form.Label>
                      <StartTimePopover />
                      <Form.Control.Feedback type='invalid'>{t('error.startTime')}</Form.Control.Feedback>
                    </Form.Group>
                  ) : (
                    <>
                      <b className='me-2'>Start Time :</b>
                      <Trans i18nKey='popover.startTime.content'>
                        Try
                        <a href='https://scheduleurl.com/docs/1.0/getting-started/download/' target='_blank' rel='noopener noreferrer'>
                          Schedule URL
                        </a>
                        our new browser extension.
                        <br /> it&apos;s used to schedule webpage / URL at particular day and time.
                      </Trans>
                    </>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Modal.Body>
        {message && (
          <Modal.Footer>
            <span className='text-success'>{message}</span>
          </Modal.Footer>
        )}
      </Form>
    </Modal>
  )
})

ConfigSettingsModal.propTypes = {
  configIndex: PropTypes.number.isRequired,
  config: PropTypes.shape({
    startType: PropTypes.string,
    hotkey: PropTypes.string,
    loadType: PropTypes.string,
    startTime: PropTypes.string
  }).isRequired,
  setConfigs: PropTypes.func.isRequired
}
ConfigSettingsModal.displayName = 'ConfigSettingsModal'
const memo = React.memo(ConfigSettingsModal)
export { memo as ConfigSettingsModal }
