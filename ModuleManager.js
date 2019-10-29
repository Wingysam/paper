module.exports = async Paper => {
  const modulesDir = Paper.DependencyManager.path.resolve('./Modules')
  const modules = await Paper.DependencyManager.fs.readdir(modulesDir)
  modules.forEach(moduleDir => {
    require(Paper.DependencyManager.path.join(modulesDir, moduleDir)).run(Paper)
  })
}