import React, { useContext } from 'react'
import { Redirect, Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import { AuthContext } from '../_providers/AuthProvider'

const AuthRoute = ({ component: Component, ...rest }) => {
  const user = useContext(AuthContext)
  return <Route {...rest} render={props => (user ? <Component {...props} /> : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />)} />
}
AuthRoute.propTypes = {
  component: PropTypes.element.isRequired,
  location: PropTypes.shape({}).isRequired
}
export default AuthRoute
