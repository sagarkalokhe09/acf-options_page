export const GA_TRACKING_ID = '<YOUR_GA_TRACKING_ID>'

const GTAG = {
  pageview: (title, url, path) => {
    window.gtag('config', GA_TRACKING_ID, {
      page_title: title,
      page_path: path,
      page_location: url
    })
  },
  modalview: (title, url, path) => {
    window.gtag('config', GA_TRACKING_ID, {
      page_title: title,
      page_path: `/modal/${path}`,
      page_location: url
    })
  },
  event: (action, category, label, value) => {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    })
  },
  exception: (description, fatal) => {
    window.gtag('event', 'exception', {
      description,
      fatal
    })
  }
}
export default GTAG
