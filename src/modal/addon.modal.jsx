import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'

import PropTypes from 'prop-types'
import { Alert, Button, Card, Col, Form, FormControl, Modal, Row } from 'react-bootstrap'
import { ADDON_CONDITIONS, RECHECK_OPTIONS, defaultAddon } from '@dhruv-techapps/acf-common'
import { useForm } from 'react-hook-form'
import { GTAG, REGEX_NUM, convertNumberField } from '../util'
import { ValueExtractorPopover } from '../popover'

const NUMBER_FIELDS = ['recheck', 'recheckInterval']

const AddonModal = forwardRef(({ configIndex, setConfigs }, ref) => {
  const {
    register,
    handleSubmit,
    errors,
    reset,
    formState: { isDirty, isValid }
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
          <Modal.Title>Addon</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant='info'>Add condition will be checked before executing Action</Alert>
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
                      name='elementFinder'
                      list='elementFinder'
                      ref={register({ required: true })}
                      isInvalid={!!errors.element}
                    />
                    <Form.Label>
                      Element Finder <small className='text-danger'>*</small>
                    </Form.Label>
                    <Form.Control.Feedback type='invalid'>{errors.element && 'Element is required'}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId='addon-condition'>
                    <Form.Control as='select' aria-describedby='addon-condition' custom ref={register({ required: true })} isInvalid={!!errors.condition} name='condition'>
                      {Object.entries(ADDON_CONDITIONS).map((condition, index) => (
                        <option key={index} value={condition[1]}>
                          {condition[0]}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Label>
                      Condition <small className='text-danger'>*</small>
                    </Form.Label>
                    <Form.Control.Feedback type='invalid'>{errors.condition && 'Condition is required'}</Form.Control.Feedback>
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
                      ref={register({ required: true })}
                      isInvalid={!!errors.value}
                      name='value'
                      list='value'
                    />
                    <Form.Label>
                      Value <small className='text-danger'>*</small>
                    </Form.Label>
                    <Form.Control.Feedback type='invalid'>{errors.value && 'Value is required'}</Form.Control.Feedback>
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
                      ref={register()}
                      isInvalid={!!errors.valueExtractor}
                    />
                    <Form.Label>Value Extractor&nbsp;</Form.Label>
                    <ValueExtractorPopover />
                    <Form.Control.Feedback type='invalid'>{errors.valueExtractor && 'Not a valid regex'}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <hr />
              <Row>
                <Col md={6} sm={12}>
                  <Form.Group controlId='addon-recheck'>
                    <FormControl placeholder='0' aria-label='0' name='recheck' aria-describedby='addon-recheck' ref={register({ pattern: REGEX_NUM })} isInvalid={errors.recheck} list='retry' />
                    <Form.Label>Recheck</Form.Label>
                    <Form.Control.Feedback type='invalid'>{errors.recheck && 'Only valid numbers are allowed'}</Form.Control.Feedback>
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
                      ref={register({ validate: value => !Number.isNaN(value) })}
                      isInvalid={errors.recheckInterval}
                    />
                    <Form.Label>
                      Recheck Interval&nbsp;<small className='text-info'>(sec)</small>
                    </Form.Label>
                    <Form.Control.Feedback type='invalid'>{errors.recheckInterval && 'Only valid numbers are allowed'}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col xs={12}>
                  <h6 className='my-2 text-secondary font-weight-light'>
                    <small>* Below are action which can be performed if recheck is not matched by extension after recheck</small>
                  </h6>
                </Col>
                <Col md={4} sm={12}>
                  <Form.Check type='radio' name='recheckOption' id='recheckOptionStop' value={RECHECK_OPTIONS.STOP} ref={register} label='Stop' />
                </Col>
                <Col md={4} sm={12}>
                  <Form.Check type='radio' name='recheckOption' id='recheckOptionSkip' value={RECHECK_OPTIONS.SKIP} ref={register} label='Skip' />
                </Col>
                <Col md={4} sm={12}>
                  <Form.Check type='radio' name='recheckOption' id='recheckOptionReload' value={RECHECK_OPTIONS.RELOAD} ref={register} label='Refresh' />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer className='justify-content-between'>
          <Button type='reset' variant='outline-danger'>
            Clear
          </Button>
          <Button type='submit' variant='outline-primary' disabled={!isValid || !isDirty} className='ml-3'>
            Save
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
