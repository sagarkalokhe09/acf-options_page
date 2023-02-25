export function dataLayerInput(input, section) {
  const event = { event: 'input', section }
  ;[event.conversionName] = Object.keys(input)
  event.conversionValue = input[event.conversionName]

  window.dataLayer.push(event)
}

export function dataLayerModel(conversionName, conversionValue) {
  const event = { event: 'modal', conversionName, conversionValue }
  window.dataLayer.push(event)
}
