module.exports = async Paper => {
  const src = Paper.DependencyManager.path.resolve('./config.yml')
  let yaml
  try {
    yaml = (await Paper.DependencyManager.fs.readFile(src)).toString()
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error('** Copy config.example.yml to config.yml, then run this again **')
      process.exit(1)
    } else {
      throw error
    }
  }
  const rawConfig = Paper.DependencyManager.YAML.parse(yaml)
  const config = Paper.DependencyManager.lodash.defaultsDeep(rawConfig, {
    servers: [{}],
    nick: process.env.NICK || 'paper',
    master: process.env.MASTER || 'wingy'
  })

  config.servers = config.servers.map(server => {
    const serverConfig =  Paper.DependencyManager.lodash.defaultsDeep(server, {
      host: 'irc.freenode.net',
      port: 6697,
      secure: [6697, 9999].includes(server.port || 6697),
      selfSigned: true,
      channels: [ '#paper-framework' ],
      nick: config.nick,
      userName: config.nick,
      realName: 'Paper',
      master: config.master,
      stripColors: false
    })

    const storeChannels = Paper.Store.get(`${serverConfig.host}:${serverConfig.port}/channels`) || []
    serverConfig.channels = Paper.DependencyManager.lodash.uniq([ ...serverConfig.channels, ...storeChannels ])

    return serverConfig
  })

  return config
}