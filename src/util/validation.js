export const convertNumberField = (data, NUMBER_FIELDS) => {
  Object.keys(data).forEach(field => {
    if (NUMBER_FIELDS.indexOf(field) !== -1 && data[field].indexOf('e') === -1) {
      data[field] = Number(data[field])
    }
  })
}
