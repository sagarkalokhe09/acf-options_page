import firebase from 'firebase/app'
import 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyALM-xB4PU9UI_K73V1zWfBgDMp3ae9axs',
  projectId: 'auto-fill-proj',
  messagingSenderId: '1068181857899',
  appId: '1:1068181857899:web:10e62bf79a9e34f55bb32e'
}

firebase.initializeApp(firebaseConfig)

export const auth = firebase.auth()
export default auth
