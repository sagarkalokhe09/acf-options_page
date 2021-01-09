/* eslint no-void: 0 */

export const getConfigName = (url, index) => {
  let name = `configuration-${index}`
  if (url && url.match('://.*') !== null) {
    name = url.split('/')[2]
  } else if (url) {
    name = url
  }
  return name
}

export const disableContextMenu = () => {
  document.addEventListener('keydown', function (e) {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'J')) {
      e.preventDefault()
      return false
    }
  })
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault()
  })
}
