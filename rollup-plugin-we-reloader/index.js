/* index.js [ 03.03.2020 : 23:03:09 ] */

import { delayReload } from '../config.js'
import options from '../lib/options.js'
import server from '../lib/server.js'
import wrap from '../lib/code.js'

/**
 * Перезагрузка страницы используя плагин Rollup.
 *   Эти методы доступны только в фоновом скрипте расширения браузера Chrome.
 *
 * @memberof rollup-plugin-we-reloader
 * @param {{}}                         opts Необязательно. Объект опций.
 * @param {number}            [opts.port=0] Предпочтительный порт. По умолчанию система выберет свободный порт.
 * @param {function}     [opts.filter=null] Пользовательская функция фильтрации файлов, для проверки изменений.
 *                    При рекурсивном обходе получает аргументом путь к файлу.
 *                    Пример: `(path)=>!/\.jpg$/.test(path)` - изображения с текущим расширением не будут влиять на перезагрузку.
 * @param {boolean}  [opts.tabReload=false] Вызывать ли перезагрузку текущего активного tab-а.
 * @param {function} [opts.userReload=null] Пользовательская функция перезагрузки.
 * @param {boolean} [opts.bypassCache=null] Обойти локальный веб-кеш.
 * @param {number}   [opts.disconnect=5min] Разрыв соединения `EventSource.close()`.
 */
export default (opts) => {
  const { port, filter, tabReload, userReload, bypassCache, disconnect } = options(opts)

  const [useport, reloader] = server(port)

  let code = async () => {
    let p = await useport
    return Promise.resolve(wrap(
      p, userReload, tabReload, bypassCache, disconnect)
    ).then((v) => ((code = () => v), v))
  }

  let sendReload = () => {
    Promise.resolve(reloader).then((v) => ((sendReload = v), v()))
  }

  let delayed
  const delayReloader = () => {
    if (delayed) {
      delayed.reset()
    }
    new Promise((s) => {
      let timerId
      delayed = { reset: () => (clearTimeout(timerId), (delayed = null), s()) }
      timerId = setTimeout(() => (sendReload(), (delayed = null), s()),
        delayReload)
    })
  }

  const fileFilter = filter ?
    ((names) => names.length ? names.some((name) => filter(name)) : false) :
    ((names) => !!names.length)

  let injection = false
  // ( bundle: { [fileName: string]: AssetInfo | ChunkInfo })
  const writeBundle = (data) => {
    injection = false
    if (fileFilter(Object.keys(data))) {
      delayReloader()
    }
  }

  return {
    name: 'rollup-plugin-we-reloader',
    intro() {
      return injection ? null : (injection = true, code())
    },
    writeBundle,
    // Дополнительно: возвращает мини-плагин, для использования с несколькими файлами одновременно
    _parallelWatch() {
      return {
        name: 'rollup-plugin-we-reloader-parallel-watch',
        writeBundle
      }
    }
  }
}
