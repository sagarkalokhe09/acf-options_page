const GTAG = {
  pageview: ({ title, path, url }) => {
    window.gtag('config', process.env.REACT_APP_GOOGLE_ANALYTICS_ID, {
      page_title: title,
      page_path: path,
      page_location: url
    })
  },
  modalview: ({ title, path, url }) => {
    window.gtag('config', process.env.REACT_APP_GOOGLE_ANALYTICS_ID, {
      page_title: title,
      page_path: `/modal/${path}`,
      page_location: url
    })
  },
  event: ({ action, category, label, value }) => {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    })
  },
  exception: ({ description, fatal }) => {
    window.gtag('event', 'exception', {
      description,
      fatal
    })
  }
}
export default GTAG
