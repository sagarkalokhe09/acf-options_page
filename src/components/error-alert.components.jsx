import React from 'react'
import PropTypes from 'prop-types'
import { Alert } from 'react-bootstrap'

export function ErrorAlert({ heading = 'Error', message }) {
  return (
    <Alert variant='danger'>
      <p className='m-0'>
        <strong className='me-2'>{heading}</strong>
        {message.message ? message.message : JSON.stringify(message)}
      </p>
      {/* <Alert.Link href="http://google.com">View more information</Alert.Link> */}
    </Alert>
  )
}
ErrorAlert.defaultProps = {
  heading: 'Error'
}
ErrorAlert.propTypes = {
  heading: PropTypes.string,
  message: PropTypes.shape({ message: PropTypes.string }).isRequired
}
