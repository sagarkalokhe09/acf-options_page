/* eslint-disable no-nested-ternary */
import React, { useContext } from 'react'
import { Redirect, Route } from 'react-router-dom'
import PropTypes from 'prop-types'
import { AuthContext, SubscribeContext } from '../_providers'

function SubscriptionRoute({ component: Component, ...rest }) {
  const user = useContext(AuthContext)
  const subscription = useContext(SubscribeContext)
  const subscriptionComp = props => (subscription ? <Component {...props} /> : <Redirect to={{ pathname: '/plan', state: { from: props.location } }} />)
  return <Route {...rest} render={props => (user ? subscriptionComp(props) : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />)} />
}
SubscriptionRoute.propTypes = {
  component: PropTypes.element.isRequired,
  location: PropTypes.shape({}).isRequired
}
export default SubscriptionRoute
