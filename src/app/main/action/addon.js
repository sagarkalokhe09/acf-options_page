import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'

import PropTypes from 'prop-types'
import { Modal, Form, Row, Col, Button, Alert, Card } from 'react-bootstrap'
import { ADDON_CONDITIONS, defaultAddon } from '@dhruv-techapps/acf-common'
import { useForm } from 'react-hook-form'

const AddonModal = forwardRef(({ configIndex, setConfigs }, ref) => {
  const { register, handleSubmit, errors, reset, formState: { isDirty } } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: { ...defaultAddon },
    shouldFocusError: true
  })
  const [show, setShow] = useState(false)
  const actionIndex = useRef(-1)

  const onSubmit = data => {
    reset(data)
    setConfigs(configs => configs.map((config, index) => {
      if (index === configIndex) {
        config.actions[actionIndex.current].addon = { ...data }
        return { ...config, ...data }
      }
      return config
    }))
    setShow(false)
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
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Modal.Header closeButton>
        <Modal.Title>Addon</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant="info">Add condition to be checked before executing Action</Alert>
        <Card>
          <Card.Body>
            <Row>
              <Col>
                <Form.Group controlId='addon-element' className="mb-0">
                  <Form.Label>Element Finder <small className="text-danger">*</small></Form.Label>
                  <Form.Control type='text' placeholder='Element' name='element' ref={register({ required: true })} isInvalid={!!errors.element} />
                  <Form.Control.Feedback type='invalid'>{errors.element && 'Element is required'}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId='addon-condition' className='mb-0'>
                  <Form.Label>Condition <small className="text-danger">*</small></Form.Label>
                  <Form.Control as='select' custom ref={register({ required: true })} isInvalid={!!errors.condition} name='condition'>
                    {Object.entries(ADDON_CONDITIONS).map((condition, index) => <option key={index} value={condition[1]}>{condition[0]}</option>)}
                  </Form.Control>
                  <Form.Control.Feedback type='invalid'>{errors.condition && 'Condition is required'}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId='addon-value' className="mb-0">
                  <Form.Label>Value <small className="text-danger">*</small></Form.Label>
                  <Form.Control type='text' placeholder='Value' ref={register({ required: true })} isInvalid={!!errors.value} name='value' />
                  <Form.Control.Feedback type='invalid'>{errors.value && 'Value is required'}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Modal.Body>
      {isDirty && <Modal.Footer>
        <Button type='submit'>Save</Button>
      </Modal.Footer>}
    </Form>
  </Modal>
})

AddonModal.propTypes = {
  configIndex: PropTypes.number.isRequired,
  setConfigs: PropTypes.func.isRequired
}
export default React.memo(AddonModal)
