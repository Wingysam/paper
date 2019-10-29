class CommandManager {
  constructor (Paper) {
    this._Paper = Paper
    this._commands = []

    Paper.ClientManager.clients.forEach(client => {
      client.on('message', (from, to, message) => {
        const prefixes = [ client.nick + ': ' ]
        if (Paper.ConfigManager.prefix) prefixes.push(Paper.ConfigManager.prefix)
        
        const prefix = prefixes.find(prefix => message.startsWith(prefix))
        if (!prefix) return

        const command = message.replace(prefix, '').split(' ')
        const commandName = command.shift()
        const argString = command.join(' ')
        let args
        try {
          args = Paper.DependencyManager.parseArgs(argString)
        } catch (error) {
          if (error.message === 'Invalid argument(s)') {
            client.say((to === client.nick ? from : to), "Invalid argument(s) - Do you have a misplaced quote? '_'")
          } else if (error.message === 'Unexpected end of input') {
            client.say((to === client.nick ? from : to), "Invalid argument(s) - Are you missing a quote? '_° ")
          } else {
            console.error(error)
            return
          }
        }

        this._commands.forEach(async command => {
          const names = [ command.name, ...command.aliases ]
          if (!names.includes(commandName)) return

          const permissionLevel = await Paper.PermissionManager.get({
            client,
            nick: from,
            channel: to
          })
          
          const permissionLevels = Paper.PermissionManager.permissionLevels
            .map(permissionLevel => permissionLevel.name)

          if (permissionLevels.indexOf(command.permissionLevel) < permissionLevels.indexOf(permissionLevel))
            return client.say((to === client.nick ? from : to), `[${command.module.name.irc.red()}] You need higher permissions. Required: ${command.permissionLevel}. You have: ${permissionLevel}.`)

          command.run({
            author: { name: from, permissionLevel },
            channel: {
              name: to,
              send: (message, opts) => {
                opts = Paper.DependencyManager.lodash.defaultsDeep(opts, {
                  scoped: true
                })
                let scope = `[${command.module.name.irc.green()}] `
                if (opts.error) scope = `[${command.module.name.irc.green()}] `
                if (!opts.scoped) scope = ''
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
      aliases: [],
      permissionLevel: 'none'
    }))
  }
}

module.exports = CommandManager