import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Card, Col, Form, FormControl, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { numberWithExponential } from '../../../util'
import { updateForm } from '../../../util/element'
import { APP_LINK } from '../../../constants'

const FORM_ID = 'config-body'

function ConfigBody({ config, onUpdate }) {
  const { t } = useTranslation()

  useEffect(() => {
    updateForm(FORM_ID, config)
  }, [config])

  return (
    <Form id={FORM_ID}>
      <Card.Body>
        <Row>
          <Col md='12' sm='12' className='mb-3'>
            <Form.Group controlId='config-url'>
              <FormControl name='url' required defaultValue={config.url} autoComplete='off' onBlur={onUpdate} placeholder={APP_LINK.TEST} />
              <Form.Label>
                {t('configuration.url')}&nbsp;<small className='text-danger'>*</small>
              </Form.Label>
              <Form.Control.Feedback type='invalid'>{t('error.url')}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md='6' sm='12'>
            <Form.Group controlId='config-name'>
              <FormControl name='name' autoComplete='off' defaultValue={config.name} onBlur={onUpdate} placeholder='getautoclicker.com' />
              <Form.Label>{t('configuration.name')}</Form.Label>
            </Form.Group>
          </Col>
          <Col md='6' sm='12'>
            <Form.Group controlId='config-init-wait'>
              <FormControl name='initWait' pattern='INTERVAL' defaultValue={config.initWait} onBlur={onUpdate} autoComplete='off' list='interval' placeholder='0' />
              <Form.Label>
                {t('configuration.initWait')}&nbsp;<small className='text-muted'>({t('common.sec')})</small>
              </Form.Label>
              <Form.Control.Feedback type='invalid'>{t('error.initWait')}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Form>
  )
}
ConfigBody.propTypes = {
  config: PropTypes.shape({
    enable: PropTypes.bool.isRequired,
    name: PropTypes.string,
    url: PropTypes.string,
    initWait: numberWithExponential,
    startTime: PropTypes.string
  }).isRequired,
  onUpdate: PropTypes.func.isRequired
}
export default ConfigBody
