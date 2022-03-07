import { REGEX } from './regex'

export const IN_VALID_CLASS = 'is-invalid'
export const NUMBER_FIELDS = ['retry', 'retryInterval', 'recheck', 'recheckInterval', 'repeat', 'repeatInterval', 'initWait', 'actionIndex']
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

document.addEventListener('keyup', e => {
  const ele = e.target
  const { value, pattern, required } = ele
  let isValid = true
  if (pattern) {
    if (!REGEX[pattern].test(value)) {
      isValid = false
    }
  }
  if (isValid && required && !value) {
    isValid = false
  }
  if (isValid) {
    ele.classList.remove(IN_VALID_CLASS)
  } else {
    ele.classList.add(IN_VALID_CLASS)
  }
})
