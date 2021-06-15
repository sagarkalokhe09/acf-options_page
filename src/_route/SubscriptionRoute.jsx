import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { AuthContext, SubscribeContext } from '../_providers'
const SubscriptionRoute = ({ component: Component, ...rest }) => {
  const user = useContext(AuthContext)
  const subscription = useContext(SubscribeContext)
  console.log('user', user)
  console.log('subscription', subscription)
  return (
    <Route
      {...rest}
      render={props =>
        user ? (
          subscription ? (
            <Component {...props} />
          ) : (
            <Redirect to={{ pathname: '/plan', state: { from: props.location } }} />
          )
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )
      }
    />
  )
}
SubscriptionRoute.propTypes = {
  component: PropTypes.any,
  location: PropTypes.any
}
export default SubscriptionRoute
