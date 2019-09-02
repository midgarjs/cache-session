const {default: CacheManagerStore} = require('express-session-cache-manager')
const Plugin = require('@midgar/midgar/plugin')

/**
 * MidgarCacheSession plugin
 * 
 * Add cache session storage
 */
class MidgarCacheSession extends Plugin {
  /**
   * Init plugin
   */
  async init() {
    this._cacheKey = 'sessions'
    this._cache = null

    this.pm.on('@midgar/cache:afterInit', (...args) => {
      return this._afterCacheInit(...args)
    })
    
    this.pm.on('@midgar/session:beforeInit', () => {
      return this._beforeInitSession()
    })
  }

  async _afterCacheInit() {
    const cache = this.midgar.services.cache
    // Create new cache instance for sessions
    this._cache = await cache.createStoreInstance(this._cacheKey)
  }

  /**
   * Before inti session callback
   * 
   * Add the cache session store
   */
  async _beforeInitSession() {
    // Get session plugin
    const sessionPlugin = this.pm.plugins['@midgar/session']

    // Add cache store
    await sessionPlugin.addStore('cache', async () => {
      return new CacheManagerStore(this._cache, {prefix: 'sess'})
    })
  }
}

module.exports = MidgarCacheSession
