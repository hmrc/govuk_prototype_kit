const fs = require('fs')
const path = require('path')

const defaultConfig = {
	nunjucksPaths: [],
	scripts: [],
	assets: [],
	globalAssets: [],
	sass: [],
	stylesheets: []
}

const pathFromRoot = (...all) => path.join.apply(null, [__dirname, '..'].concat(all))

const packageFile = require(pathFromRoot('package.json'))

const pathToConfigFile = packageName => pathFromRoot('node_modules', packageName, 'govuk-prototype-kit-hooks.json')

const getConfig = () => Object.keys(packageFile.dependencies).reduce((config, dependency) => {
	const dependencyDir = pathFromRoot('node_modules', dependency)
	const configFile = path.join(dependencyDir, 'govuk-prototype-kit.config.json')
	let extensionConfig = {}

	try {
		extensionConfig = require(configFile)
	} catch (error) {
		return config
	}

	for (let key in config) {
		if (extensionConfig.hasOwnProperty(key)) {
			const fullPaths = extensionConfig[key].map((item) => path.join(dependencyDir, item))
			config[key].push(...fullPaths)
		}
	}

	return config
}, defaultConfig)

const addLeadingSlash = item => item.startsWith('/') ? item : `/${item}`

const getMappedPaths = filePaths => filePaths.map(filePath => ({
	publicPath: addLeadingSlash(path.relative(pathFromRoot(), filePath)),
	filesystemPath: filePath
}))

const getPublicPaths = filePaths => getMappedPaths(filePaths).map((paths) => paths.publicPath)

module.exports = {
	getConfig,
	getMappedPaths,
	getPublicPaths
}
