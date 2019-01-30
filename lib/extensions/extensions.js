// Imports
const fs = require('fs')
const path = require('path')
const baseExtensions = require('../../app/config').baseExtensions || ['govuk-frontend']

// Utils
const pathFromRoot = (...all) => path.join.apply(null, [__dirname, '..', '..'].concat(all))
const pathToHookFile = packageName => pathFromRoot('node_modules', packageName, 'govuk-prototype-kit.config.json')
const objectMap = (object, mapFn) => Object.keys(object).reduce((result, key) => {
  result[key] = mapFn(object[key], key)
  return result
}, {})
const removeDuplicates = arr => [...new Set(arr)]
const filterOutTreversesAndEmpty = part => part && part !== '..'
const cloneArray = arr => arr.slice(0)

// Reused Functions
const lookupConfigForPackage = packageName => {
  if (fs.existsSync(pathToHookFile(packageName))) {
    return require(pathToHookFile(packageName))
  } else {
    return {}
  }
}

const getPackageNamesInOrder = () => {
  const dependencies = require(pathFromRoot('package.json')).dependencies || {}
  const allNpmDependenciesInAlphabeticalOrder = Object.keys(dependencies).sort()
  const installedBaseExtensions = baseExtensions
    .filter(packageName => allNpmDependenciesInAlphabeticalOrder.includes(packageName))

  return removeDuplicates(installedBaseExtensions.concat(allNpmDependenciesInAlphabeticalOrder))
}

const getSourceFromItem = item => typeof item === 'string' ? item : item.src

const extensionItemsByType = getPackageNamesInOrder()
  .reduce((accum, packageName) => Object.assign({}, accum, objectMap(
    lookupConfigForPackage(packageName),
    (item, key) => (accum[key] || []).concat(item.map(item => ({packageName, item})))
  )), {})

const getPublicUrl = config => config.item.global ? '/assets' : ['', 'extension-assets', config.packageName]
  .concat(config.item.split('/').filter(filterOutTreversesAndEmpty))
  .map(encodeURIComponent).join('/')

const getFileSystemPath = config => pathFromRoot('node_modules', config.packageName, getSourceFromItem(config.item).split('/')
  .filter(filterOutTreversesAndEmpty)
  .join(path.sep))

const getPublicUrlAndFileSystemPath = config => ({
  fileSystemPath: getFileSystemPath(config),
  publicUrl: getPublicUrl(config)
})

// Exports
const self = module.exports = {
  getList: (hookType) => cloneArray(extensionItemsByType[hookType] || []),

  getPublicUrls: x => self.getList(x).map(getPublicUrl),
  getFileSystemPaths: x => self.getList(x).map(getFileSystemPath),
  getPublicUrlAndFileSystemPaths: x => self.getList(x).map(getPublicUrlAndFileSystemPath),

  getAppConfig: _ => ({
    scripts: self.getPublicUrls('scripts'),
    stylesheets: self.getPublicUrls('stylesheets')
  })
}
