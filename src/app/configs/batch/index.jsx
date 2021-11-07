import React, { useContext } from 'react'
import { Card, Col, Form, Row } from 'react-bootstrap'
import { ElementUtil } from '@dhruv-techapps/core-common'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import BatchBody from './batch-body'
import { GTAG, numberWithExponential } from '../../../util'
import { ThemeContext } from '../../../_providers/ThemeProvider'

const Batch = ({ batch, configIndex, setConfigs }) => {
  const { theme } = useContext(ThemeContext)

  const { t } = useTranslation()
  const onChange = e => {
    const { name, value } = ElementUtil.getNameValue(e.currentTarget)
    setConfigs(configs =>
      configs.map((config, index) => {
        if (index === configIndex) {
          config.batch = { ...config.batch, [name]: value }
          return config
        }
        return config
      })
    )
    GTAG.event({ category: 'Batch', action: 'Change', label: 'Refresh', value: value })
  }

  return (
    <Card className='mb-4' bg={theme} text={theme === 'light' ? 'dark' : 'white'}>
      <Card.Header as='h6'>
        <Row>
          <Col>{t('batch.title')}</Col>
          <Col xs='auto' className='d-flex align-items-center justify-content-end'>
            <Form>
              <Form.Check type='switch' id='batch-refresh' label={t('batch.refresh')} name='refresh' checked={batch.refresh} onChange={onChange} />
            </Form>
          </Col>
        </Row>
      </Card.Header>
      {!batch.refresh && <BatchBody batch={batch} configIndex={configIndex} setConfigs={setConfigs} />}
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
