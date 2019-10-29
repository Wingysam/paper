class CommandManager {
  constructor (Paper) {
    this._Paper = Paper
    this._commands = []

    Paper.ClientManager.clients.forEach(client => {
      client.on('message', (from, to, message) => {
        const prefixes = [ client.nick + ': ' ]
        if (Paper.ConfigManager.prefix) prefixes.push(Paper.ConfigManager.prefix)
        
        const prefix = prefixes.find(prefix => message.startsWith(prefix))

        const command = message.replace(prefix, '').split(' ')
        const commandName = command.shift()
        const argString = command.join(' ')
        const args = Paper.DependencyManager.parseArgs(argString)

        this._commands.forEach(command => {
          const names = [ command.name, ...command.aliases ]
          if (!names.includes(commandName)) return
          command.run({
            author: from,
            channel: {
              name: to,
              send: (message, opts) => {
                opts = Paper.DependencyManager.lodash.defaultsDeep(opts, {
                  scoped: true
                })
                let scope = ''
                if (opts.scoped) scope = `[${command.module.name.irc.green()}] `
                client.say((to === client.nick ? from : to), scope + message)
              },
              isOp: name => new Promise(resolve => {
                client.once(`names${to}`, nicks => resolve(nicks[name] === '@'))
                client.send('NAMES', to)
              })
            },
            args
          }, client)
        })
      })
    })
  }

  add (command) {
    command.module = this._Paper.FunctionManager.getModule()
    if (!command.name) throw new Error('command must have name')
    this._commands.push(this._Paper.DependencyManager.lodash.defaultsDeep(command, {
      aliases: []
    }))
  }
}

module.exports = CommandManager