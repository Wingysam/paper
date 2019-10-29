module.exports = {
  name: 'Permission Level',
  run: Paper => {
    Paper.CommandManager.add({
      name: 'permissionlevel',
      aliases: [ 'perm', 'perms', 'permissions', 'permissionslevel', 'permissionlevels', 'permissionslevels' ],
      run: async (message, client) => {
        const nick = message.args[0]
        if (nick) {
          const permissionLevel = await Paper.PermissionManager.get({
            channel: message.channel.name,
            client,
            nick
          })
          return message.channel.send(`${nick}'s permission level here is ${permissionLevel}`)
        }
        message.channel.send(`${message.author.name}'s permission level here is ${message.author.permissionLevel}`)
      }
    })
  }
}