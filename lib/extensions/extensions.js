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
const filterOutParentAndEmpty = part => part && part !== '..'

function readJsonFile (filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

// Reused Functions
const lookupConfigForPackage = packageName => {
  if (fs.existsSync(pathToHookFile(packageName))) {
    return readJsonFile(pathToHookFile(packageName))
  } else {
    return {}
  }
}

const getPackageNamesInOrder = () => {
  const dependencies = readJsonFile(pathFromRoot('package.json')).dependencies || {}
  const allNpmDependenciesInAlphabeticalOrder = Object.keys(dependencies).sort()
  const installedBaseExtensions = baseExtensions
    .filter(packageName => allNpmDependenciesInAlphabeticalOrder.includes(packageName))

  return removeDuplicates(installedBaseExtensions.concat(allNpmDependenciesInAlphabeticalOrder))
}

const getSourceFromItem = item => typeof item === 'string' ? item : item.src

// Extensions provide items such as sass scripts, asset paths etc.
// This function groups them by type in a format which can used by getList
const getExtensionsByType = () => {
  return getPackageNamesInOrder()
    .reduce((accum, packageName) => Object.assign({}, accum, objectMap(
      lookupConfigForPackage(packageName),
      (listOfItemsForType, type) => (accum[type] || []).concat(listOfItemsForType.map(item => ({ packageName, item })))
    )), {})
}

let extensionsByType

const recache = () => {
  extensionsByType = getExtensionsByType()
}

recache()

// The hard-coded reference to govuk-frontend allows us to soft launch without a breaking change.  After a hard launch
// govuk-frontend assets will be served on /extension-assets/govuk-frontend
const getPublicUrl = config => (config.item === '/assets' && config.packageName === 'govuk-frontend') ? '/assets' : ['', 'extension-assets', config.packageName]
  .concat(config.item.split('/').filter(filterOutParentAndEmpty))
  .map(encodeURIComponent).join('/')

const getFileSystemPath = config => pathFromRoot('node_modules', config.packageName, getSourceFromItem(config.item).split('/')
  .filter(filterOutParentAndEmpty)
  .join(path.sep))

const getPublicUrlAndFileSystemPath = config => ({
  fileSystemPath: getFileSystemPath(config),
  publicUrl: getPublicUrl(config)
})

const getList = type => extensionsByType[type] || []

// Exports
const self = module.exports = {
  getPublicUrls: type => getList(type).map(getPublicUrl),
  getFileSystemPaths: type => getList(type).map(getFileSystemPath),
  getPublicUrlAndFileSystemPaths: type => getList(type).map(getPublicUrlAndFileSystemPath),

  getAppConfig: _ => ({
    scripts: self.getPublicUrls('scripts'),
    stylesheets: self.getPublicUrls('stylesheets')
  }),
  getAppViews: additionalViews => self
    .getFileSystemPaths('nunjucksPaths')
    .reverse()
    .concat(additionalViews || []),

  recache
}
