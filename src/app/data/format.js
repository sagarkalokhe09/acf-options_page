export default class Format {
  static configurations (configs) {
    if (configs && Array.isArray(configs)) {
      for (let configIndex = 0; configIndex < configs.length; configIndex++) {
        configs[configIndex] = Format.configuration(configs[configIndex])
      }
    }
    return configs
  }

  static configuration (config) {
    // Batch Process
    if (!config.batch) {
      config.batch = {}
    }
    ['repeat', 'repeatInterval', 'refresh'].forEach(prop => {
      if (config[prop]) {
        config.batch[prop] = config[prop]
        delete config[prop]
      }
    })
    // Action Process
    if (config.actions) {
      config.actions = config.actions.map(action => {
        if (action.xpath) {
          action.elementFinder = action.xpath
          delete action.xpath
        }
        if (action.repeat === '') {
          delete action.repeat
          delete action.repeatInterval
        }
        // Addon Process
        if (action.addon) {
          if (action.addon.xpath) {
            action.addon.elementFinder = action.addon.xpath
            delete action.addon.xpath
          }
          if (action.addon.retry) {
            action.addon.recheck = action.addon.retry
            action.addon.recheckInterval = action.addon.retryInterval
            delete action.addon.retry
            delete action.addon.retryInterval
          }
        }
        return action
      })
    }
    return config
  }
}
