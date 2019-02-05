/* eslint-env jest */
// NPM dependencies
const path = require('path')
const fs = require('fs')

// Local dependencies
const extensions = require('./extensions.js')

// Local variables
const rootPath = path.join(__dirname, '..', '..')

describe('extensions', () => {
  let testScope;
  beforeEach(_ => {
    // testScope = {
    //   fsMock: {
    //     '/package.json': '{"dependencies": {}}',
    //     '/node_modules/govuk-frontend/govuk-prototype-kit.config.json': '{}'
    //   }
    // }

    // setupFakeFilesystem(testScope.fsMock)
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
        path.join(rootPath, "/node_modules/govuk-frontend/components"),
        path.join(rootPath, "/node_modules/govuk-frontend")
      ])
    })

    function setupFakeFilesystem(filesAndContentsObject) {
      const trimFilePath = filePath => filePath.replace(rootPath, '')

      spyOn(fs, 'readFileSync').and.callFake(filePath => {
        if (filesAndContentsObject[trimFilePath(filePath)]) {
          return filesAndContentsObject[trimFilePath(filePath)]
        } else {
          const err = new Error(`ENOENT: no such file or directory, open '${filePath}'`)
          err.code = 'ENOENT'
          throw err
        }
      })
      spyOn(fs, 'existsSync').and.callFake(filePath => filesAndContentsObject.hasOwnProperty(trimFilePath(filePath)))
    }
    
    it('should also output hmcts-frontend nunjucks paths after it is installed', () => {
      setupFakeFilesystem({
        '/package.json': fs.readFileSync('package.json', 'utf8'),
        '/node_modules/hmcts-frontend/govuk-prototype-kit.config.json': '{"nunjucksPaths": ["/my-components", "/my-layouts"]}',
        '/node_modules/govuk-frontend/govuk-prototype-kit.config.json': '{"nunjucksPaths": ["/","/components"],"scripts": ["/all.js"],"assets": ["/assets"],"sass": ["/all.scss"]}'
      })

      // testScope.fsMock['/node_modules/hmcts-frontend/govuk-prototype-kit.config.json'] = '{"nunjucksPaths": ["/my-components", "/my-layouts"]}'

      extensions.recache()

      expect(extensions.getAppViews()).toEqual([
        path.join(rootPath, "/node_modules/hmcts-frontend/my-components"),
        path.join(rootPath, "/node_modules/hmcts-frontend/my-layouts"),
        path.join(rootPath, "/node_modules/govuk-frontend/components"),
        path.join(rootPath, "/node_modules/govuk-frontend")
      ])
    })
    
    it('should also output provided paths in the array', () => {
      expect(extensions.getAppViews([
        path.join(rootPath, "/app/views"),
        path.join(rootPath, "/lib"),
      ])).toEqual([
        path.join(rootPath, "/node_modules/govuk-frontend/components"),
        path.join(rootPath, "/node_modules/govuk-frontend"),
        path.join(rootPath, "/app/views"),
        path.join(rootPath, "/lib"),
      ])
    })
    
    it('should output any provided paths in the array', () => {
      expect(extensions.getAppViews([
        "/my-new-views-directory"
      ])).toEqual([
        path.join(rootPath, "/node_modules/govuk-frontend/components"),
        path.join(rootPath, "/node_modules/govuk-frontend"),
        "/my-new-views-directory"
      ])
    })
    // [
    //   "/Users/mcarey/projects/opensource/hmrc/govuk_prototype_kit/node_modules/govuk-frontend/components",
    //   "/Users/mcarey/projects/opensource/hmrc/govuk_prototype_kit/node_modules/govuk-frontend",
    //   "/Users/mcarey/projects/opensource/hmrc/govuk_prototype_kit/app/views/",
    //   "/Users/mcarey/projects/opensource/hmrc/govuk_prototype_kit/lib/"
    // ]
  })
//   it('should output nunjucks paths of all installed extensions as an array', () = {
//       const actual = var appViews = extensions.getAppViews([
//         path.join(__dirname, '/app/views/'),
//         path.join(__dirname, '/lib/')
//       ])
//   })
  describe('getAppConfig', () => {
    it('returns an object', () => {
      expect(extensions.getAppConfig()).toBeInstanceOf(Object)
    })

    it('should have script and stylesheet keys', () => {
      expect(Object.keys(extensions.getAppConfig())).toEqual(["scripts", "stylesheets"])
    })

    it('should return a list of public urls for the scripts', () => {
      expect(extensions.getAppConfig().scripts).toEqual([
        "/extension-assets/govuk-frontend/all.js"
      ])
    })

    it('should return a list of public urls for the stylesheets', () => {
      expect(extensions.getAppConfig().stylesheets).toEqual([])
    })
  })
})