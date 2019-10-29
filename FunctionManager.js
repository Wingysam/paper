module.exports = async Paper => {
  return {
    getModule: () => {
      const stackTrace = new Error().stack.split('\n').reverse()
      let moduleObj
      const regex = /    at .* \((?<filename>[^:]*):\d*:\d*\)/
      for (const item of stackTrace) {
        const matches = item.match(regex)
        if (!matches) continue
        if (matches.groups.filename.startsWith(
          Paper.DependencyManager.path.resolve('./Modules')
        )) {
          moduleObj = require(matches.groups.filename)
        }
      }
      if (!moduleObj) throw new Error('no module found -- who called getModule?')
      return moduleObj
    }
  }
}