import React from 'react'
import PropTypes from 'prop-types'

export const Error = ({ error }) => {
  const reload = () => {
    window.location.reload()
  }

  return <div className="container">
    <div className="row" style={{ marginTop: '100px' }}>
      <div className="col-12">
        <div className="alert alert-danger" role="alert">
          <h3>{JSON.stringify(error)}</h3>
        </div>
      </div>
      <div className="col d-flex justify-content-center">
        <button className="mt-5 mr-5 btn btn-primary" onClick={reload}>Retry</button>
        <a className="mt-5 ml-5 btn btn-outline-primary" href="https://getautoclicker.com/">Download</a>
      </div>
    </div>
  </div>
}
Error.propTypes = {
  error: PropTypes.any.isRequired
}
