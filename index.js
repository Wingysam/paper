require('irc-colors').global()
require('dotenv').config()

async function main() {
  const Paper = {}
  Paper.DependencyManager = await require('./DependencyManager')(Paper)
  Paper.Store = require('./Store')(Paper)
  Paper.FunctionManager = await require('./FunctionManager')(Paper)
  Paper.ConfigManager = await require('./ConfigManager')(Paper)
  Paper.ClientManager = new (require('./ClientManager')(Paper))()
  Paper.CommandManager = new (require('./CommandManager'))(Paper)
  Paper.ModuleManager = await require('./ModuleManager')(Paper)

  Paper.version = require('./package.json').version
}

main()
