module.exports = {
  name: 'Ping Pong',
  run: async Paper => {
    Paper.CommandManager.add({
      name: 'ping',
      run: async message => {
        message.channel.send('Pong!'.irc.blue())
      }
    })
  }
}