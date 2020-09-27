export const convertNumberField = (data, NUMBER_FIELDS) => {
  for (const field in data) {
    if (NUMBER_FIELDS.indexOf(field) !== -1 && data[field].indexOf('e') === -1) {
      data[field] = Number(data[field])
    }
  }
}
