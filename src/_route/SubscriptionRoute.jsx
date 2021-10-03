/* eslint-disable no-nested-ternary */
import React, { useContext } from 'react'
import { Redirect, Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import { AuthContext, SubscribeContext } from '../_providers'

const SubscriptionRoute = ({ component: Component, ...rest }) => {
  const user = useContext(AuthContext)
  const subscription = useContext(SubscribeContext)

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
  component: PropTypes.element.isRequired,
  location: PropTypes.shape({}).isRequired
}
export default SubscriptionRoute
