import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Card, Col, Form, FormControl, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { numberWithExponential } from '../../../util'
import { updateForm } from '../../../util/element'

const FORM_ID = 'batch-body'

function BatchBody({ batch, onUpdate }) {
  const { t } = useTranslation()

  useEffect(() => {
    updateForm(FORM_ID, batch)
  }, [batch])

  return (
    <Form id={FORM_ID}>
      <Card.Body>
        <Row>
          <Col md='6' sm='12'>
            <Form.Group controlId='batch-repeat'>
              <FormControl type='number' name='repeat' pattern='NUMBER' defaultValue={batch.repeat} onBlur={onUpdate} autoComplete='off' placeholder='0' list='repeat' />
              <Form.Label>{t('batch.repeat')}</Form.Label>
              <Form.Control.Feedback type='invalid'>{t('error.number')}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md='6' sm='12'>
            <Form.Group controlId='batch-repeat-interval'>
              <FormControl name='repeatInterval' pattern='INTERVAL' autoComplete='off' defaultValue={batch.repeatInterval} onBlur={onUpdate} placeholder='0' list='interval' />
              <Form.Label>
                {t('batch.repeatInterval')}&nbsp;<small className='text-muted'>({t('common.sec')})</small>
              </Form.Label>
              <Form.Control.Feedback type='invalid'>{t('error.number')}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Form>
  )
}
BatchBody.propTypes = {
  batch: PropTypes.shape({
    repeat: PropTypes.number,
    repeatInterval: numberWithExponential
  }).isRequired,
  onUpdate: PropTypes.func.isRequired
}
export default BatchBody
