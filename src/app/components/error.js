import React from 'react'
import PropTypes from 'prop-types'
import { Alert } from 'react-bootstrap'

export const Error = ({ error, className }) => {
  return <Alert variant="danger" className={className}>
    <Alert.Heading>Error</Alert.Heading>
    {JSON.stringify(error)}
  </Alert>
}
Error.propTypes = {
  className: PropTypes.string,
  error: PropTypes.any.isRequired
}
