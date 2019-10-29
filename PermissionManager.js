module.exports = Paper => class PermissionManager {
  constructor() {
    this.permissionLevels = [
      {
        name: 'infinity',
        check: () => false
      },
      {
        name: 'master',
        check: ({ client, nick }) => client.paperConfig.master === nick
      },
      {
        name: 'owner',
        check: ({ client, nick, channel }) => new Promise(resolve => {
          client.once(`names${channel}`, nicks => resolve(nicks[nick] === '~'))
          client.send('NAMES', channel)
        })
      },
      {
        name: 'admin',
        check: ({ client, nick, channel }) => new Promise(resolve => {
          client.once(`names${channel}`, nicks => resolve(nicks[nick] === '&'))
          client.send('NAMES', channel)
        })
      },
      {
        name: 'operator',
        check: ({ client, nick, channel }) => new Promise(resolve => {
          client.once(`names${channel}`, nicks => resolve(nicks[nick] === '@'))
          client.send('NAMES', channel)
        })
      },
      {
        name: 'half-op',
        check: ({ client, nick, channel }) => new Promise(resolve => {
          client.once(`names${channel}`, nicks => resolve(nicks[nick] === '%'))
          client.send('NAMES', channel)
        })
      },
      {
        name: 'voiced',
        check: ({ client, nick, channel }) => new Promise(resolve => {
          client.once(`names${channel}`, nicks => resolve(nicks[nick] === '+'))
          client.send('NAMES', channel)
        })
      },
      {
        name: 'none',
        check: () => true
      }
    ]
  }

  async get(data) {
    for (const level of this.permissionLevels) {
      if (await level.check(data)) return level.name
    }
  }
}