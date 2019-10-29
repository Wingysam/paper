module.exports = {
  name: 'Join/Leave',
  run: Paper => {
    Paper.CommandManager.add({
      name: 'join',
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
      run: async (message, client) => {
        if (message.author === client.paperConfig.master) return client.part(message.channel.name)
        if (
          message.author !== client.paperConfig.master
          && !(await message.channel.isOp(message.author))
        ) return message.send('You are not op. Please have an op run that command.')
        const channelsKey = `${client.paperConfig.host}:${client.paperConfig.port}/channels`
        let channels = Paper.Store.get(channelsKey) || []
        channels = channels.filter(channel => channel !== message.channel.name)
        Paper.Store.set(channelsKey, channels)
        client.part(message.channel.name)
      }
    })
  }
}