module.exports = {
  name: 'Info',
  run: async Paper => {
    Paper.CommandManager.add({
      name: 'source',
      aliases: [ 'code', 'src' ],
      run: async message => message.channel.send('https://github.com/wingysam/paper')
    })

    Paper.ClientManager.on('message', message => {
      if (![ '!bots', '!botlist', '!rollcall' ].includes(message.content)) return
      message.client.say(
        message.channel,
        `[${'Info'.irc.green()}] Paper Framework v${Paper.version}, my master is ${message.client.paperConfig.master}`
      )
    })
  }
}