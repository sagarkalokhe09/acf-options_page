import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'

import PropTypes from 'prop-types'
import { Alert, Button, Card, Col, Form, FormControl, Modal, Row } from 'react-bootstrap'
import { ADDON_CONDITIONS, RECHECK_OPTIONS, defaultAddon } from '@dhruv-techapps/acf-common'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { GTAG, REGEX_NUM, convertNumberField } from '../util'
import { ValueExtractorPopover } from '../popover'

const NUMBER_FIELDS = ['recheck', 'recheckInterval']

const AddonModal = forwardRef(({ configIndex, setConfigs }, ref) => {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid }
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: { ...defaultAddon },
    shouldFocusError: true
  })
  const [show, setShow] = useState(false)
  const actionIndex = useRef(-1)

  const onSubmit = data => {
    convertNumberField(data, NUMBER_FIELDS)
    reset(data)
    setConfigs(configs =>
      configs.map((config, index) => {
        if (index === configIndex) {
          if (!config.actions[actionIndex.current]) {
            config.actions[actionIndex.current] = {}
          }
          config.actions[actionIndex.current].addon = { ...data }
          return { ...config }
        }
        return config
      })
    )
    setShow(false)
    GTAG.event({ category: 'Addon', action: 'Click', label: 'Save' })
  }

  const onReset = () => {
    reset({})
    setConfigs(configs =>
      configs.map((config, index) => {
        if (index === configIndex && config.actions[actionIndex.current]) {
          delete config.actions[actionIndex.current].addon
          return { ...config }
        }
        return config
      })
    )
    GTAG.event({ category: 'Addon', action: 'Click', label: 'Reset' })
  }

  useImperativeHandle(ref, () => ({
    showAddon(index, addon) {
      GTAG.modalview({ title: 'Addon', url: window.location.href, path: '/addon' })
      actionIndex.current = index
      reset({ ...addon })
      setShow(true)
    }
  }))

  const handleClose = () => {
    setShow(false)
    GTAG.event({ category: 'Addon', action: 'Click', label: 'Close' })
  }

  return (
    <Modal show={show} size='lg' onHide={handleClose}>
      <Form onSubmit={handleSubmit(onSubmit)} onReset={onReset}>
        <Modal.Header closeButton>
          <Modal.Title>{t('modal.addon.title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant='info'>{t('modal.addon.info')}</Alert>
          <Card>
            <Card.Body>
              <Row className='mb-2'>
                <Col>
                  <Form.Group controlId='addon-element'>
                    <Form.Control
                      type='text'
                      placeholder='Element Finder'
                      aria-label='Element Finder'
                      aria-describedby='addon-element'
                      list='elementFinder'
                      {...register('elementFinder', { required: true })}
                      isInvalid={!!errors.element}
                    />
                    <Form.Label>
                      {t('modal.addon.elementFinder')} <small className='text-danger'>*</small>
                    </Form.Label>
                    <Form.Control.Feedback type='invalid'>{errors.element && t('modal.addon.elementFinder.error')}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId='addon-condition'>
                    <Form.Control as='select' aria-describedby='addon-condition' custom {...register('condition', { required: true })} isInvalid={!!errors.condition}>
                      {Object.entries(ADDON_CONDITIONS).map((condition, index) => (
                        <option key={index} value={condition[1]}>
                          {condition[0]}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Label>
                      {t('modal.addon.condition')} <small className='text-danger'>*</small>
                    </Form.Label>
                    <Form.Control.Feedback type='invalid'>{errors.condition && t('modal.addon.condition.error')}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group controlId='addon-value'>
                    <Form.Control
                      type='text'
                      placeholder='Value'
                      aria-label='Value'
                      aria-describedby='addon-value'
                      {...register('value', { required: true })}
                      isInvalid={!!errors.value}
                      list='value'
                    />
                    <Form.Label>
                      {t('modal.addon.value')} <small className='text-danger'>*</small>
                    </Form.Label>
                    <Form.Control.Feedback type='invalid'>{errors.value && t('modal.addon.value.error')}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId='addon-value-extractor'>
                    <Form.Control
                      type='text'
                      placeholder='Value Extractor'
                      aria-label='Value Extractor'
                      name='valueExtractor'
                      aria-describedby='addon-value-extractor'
                      list='valueExtractor'
                      {...register('valueExtractor')}
                      isInvalid={!!errors.valueExtractor}
                    />
                    <Form.Label>{t('modal.addon.valueExtractor')}&nbsp;</Form.Label>
                    <ValueExtractorPopover />
                    <Form.Control.Feedback type='invalid'>{errors.valueExtractor && t('modal.addon.valueExtractor.error')}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col md={6} sm={12}>
                  <Form.Group controlId='addon-recheck'>
                    <FormControl placeholder='0' aria-label='0' aria-describedby='addon-recheck' {...register('recheck', { pattern: REGEX_NUM })} isInvalid={errors.recheck} list='retry' />
                    <Form.Label>{t('modal.addon.recheck.title')}</Form.Label>
                    <Form.Control.Feedback type='invalid'>{errors.recheck && t('modal.addon.recheck.error')}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6} sm={12}>
                  <Form.Group controlId='addon-recheck-interval'>
                    <FormControl
                      placeholder='0'
                      aria-label='0'
                      name='recheckInterval'
                      aria-describedby='recheck-interval'
                      list='interval'
                      {...register('recheckInterval', { validate: value => !Number.isNaN(value) })}
                      isInvalid={errors.recheckInterval}
                    />
                    <Form.Label>
                      {t('modal.addon.recheck.interval')}&nbsp;<small className='text-info'>({t('common.sec')})</small>
                    </Form.Label>
                    <Form.Control.Feedback type='invalid'>{errors.recheckInterval && t('modal.addon.recheck.intervalError')}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <h6 className='my-2 text-secondary font-weight-light'>
                    <small>{t('modal.addon.recheck.hint')}</small>
                  </h6>
                </Col>
                <Col md={4} sm={12}>
                  <Form.Check type='radio' id='recheckOptionStop' value={RECHECK_OPTIONS.STOP} {...register('recheckOption')} label={t('modal.addon.recheck.stop')} />
                </Col>
                <Col md={4} sm={12}>
                  <Form.Check type='radio' id='recheckOptionSkip' value={RECHECK_OPTIONS.SKIP} {...register('recheckOption')} label={t('modal.addon.recheck.skip')} />
                </Col>
                <Col md={4} sm={12}>
                  <Form.Check type='radio' id='recheckOptionReload' value={RECHECK_OPTIONS.RELOAD} {...register('recheckOption')} label={t('modal.addon.recheck.refresh')} />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer className='justify-content-between'>
          <Button type='reset' variant='outline-danger'>
            {t('common.clear')}
          </Button>
          <Button type='submit' variant='outline-primary' disabled={!isValid || !isDirty} className='ml-3'>
            {t('common.save')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
})

AddonModal.propTypes = {
  configIndex: PropTypes.number.isRequired,
  setConfigs: PropTypes.func.isRequired
}
const memo = React.memo(AddonModal)
export { memo as AddonModal }
