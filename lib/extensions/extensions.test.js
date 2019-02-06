/* eslint-env jest */
// NPM dependencies
const path = require('path')
const fs = require('fs')

// Local dependencies
const extensions = require('./extensions.js')

// Local variables
const rootPath = path.join(__dirname, '..', '..')
let testScope

describe('extensions', () => {
  afterEach(() => jest.clearAllMocks())
  beforeEach(() => {
    testScope = {
      fileSystem: {
        '/package.json': fs.readFileSync('package.json', 'utf8'),
        '/node_modules/govuk-frontend/govuk-prototype-kit.config.json': '{"nunjucksPaths": ["/","/components"],"scripts": ["/all.js"],"assets": ["/assets"],"sass": ["/all.scss"]}'
      }
    }
    setupFakeFilesystem()
    extensions.recache()
  })
  describe('Lookup file system paths', () => {
    it('should lookup asset paths as file system paths', () => {
      expect(extensions.getFileSystemPaths('assets')).toEqual([
        path.join(rootPath, '/node_modules/govuk-frontend/assets')
      ])
    })
    it('should lookup nunjucks paths as file system paths', () => {
      expect(extensions.getFileSystemPaths('nunjucksPaths')).toEqual([
        path.join(rootPath, '/node_modules/govuk-frontend'),
        path.join(rootPath, '/node_modules/govuk-frontend/components')
      ])
    })
  })

  describe('getAppViews', () => {
    it('should be a function', () => {
      expect(extensions.getAppViews).toBeInstanceOf(Function)
    })

    it('should output govuk-frontend nunjucks paths as an array', () => {
      expect(extensions.getAppViews()).toEqual([
        path.join(rootPath, '/node_modules/govuk-frontend/components'),
        path.join(rootPath, '/node_modules/govuk-frontend')
      ])
    })

    it('should also output hmcts-frontend nunjucks paths after it is installed', () => {

      mockInstallExtension('hmcts-frontend')
      mockExtensionConfig('hmcts-frontend', {
        nunjucksPaths: [
          '/my-components',
          '/my-layouts'
        ]
      })

      expect(extensions.getAppViews()).toEqual([
        path.join(rootPath, '/node_modules/hmcts-frontend/my-layouts'),
        path.join(rootPath, '/node_modules/hmcts-frontend/my-components'),
        path.join(rootPath, '/node_modules/govuk-frontend/components'),
        path.join(rootPath, '/node_modules/govuk-frontend')
      ])
    })

    it('should not output any nunjucks paths when frontends are uninstalled', () => {
      mockUninstallExtension('govuk-frontend')

      expect(extensions.getAppViews()).toEqual([])
    })

    it('should also output provided paths in the array', () => {
      expect(extensions.getAppViews([
        path.join(rootPath, '/app/views'),
        path.join(rootPath, '/lib'),
      ])).toEqual([
        path.join(rootPath, '/node_modules/govuk-frontend/components'),
        path.join(rootPath, '/node_modules/govuk-frontend'),
        path.join(rootPath, '/app/views'),
        path.join(rootPath, '/lib')
      ])
    })

    it('should output any provided paths in the array', () => {
      expect(extensions.getAppViews([
        '/my-new-views-directory'
      ])).toEqual([
        path.join(rootPath, '/node_modules/govuk-frontend/components'),
        path.join(rootPath, '/node_modules/govuk-frontend'),
        '/my-new-views-directory'
      ])
    })
  })

  describe('getAppConfig', () => {
    it('returns an object', () => {
      expect(extensions.getAppConfig()).toBeInstanceOf(Object)
    })

    it('should have script and stylesheet keys', () => {
      expect(Object.keys(extensions.getAppConfig())).toEqual(['scripts', 'stylesheets'])
    })

    it('should return a list of public urls for the scripts', () => {
      expect(extensions.getAppConfig().scripts).toEqual([
        '/extension-assets/govuk-frontend/all.js'
      ])
    })

    it('should return a list of public urls for the stylesheets', () => {
      expect(extensions.getAppConfig().stylesheets).toEqual([])
    })
  })

  const setupFakeFilesystem = () => {
    const trimFilePath = filePath => (filePath).replace(rootPath, '')

    spyOn(fs, 'readFileSync').and.callFake(function (filePath) {
      const trimmedPath = trimFilePath(filePath)

      if (testScope.fileSystem[trimmedPath]) {
        return testScope.fileSystem[trimmedPath]
      } else {
        const err = new Error(`ENOENT: no such file or directory, open '${filePath}'`)
        err.code = 'ENOENT'
        throw err
      }
    })
    spyOn(fs, 'existsSync').and.callFake(filePath => testScope.fileSystem.hasOwnProperty(trimFilePath(filePath)))
  }

  const mockInstallExtension = (packageName, version = '^0.0.1') => {
    const existingPackageJson = JSON.parse(testScope.fileSystem['/package.json'])
    existingPackageJson.dependencies[packageName] = version
    testScope.fileSystem['/package.json'] = JSON.stringify(existingPackageJson)
  }

  const mockUninstallExtension = (packageName) => {
    const existingPackageJson = JSON.parse(testScope.fileSystem['/package.json'])
    if (!existingPackageJson.dependencies.hasOwnProperty(packageName)) {
      throw new Error(`Could not uninstall '${packageName}' as it is not installed`)
    }
    delete existingPackageJson.dependencies[packageName]
    testScope.fileSystem['/package.json'] = JSON.stringify(existingPackageJson)
    extensions.recache()
  }

  const mockExtensionConfig = (packageName, config = {}) => {
    testScope.fileSystem[`/node_modules/${packageName}/govuk-prototype-kit.config.json`] = JSON.stringify(config, null, 2)
    extensions.recache()
  }
})