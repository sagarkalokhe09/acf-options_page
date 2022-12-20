import React, { createContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Logger } from '@dhruv-techapps/core-common'
import { StorageService } from '@dhruv-techapps/core-services'
import { useHistory } from 'react-router-dom'
import { LOCAL_STORAGE_KEY } from '@dhruv-techapps/acf-common'
import { auth } from '../firebase'

export const AuthContext = createContext()
function AuthProvider({ children }) {
  const history = useHistory()
  const [user, setUser] = useState(null)

  useEffect(() => {
    auth.onAuthStateChanged(async userAuth => {
      if (userAuth) {
        StorageService.set(window.EXTENSION_ID, { [LOCAL_STORAGE_KEY.DISCORD]: { uid: userAuth.uid } })
          .catch(Logger.colorError)
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
