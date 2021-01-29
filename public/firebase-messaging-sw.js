/* global firebase importScripts */
importScripts('https://www.gstatic.com/firebasejs/8.2.4/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.2.4/firebase-messaging.js')
const config = {
  apiKey: 'AIzaSyALM-xB4PU9UI_K73V1zWfBgDMp3ae9axs',
  projectId: 'auto-fill-proj',
  messagingSenderId: '1068181857899',
  appId: '1:1068181857899:web:10e62bf79a9e34f55bb32e'
}
firebase.initializeApp(config)
const messaging = firebase.messaging()
messaging.onBackgroundMessage(console.log)
