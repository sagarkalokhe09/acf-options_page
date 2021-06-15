import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { AuthContext } from '../_providers'

const AuthRoute = ({ component: Component, ...rest }) => {
  const user = useContext(AuthContext)
  return <Route {...rest} render={props => (user ? <Component {...props} /> : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />)} />
}
AuthRoute.propTypes = {
  component: PropTypes.any,
  location: PropTypes.any
}
export default AuthRoute
