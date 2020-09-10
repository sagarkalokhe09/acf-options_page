export const getConfigName = (url, index) => {
  let name = `new-${index}`
  if (url && url.match('://.*') !== null) {
    name = url.split('/')[2]
  } else if (url) {
    name = url
  }
  return name
}
