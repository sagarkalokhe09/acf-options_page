export const numberWithExponential = function (props, propName, componentName) {
  if (isNaN(props[propName])) {
    return new Error('Invalid prop `' + propName + '` supplied to `' + componentName + '`. Validation failed.')
  }
}
