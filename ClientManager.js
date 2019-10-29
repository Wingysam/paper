module.exports = Paper => {
  return class ClientManager extends Paper.DependencyManager.EventEmitter {
    constructor() {
      super()
      this.clients = []
      Paper.ConfigManager.servers.forEach(server => {
        const client = new Paper.DependencyManager.irc.Client(
          server.host,
          server.nick,
          server
        )
        client.paperConfig = server
    
        client.on('error', console.error)
        client.on('registered', res => console.log(`Connected to ${server.host}:${server.port} as ${res.args[0]}`))
    
        client.on('message', (from, to, message) => this.emit('message', {
          client,
          author: from,
          channel: to,
          content: message
        }))

        client.on('invite', (channel, from, message) => {
          this.emit('invite', { client, channel, from, message })
        })
    
        this.clients.push(client)
      })
    }
  }
}