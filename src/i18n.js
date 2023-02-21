import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'

i18n
  // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-http-backend
  // want your translations to be loaded from a professional CDN? => https://github.com/locize/react-tutorial#step-2---use-the-locize-cdn
  .use(Backend)

  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: 'en',
    ns: 'web',
    debug: process.env.NODE_ENV === 'development',
    defaultNS: 'web',
    backend: {
      // path where resources get loaded from, or a function
      // returning a path:
      // function(lngs, namespaces) { return customPath; }
      // the returned path will interpolate lng, ns if provided like giving a static path
      // the function might return a promise
      //
      // If allowMultiLoading is false, lngs and namespaces will have only one element each,
      // If allowMultiLoading is true, lngs and namespaces can have multiple elements
      loadPath: `${process.env.REACT_APP_I18N}/{{lng}}/{{ns}}.json`,
      addPath: '/locales/add/{{lng}}/{{ns}}',
      allowMultiLoading: true,
      reloadInterval: process.env.NODE_ENV === 'development' ? 600000 : false,
      crossDomain: true
    },
    interpolation: {
      escapeValue: false // not needed for react as it escapes by default
    }
  })

export default i18n
