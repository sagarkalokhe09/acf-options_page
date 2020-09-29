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
  window.$(document).keydown(function (e) {
    return e.keyCode !== 123 && ((!e.ctrlKey || !e.shiftKey || e.keyCode !== 73) && void 0)
  })
  window.$(document).on('contextmenu', function (e) {
    e.preventDefault()
  })
}
