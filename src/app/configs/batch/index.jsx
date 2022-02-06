import React, { useContext, useState } from 'react'
import { Card, Col, Form, Row } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import BatchBody from './batch-body'
import { numberWithExponential } from '../../../util'
import { ThemeContext } from '../../../_providers/ThemeProvider'
import { getElementProps } from '../../../util/element'

function Batch({ batch, configIndex, setConfigs }) {
  const { theme } = useContext(ThemeContext)
  const [message, setMessage] = useState()
  const { t } = useTranslation()

  const onUpdate = e => {
    const update = getElementProps(e)
    if (update) {
      setConfigs(configs =>
        configs.map((config, index) => {
          if (index === configIndex) {
            config.batch = { ...config.batch, ...update }
            return config
          }
          return config
        })
      )
      setMessage(t('batch.saveMessage'))
      setTimeout(setMessage, 1500)
    }
  }

  return (
    <Card className='mb-4' bg={theme} text={theme === 'light' ? 'dark' : 'white'}>
      <Card.Header as='h6'>
        <Row>
          <Col>
            {t('batch.title')}
            <small className='text-success ms-3'>{message}</small>
          </Col>
          <Col xs='auto' className='d-flex align-items-center justify-content-end'>
            <Form>
              <Form.Check type='switch' id='batch-refresh' label={t('batch.refresh')} name='refresh' checked={batch.refresh} onChange={onUpdate} />
            </Form>
          </Col>
        </Row>
      </Card.Header>
      {!batch.refresh && <BatchBody batch={batch} configIndex={configIndex} onUpdate={onUpdate} />}
    </Card>
  )
}

Batch.propTypes = {
  batch: PropTypes.shape({
    refresh: PropTypes.bool,
    repeat: PropTypes.number,
    repeatInterval: numberWithExponential
  }).isRequired,
  configIndex: PropTypes.number.isRequired,
  setConfigs: PropTypes.func.isRequired
}
export default React.memo(Batch)
