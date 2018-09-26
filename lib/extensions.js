// Imports
const fs = require('fs')
const path = require('path')
const foundationExtensions = require('../app/config').foundationExtensions || []

// Utils
const pathJoinFromRoot = (...all) => path.join.apply(null, [__dirname, '..'].concat(all))
const pathToHookFile = packageName => pathJoinFromRoot('node_modules', packageName, 'govuk-prototype-kit.config.json')
const objectMap = (object, mapFn) => Object.keys(object).reduce((result, key) => {
  result[key] = mapFn(object[key], key)
  return result
}, {})
const removeDuplicates = arr => arr.filter((i, pos, self) => self.indexOf(i) === pos)
const filterOutTraversesAndEmpty = part => part && part !== '..'
const cloneArray = arr => arr.slice(0)

// Reused Functions
const lookupConfigForPackage = packageName => fs.existsSync(pathToHookFile(packageName)) ? require(pathToHookFile(packageName)) : {}

const getPackageNamesInOrder = () => {
  const dependencies = require(pathJoinFromRoot('package.json')).dependencies || {}
  const allNpmDependenciesInAlphabeticalOrder = Object.keys(dependencies).sort()
  const installedTopPriorityDependencies = foundationExtensions
    .filter(packageName => allNpmDependenciesInAlphabeticalOrder.indexOf(packageName) > -1)

  return removeDuplicates(installedTopPriorityDependencies.concat(allNpmDependenciesInAlphabeticalOrder))
}

const getSourceFromItem = item => typeof item === 'string' ? item : item.src

const extensionItemsByType = getPackageNamesInOrder()
  .reduce((accum, packageName) => Object.assign({}, accum, objectMap(
    lookupConfigForPackage(packageName),
    (item, key) => (accum[key] || []).concat(item.map(item => ({packageName, item})))
  )), {})

const publicUrl = config => config.item.global ? '/assets' : ['', 'extension-assets', config.packageName]
  .concat(config.item.split('/').filter(filterOutTraversesAndEmpty))
  .map(encodeURIComponent).join('/')

const fileSystemPath = (config) => pathJoinFromRoot('node_modules', config.packageName, getSourceFromItem(config.item).split('/')
  .filter(filterOutTraversesAndEmpty)
  .join(path.sep))

// Exports
module.exports = {
  getList: (hookType) => cloneArray(extensionItemsByType[hookType] || []),

  mappers: {
    fileSystemPath,
    publicUrl,

    publicUrlAndFileSystemPath: config => ({
      filesystemPath: fileSystemPath(config),
      publicUrl: publicUrl(config)
    })
  }
}
