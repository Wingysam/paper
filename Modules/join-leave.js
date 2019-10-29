module.exports = {
  name: 'Join/Leave',
  run: Paper => {
    Paper.ClientManager.on('invite', ({ client, channel, from }) => {
      client.join(channel, () => {
        const channelsKey = `${client.paperConfig.host}:${client.paperConfig.port}/channels`
        const channels = Paper.Store.get(channelsKey) || []
        if (!channels.includes(channel)) channels.push(channel)
        Paper.Store.set(channelsKey, channels)
        client.say(channel, `Hello! (invited by ${from})`)
      })
    })

    Paper.CommandManager.add({
      name: 'join',
      permissionLevel: 'master',
      run: (message, client) => {
        const channel = message.args[0]
        if (!channel) return message.channel.send('error'.irc.red() + ': Provide channel to join')
        client.join(channel, () => {
          const channelsKey = `${client.paperConfig.host}:${client.paperConfig.port}/channels`
          const channels = Paper.Store.get(channelsKey) || []
          if (!channels.includes(channel)) channels.push(channel)
          Paper.Store.set(channelsKey, channels)
          message.channel.send(`Joined!`)
        })
      }
    })

    Paper.CommandManager.add({
      name: 'leave',
      aliases: [ 'part' ],
      permissionLevel: 'half-op',
      run: async (message, client) => {
        const channelsKey = `${client.paperConfig.host}:${client.paperConfig.port}/channels`
        let channels = Paper.Store.get(channelsKey) || []
        channels = channels.filter(channel => channel !== message.channel.name)
        Paper.Store.set(channelsKey, channels)
        client.part(message.channel.name)
      }
    })
  }
}