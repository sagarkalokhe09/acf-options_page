import React from 'react'
import PropTypes from 'prop-types'
import { Alert } from 'react-bootstrap'

export const ErrorAlert = ({ heading = 'Error', message }) => (
  <Alert variant='danger'>
    <Alert.Heading>{heading}</Alert.Heading>
    <p>{JSON.stringify(message)}</p>
    {/* <Alert.Link href="http://google.com">View more information</Alert.Link> */}
  </Alert>
)
ErrorAlert.defaultProps = {
  heading: 'Error'
}
ErrorAlert.propTypes = {
  heading: PropTypes.string,
  message: PropTypes.shape({ message: PropTypes.string }).isRequired
}
