import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'

import PropTypes from 'prop-types'
import { Modal, Form, Row, Col, Button, Alert, Card, InputGroup, FormControl } from 'react-bootstrap'
import { ADDON_CONDITIONS, defaultAddon, RECHECK_OPTIONS } from '@dhruv-techapps/acf-common'
import { useForm } from 'react-hook-form'
import { REGEX_NUM } from '../../util/regex'
import { ValueExtractorPopover } from '../../popover/value-extractor.popover'
import { convertNumberField } from '../../util/validation'

const NUMBER_FIELDS = ['recheck', 'recheckInterval']

const AddonModal = forwardRef(({ configIndex, setConfigs }, ref) => {
  const { register, handleSubmit, errors, reset, formState: { isDirty, isValid } } = useForm({
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
    setConfigs(configs => configs.map((config, index) => {
      if (index === configIndex) {
        if (!config.actions[actionIndex.current]) {
          config.actions[actionIndex.current] = {}
        }
        config.actions[actionIndex.current].addon = { ...data }
        return { ...config }
      }
      return config
    }))
    setShow(false)
  }

  const onReset = () => {
    reset({})
    setConfigs(configs => configs.map((config, index) => {
      if (index === configIndex && config.actions[actionIndex.current]) {
        delete config.actions[actionIndex.current].addon
        return { ...config }
      }
      return config
    }))
  }

  useImperativeHandle(ref, () => ({
    showAddon (index, addon) {
      actionIndex.current = index
      reset({ ...addon })
      setShow(true)
    }
  }))

  const handleClose = () => { setShow(false) }

  return <Modal show={show} size='lg' onHide={handleClose}>
    <Form onSubmit={handleSubmit(onSubmit)} onReset={onReset}>
      <Modal.Header closeButton>
        <Modal.Title>Addon</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant="info">Add condition will be checked before executing Action</Alert>
        <Card>
          <Card.Body>
            <Row className="mb-2">
              <Col>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text id='addon-element'>Element Finder <small className="text-danger">*</small></InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control type='text' placeholder='Element Finder' aria-label='Element Finder' aria-describedby='addon-element' name='elementFinder' ref={register({ required: true })} isInvalid={!!errors.element} />
                  <Form.Control.Feedback type='invalid'>{errors.element && 'Element is required'}</Form.Control.Feedback>
                </InputGroup>
              </Col>
              <Col>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text id='addon-condition'>Condition <small className="text-danger">*</small></InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control as='select' aria-describedby='addon-condition' custom ref={register({ required: true })} isInvalid={!!errors.condition} name='condition'>
                    {Object.entries(ADDON_CONDITIONS).map((condition, index) => <option key={index} value={condition[1]}>{condition[0]}</option>)}
                  </Form.Control>
                  <Form.Control.Feedback type='invalid'>{errors.condition && 'Condition is required'}</Form.Control.Feedback>
                </InputGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text id='addon-value'>Value <small className="text-danger">*</small></InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control type='text' placeholder='Value' aria-label='Value' aria-describedby='addon-value' ref={register({ required: true })} isInvalid={!!errors.value} name='value' />
                  <Form.Control.Feedback type='invalid'>{errors.value && 'Value is required'}</Form.Control.Feedback>
                </InputGroup>
              </Col>
              <Col>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text id='addon-value-extractor'>Value Extractor&nbsp;<ValueExtractorPopover/></InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control type='text' placeholder='Value Extractor' aria-label='Value Extractor' name='valueExtractor' aria-describedby='addon-value-extractor' ref={register()} isInvalid={!!errors.valueExtractor} />
                  <Form.Control.Feedback type='invalid'>{errors.valueExtractor && 'Not a valid regex'}</Form.Control.Feedback>
                </InputGroup>
              </Col>
            </Row>
            <hr/>
            <Row>
              <Col md={6} sm={12}>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text id='addon-recheck'>Recheck</InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    placeholder='0' aria-label='0' name='recheck' aria-describedby='addon-recheck'
                    ref={register({ pattern: REGEX_NUM })}
                    isInvalid={errors.recheck}
                  />
                  <Form.Control.Feedback type='invalid'>{errors.recheck && 'Only valid numbers are allowed'}</Form.Control.Feedback>
                </InputGroup>
              </Col>
              <Col md={6} sm={12}>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text id='addon-recheck-interval'>Recheck Interval&nbsp;<small className='text-info'>(sec)</small></InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    placeholder='0' aria-label='0' id='addon-recheckInterval' name='recheckInterval' aria-describedby='recheck-interval'
                    ref={register({ validate: value => !isNaN(value) })}
                    isInvalid={errors.recheckInterval}
                  />
                  <Form.Control.Feedback type='invalid'>{errors.recheckInterval && 'Only valid numbers are allowed'}</Form.Control.Feedback>
                </InputGroup>
              </Col>
              <Col xs={12}>
                <h6 className='my-2 text-secondary font-weight-light'><small>* Below are action which can be performed if recheck is not matched by extension after recheck</small></h6>
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
      <Modal.Footer>
        <Button type='reset' variant="danger">Clear</Button>
        <Button type='submit' disabled={!isValid || !isDirty} className="ml-3">Save</Button>
      </Modal.Footer>
    </Form>
  </Modal>
})

AddonModal.propTypes = {
  configIndex: PropTypes.number.isRequired,
  setConfigs: PropTypes.func.isRequired
}
export default React.memo(AddonModal)
