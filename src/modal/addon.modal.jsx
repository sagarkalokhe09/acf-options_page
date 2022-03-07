import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react'

import PropTypes from 'prop-types'
import { Button, Card, Col, Form, Modal, Row } from 'react-bootstrap'
import { ADDON_CONDITIONS, defaultAddon } from '@dhruv-techapps/acf-common'
import { useTranslation } from 'react-i18next'
import { GTAG } from '../util'
import { ValueExtractorPopover } from '../popover'
import { AddonRecheck } from './addon/recheck'
import { getElementProps, updateForm } from '../util/element'
import { ModeContext } from '../_providers'

const FORM_ID = 'addon'

const AddonModal = forwardRef(({ configIndex, setConfigs }, ref) => {
  const { t } = useTranslation()
  const { mode } = useContext(ModeContext)
  const [show, setShow] = useState(false)
  const [addon, setAddon] = useState(defaultAddon)
  const [message, setMessage] = useState()
  const actionIndex = useRef(-1)
  const updateRef = useRef(false)

  const onUpdate = e => {
    const update = getElementProps(e)
    if (update) {
      updateRef.current = true
      setAddon(_addon => ({ ..._addon, ...update }))
    }
  }

  const handleClose = () => {
    setShow(false)
    GTAG.event({ category: 'Addon', action: 'Click', label: 'Close' })
  }

  useEffect(() => {
    if (updateRef.current) {
      updateRef.current = false
      setConfigs(configs =>
        configs.map((config, index) => {
          if (index === configIndex) {
            if (!config.actions[actionIndex.current]) {
              config.actions[actionIndex.current] = {}
            }
            config.actions[actionIndex.current].addon = { ...addon }
            return { ...config }
          }
          return config
        })
      )
      setMessage(t('modal.addon.saveMessage'))
      setTimeout(setMessage, 1500)
    }
  }, [addon])

  useEffect(() => {
    if (actionIndex.current !== -1) {
      updateForm(FORM_ID, addon)
    }
  }, [actionIndex.current])

  const onReset = () => {
    updateRef.current = true
    setAddon({})
    handleClose()
  }

  useImperativeHandle(ref, () => ({
    showAddon(index, _addon) {
      setAddon({ ..._addon })
      actionIndex.current = index
      setShow(true)
      GTAG.modalview({ title: 'Addon', url: window.location.href, path: '/addon' })
    }
  }))

  return (
    <Modal show={show} size='lg' onHide={handleClose}>
      <Form id={FORM_ID}>
        <Modal.Header closeButton>
          <Modal.Title as='h6'>{t('modal.addon.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className='text-muted'>{t('modal.addon.info')}</p>
          <Card>
            <Card.Body>
              <Row className='mb-3'>
                <Col md={6} sm={12}>
                  <Form.Group controlId='addon-element'>
                    <Form.Control type='text' placeholder='Element Finder' defaultValue={addon.elementFinder} onBlur={onUpdate} list='elementFinder' name='elementFinder' required />
                    <Form.Label>
                      {t('modal.addon.elementFinder')} <small className='text-danger'>*</small>
                    </Form.Label>
                    <Form.Control.Feedback type='invalid'>{t('error.elementFinder')}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6} sm={12}>
                  <Form.Group controlId='addon-condition'>
                    <Form.Select value={addon.condition} onChange={onUpdate} name='condition' required>
                      {Object.entries(ADDON_CONDITIONS).map((condition, index) => (
                        <option key={index} value={condition[1]}>
                          {condition[0]}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Label>
                      {t('modal.addon.condition')} <small className='text-danger'>*</small>
                    </Form.Label>
                    <Form.Control.Feedback type='invalid'>{t('error.condition')}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md sm={12}>
                  <Form.Group controlId='addon-value'>
                    <Form.Control type='text' placeholder='Value' defaultValue={addon.value} onBlur={onUpdate} name='value' required list='value' />
                    <Form.Label>
                      {t('modal.addon.value')} <small className='text-danger'>*</small>
                    </Form.Label>
                    <Form.Control.Feedback type='invalid'>{t('error.value')}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                {mode === 'pro' && (
                  <Col md sm={12}>
                    <Form.Group controlId='addon-value-extractor'>
                      <Form.Control type='text' placeholder='Value Extractor' defaultValue={addon.valueExtractor} name='valueExtractor' list='valueExtractor' onBlur={onUpdate} />
                      <Form.Label>{t('modal.addon.valueExtractor')}</Form.Label>
                      <ValueExtractorPopover />
                      <Form.Control.Feedback type='invalid'>{t('error.valueExtractor')}</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                )}
              </Row>
              <div hidden={!(addon.elementFinder && addon.condition && addon.value)}>
                <hr />
                <AddonRecheck addon={addon} onUpdate={onUpdate} />
              </div>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer className='justify-content-between'>
          <Button variant='outline-primary px-5' onClick={onReset}>
            {t('common.clear')}
          </Button>
          <span className='text-success'>{message}</span>
        </Modal.Footer>
      </Form>
    </Modal>
  )
})

AddonModal.propTypes = {
  configIndex: PropTypes.number.isRequired,
  setConfigs: PropTypes.func.isRequired
}
AddonModal.displayName = 'AddonModal'
const memo = React.memo(AddonModal)
export { memo as AddonModal }
