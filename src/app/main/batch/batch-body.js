import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button, Card, Col, Form, FormControl, InputGroup, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { REGEX_NUM } from '../../util/regex'
import { numberWithExponential } from '../../util/prop-types'
import { convertNumberField } from '../../util/validation'
import GTAG from '../../gtag'

const NUMBER_FIELDS = ['repeat', 'repeatInterval']
const BatchBody = ({ batch, configIndex, setConfigs }) => {
  const { register, handleSubmit, errors, reset, formState: { isDirty, isValid } } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: batch,
    shouldFocusError: true
  })

  useEffect(() => {
    reset(batch)
  }, [batch, reset])

  const onSubmit = data => {
    convertNumberField(data, NUMBER_FIELDS)
    reset(data)
    setConfigs(configs => configs.map((config, index) => {
      if (index === configIndex) {
        config.batch = { ...config.batch, ...data }
        return config
      }
      return config
    }))
    GTAG.event({ category: 'Batch', action: 'Click', label: 'Save' })
  }

  return <Form onSubmit={handleSubmit(onSubmit)}>
    <Card.Body>
      <Row>
        <Col md='6' sm='12'>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text id='batch-repeat'>repeat</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              name='repeat'
              ref={register({ pattern: REGEX_NUM })}
              isInvalid={!!errors.repeat}
              placeholder='0'
              aria-label='0'
              aria-describedby='batch-repeat'
            />
            <Form.Control.Feedback type='invalid'>{errors.repeat && 'Only valid numbers are allowed'}</Form.Control.Feedback>
          </InputGroup>
        </Col>
        <Col md='6' sm='12'>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text id='batch-repeat-interval'>R-Interval&nbsp;<small className='text-info'>(sec)</small></InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              name='repeatInterval'
              ref={register({ validate: value => !isNaN(value) })}
              isInvalid={!!errors.repeatInterval}
              placeholder='0'
              aria-label='0'
              aria-describedby='batch-repeat-interval'
            />
            <Form.Control.Feedback type='invalid'>{errors.repeatInterval && 'Only valid numbers are allowed'}</Form.Control.Feedback>
          </InputGroup>
        </Col>
      </Row>
      {isDirty && <div className='d-flex justify-content-end mt-2'>
        <Button type='submit' disabled={!isValid}>Save</Button>
      </div>}
    </Card.Body>
  </Form>
}
BatchBody.propTypes = {
  batch: PropTypes.shape({
    repeat: PropTypes.number,
    repeatInterval: numberWithExponential
  }),
  configIndex: PropTypes.number.isRequired,
  setConfigs: PropTypes.func.isRequired
}
export default BatchBody
