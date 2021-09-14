import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button, Card, Col, Form, FormControl, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { GTAG, REGEX_FLOAT, REGEX_NUM, convertNumberField, numberWithExponential } from '../../../util'

const NUMBER_FIELDS = ['repeat', 'repeatInterval']
const BatchBody = ({ batch, configIndex, setConfigs }) => {
  const { t } = useTranslation()
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
    convertNumberField(data, NUMBER_FIELDS)
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
              <Form.Label>{t('batch.repeat')}</Form.Label>
              <Form.Control.Feedback type='invalid'>{errors.repeat && t('error.repeat')}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md='6' sm='12'>
            <Form.Group controlId='batch-repeat-interval'>
              <FormControl
                name='repeatInterval'
                ref={register({ pattern: REGEX_FLOAT })}
                isInvalid={!!errors.repeatInterval}
                placeholder='0'
                aria-label='0'
                list='interval'
                aria-describedby='batch-repeat-interval'
              />
              <Form.Label>
                {t('batch.repeatInterval')}&nbsp;<small className='text-info'>({t('common.sec')})</small>
              </Form.Label>
              <Form.Control.Feedback type='invalid'>{errors.repeatInterval && t('error.interval')}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        {isDirty && (
          <div className='d-flex justify-content-end mt-2'>
            <Button type='submit' variant='outline-primary' disabled={!isValid}>
              {t('common.save')}
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
