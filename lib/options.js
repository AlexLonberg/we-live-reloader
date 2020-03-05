/* options.js [ 03.03.2020 : 21:55:28 ] */

import * as config from '../config.js'


/**
 * Разбор опций.
 * 
 * @param {{}} opts
 * @returns {{}} 
 */
export default (opts) => {

  let { port, readInterval, filter, tabReload, userReload, bypassCache, disconnect } = opts || {}

  if (!Number.isInteger(port) || port < 0) {
    port = config.port
  }

  if (!Number.isInteger(readInterval) || readInterval < 100) {
    readInterval = config.readInterval
  }

  if (!Number.isInteger(disconnect) || disconnect < 0) {
    disconnect = config.disconnect
  }
  if (disconnect < 1) {
    disconnect = 24 * 60 * 60 * 1000
  }

  if (typeof filter !== 'function') {
    filter = null
  }
  if (typeof userReload !== 'function') {
    userReload = null
  }

  tabReload = typeof tabReload === 'undefined' ? config.tabReload : !!tabReload
  bypassCache = typeof bypassCache === 'undefined' ? config.bypassCache : !!bypassCache

  return { port, readInterval, filter, tabReload, userReload, bypassCache, disconnect }
}
