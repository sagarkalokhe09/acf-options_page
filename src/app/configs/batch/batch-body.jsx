import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button, Card, Col, Form, FormControl, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { GTAG, REGEX_NUM, convertNumberField, numberWithExponential } from '../../../util'

const NUMBER_FIELDS = ['repeat', 'repeatInterval']
const BatchBody = ({ batch, configIndex, setConfigs }) => {
  const {
    register,
    handleSubmit,
    errors,
    reset,
    formState: { isDirty, isValid }
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: batch,
    shouldFocusError: true
  })

  useEffect(() => {
    reset(batch)
  }, [batch, reset])

  const onSubmit = data => {
    console.log(data)
    convertNumberField(data, NUMBER_FIELDS)
    console.log(data)
    reset(data)
    setConfigs(configs =>
      configs.map((config, index) => {
        if (index === configIndex) {
          config.batch = { ...config.batch, ...data }
          return config
        }
        return config
      })
    )
    GTAG.event({ category: 'Batch', action: 'Click', label: 'Save' })
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Card.Body>
        <Row>
          <Col md='6' sm='12'>
            <Form.Group controlId='batch-repeat'>
              <FormControl name='repeat' ref={register({ pattern: REGEX_NUM })} isInvalid={!!errors.repeat} placeholder='0' aria-label='0' aria-describedby='batch-repeat' list='repeat' />
              <Form.Label>Repeat</Form.Label>
              <Form.Control.Feedback type='invalid'>{errors.repeat && 'Only valid numbers are allowed'}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md='6' sm='12'>
            <Form.Group controlId='batch-repeat-interval'>
              <FormControl
                name='repeatInterval'
                ref={register({ validate: value => !Number.isNaN(value) })}
                isInvalid={!!errors.repeatInterval}
                placeholder='0'
                aria-label='0'
                list='interval'
                aria-describedby='batch-repeat-interval'
              />
              <Form.Label>
                R-Interval&nbsp;<small className='text-info'>(sec)</small>
              </Form.Label>
              <Form.Control.Feedback type='invalid'>{errors.repeatInterval && 'Only valid numbers are allowed'}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        {isDirty && (
          <div className='d-flex justify-content-end mt-2'>
            <Button type='submit' variant='outline-primary' disabled={!isValid}>
              Save
            </Button>
          </div>
        )}
      </Card.Body>
    </Form>
  )
}
BatchBody.propTypes = {
  batch: PropTypes.shape({
    repeat: PropTypes.number,
    repeatInterval: numberWithExponential
  }).isRequired,
  configIndex: PropTypes.number.isRequired,
  setConfigs: PropTypes.func.isRequired
}
export default BatchBody
