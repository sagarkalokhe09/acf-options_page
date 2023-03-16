export function dataLayerInput(input, section) {
  const event = { event: 'input', section }
  const key = Object.keys(input)[0]
  event.conversionName = key
  event.conversionValue = input[key]
  window.dataLayer.push(event)
}

export function dataLayerModel(conversionName, conversionValue) {
  const event = { event: 'modal', conversionName, conversionValue }
  window.dataLayer.push(event)
}
