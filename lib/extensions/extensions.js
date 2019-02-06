// // Imports
const fs = require('fs')
const path = require('path')
const appConfig = require('../../app/config')

// Utils
const pathFromRoot = (...all) => path.join.apply(null, [__dirname, '..', '..'].concat(all))
const pathToHookFile = packageName => pathFromRoot('node_modules', packageName, 'govuk-prototype-kit.config.json')
const guaranteeArray = item => Array.isArray(item) ? item : [item]
const objectMap = (object, mapFn) => Object.keys(object).reduce((result, key) => {
  result[key] = mapFn(object[key], key)
  return result
}, {})
const removeDuplicates = arr => [...new Set(arr)]
const filterOutParentAndEmpty = part => part && part !== '..'
const throwIfBadFilepath = subject => {
  if (('' + subject.item).indexOf('\\') > -1) {
    throw new Error(`Can't use backslashes in extension paths - "${subject.packageName}" used "${subject.item}".`)
  }
  if (!('' + subject.item).startsWith('/')) {
    throw new Error(`All extension paths must start with a forward slash - "${subject.packageName}" used "${subject.item}".`)
  }
}

function readJsonFile(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

// Reused Functions
const getBaseExtensions = () => appConfig.baseExtensions || ['govuk-frontend']

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
  const installedBaseExtensions = getBaseExtensions()
    .filter(packageName => allNpmDependenciesInAlphabeticalOrder.includes(packageName))

  return removeDuplicates(installedBaseExtensions.concat(allNpmDependenciesInAlphabeticalOrder))
}

// Extensions provide items such as sass scripts, asset paths etc.
// This function groups them by type in a format which can used by getList
const getExtensionsByType = () => {
  return getPackageNamesInOrder()
    .reduce((accum, packageName) => Object.assign({}, accum, objectMap(
      lookupConfigForPackage(packageName),
      (listOfItemsForType, type) => (accum[type] || [])
        .concat(guaranteeArray(listOfItemsForType).map(item => ({packageName, item})))
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
  .map(encodeURIComponent)
  .join('/')

const getFileSystemPath = config => throwIfBadFilepath(config) || pathFromRoot('node_modules', config.packageName,
  config.item.split('/').filter(filterOutParentAndEmpty).join(path.sep))

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
