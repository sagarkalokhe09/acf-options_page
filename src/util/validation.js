const NUMBER_FIELDS = ['repeat', 'repeatInterval', 'initWait']
export const convertNumberField = data => {
  Object.keys(data).forEach(field => {
    if (data[field] && typeof data[field] === 'string' && NUMBER_FIELDS.indexOf(field) !== -1 && data[field].indexOf('e') === -1) {
      data[field] = Number(data[field])
    }
  })
}

export const clearEmptyField = data => {
  Object.keys(data).forEach(prop => {
    if (!data[prop]) {
      delete data[prop]
    }
  })
}
