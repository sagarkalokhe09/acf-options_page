import React from 'react'
import PropTypes from 'prop-types'
import { Alert, Col, Container, Row } from 'react-bootstrap'
import { NO_EXTENSION_ERROR } from '../constants'

export function ErrorAlert({ heading = 'Error', error }) {
  if (!error) {
    return null
  }

  if (error.message) {
    if (NO_EXTENSION_ERROR.includes(error.message)) {
      return null
    }
  }

  return (
    <Container className='d-flex align-items-center justify-content-center'>
      <Row>
        <Col>
          <Alert variant='danger'>
            <p className='m-0'>
              <strong className='me-2'>{heading}</strong>
              {error.message ? error.message : JSON.stringify(error)}
            </p>
          </Alert>
        </Col>
      </Row>
    </Container>
  )
}
ErrorAlert.defaultProps = {
  heading: 'Error',
  error: null
}
ErrorAlert.propTypes = {
  heading: PropTypes.string,
  error: PropTypes.shape({ message: PropTypes.string })
}
