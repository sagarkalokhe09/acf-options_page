import React, { useContext, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Button, Card, Col, Form, FormControl, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { GTAG, REGEX_START_TIME, numberWithExponential, convertNumberField, REGEX_INTERVAL } from '../../../util'
import { StartTimePopover } from '../../../popover'
import { ThemeContext } from '../../../_providers/ThemeProvider'

const ConfigBody = ({ config, configIndex, setConfigs }) => {
  const { theme } = useContext(ThemeContext)
  const { t } = useTranslation()
  const didMountRef = useRef(true)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid }
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: config,
    shouldFocusError: true
  })

  useEffect(() => {
    if (didMountRef.current) {
      didMountRef.current = false
      return
    }
    reset(config)
  }, [config, reset])

  const onSubmit = data => {
    convertNumberField(data)
    reset(data)
    setConfigs(prevConfigs =>
      prevConfigs.map((prevConfig, index) => {
        if (index === configIndex) {
          return { ...prevConfig, ...data }
        }
        return prevConfig
      })
    )
    GTAG.event({ category: 'Action', action: 'Click', label: 'Save' })
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Card.Body bg={theme.toLowerCase()} text={theme.toLowerCase() === 'light' ? 'dark' : 'white'}>
        <Row>
          <Col md='12' sm='12' className='mb-3'>
            <Form.Group controlId='config-url'>
              <FormControl
                {...register('url', { required: true })}
                autoComplete='off'
                isInvalid={!!errors.url}
                placeholder={process.env.BASE}
                aria-label={process.env.BASE}
                aria-describedby='config-url'
              />
              <Form.Label>
                {t('configuration.url')}&nbsp;<small className='text-danger'>*</small>
              </Form.Label>
              <Form.Control.Feedback type='invalid'>{errors.url && t('error.url')}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md='4' sm='12'>
            <Form.Group controlId='config-name'>
              <FormControl {...register('name')} autoComplete='off' placeholder='getautoclicker.com' aria-label='getautoclicker.com' aria-describedby='config-name' />
              <Form.Label>{t('configuration.name')}</Form.Label>
            </Form.Group>
          </Col>
          <Col md='4' sm='12'>
            <Form.Group controlId='config-init-wait'>
              <FormControl
                {...register('initWait', { pattern: REGEX_INTERVAL })}
                autoComplete='off'
                isInvalid={!!errors.initWait}
                list='interval'
                placeholder='0'
                aria-label='0'
                aria-describedby='config-init-wait'
              />
              <Form.Label>
                {t('configuration.initWait')}&nbsp;<small className='text-muted'>({t('common.sec')})</small>
              </Form.Label>
              <Form.Control.Feedback type='invalid'>{errors.initWait && t('error.initWait')}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md='4' sm='12'>
            <Form.Group controlId='config-start-time'>
              <FormControl
                {...register('startTime', { pattern: REGEX_START_TIME })}
                autoComplete='off'
                isInvalid={!!errors.startTime}
                placeholder='HH:mm:ss:fff'
                aria-label='HH:mm:ss:fff'
                list='start-time'
                aria-describedby='config-start-time'
              />
              <Form.Label>{t('configuration.startTime')}&nbsp;</Form.Label>
              <StartTimePopover />
              <Form.Control.Feedback type='invalid'>{errors.startTime && t('error.startTime')}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
        {isDirty && (
          <div className='d-flex justify-content-end mt-2'>
            <Button type='submit' variant='primary px-5' disabled={!isValid}>
              {t('common.save')}
            </Button>
          </div>
        )}
      </Card.Body>
    </Form>
  )
}
ConfigBody.propTypes = {
  configIndex: PropTypes.number.isRequired,
  setConfigs: PropTypes.func.isRequired,
  config: PropTypes.shape({
    enable: PropTypes.bool.isRequired,
    name: PropTypes.string,
    url: PropTypes.string,
    initWait: numberWithExponential,
    startTime: PropTypes.string
  }).isRequired
}
export default ConfigBody
