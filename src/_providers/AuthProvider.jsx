import React, { createContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Logger, StorageService } from '@dhruv-techapps/core-common'
import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common'
import { auth } from '../firebase'
import { history } from '../_helpers'

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  useEffect(() => {
    auth.onAuthStateChanged(async userAuth => {
      if (userAuth) {
        StorageService.setItem(LOCAL_STORAGE_KEY.DISCORD, { uid: userAuth.uid })
          .catch(Logger.error)
          .finally(() => {
            setUser(userAuth)
            history.push('/')
          })
      }
    })
  }, [])

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = {
  children: PropTypes.element.isRequired
}
export default AuthProvider
