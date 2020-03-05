/* index.js [ 03.03.2020 : 06:59:43 ] */

import { name, color } from '../config.js'
import options from '../lib/options.js'


/**
 * Перезагрузка страницы используя API файловой системы.
 *   Эти методы доступны только в фоновом скрипте расширения браузера Chrome.
 * 
 * @memberof fs-we-reloader
 * @param {{}}                         opts Необязательно. Объект опций.
 * @param {number}  [opts.readInterval=800] Интервал опроса файлов каталога расширения. По умолчанию 800.
 * @param {function}     [opts.filter=null] Пользовательская функция фильтрации файлов, для проверки изменений.  
 *                    При рекурсивном обходе получает аргументом путь к файлу.  
 *                    Пример: `(path)=>!/\.jpg$/.test(path)` - изображения с текущим расширением не будут влиять на перезагрузку.
 * @param {boolean}  [opts.tabReload=false] Вызывать ли перезагрузку текущего активного tab-а.
 * @param {function} [opts.userReload=null] Пользовательская функция перезагрузки.
 * @param {boolean} [opts.bypassCache=null] Обойти локальный веб-кеш.
 */
export default function (opts) {

  console.log(`%c${name}:\n`, color, 'Подключен скрипт отслеживания изменений файлов директории расширения.')

  const { readInterval, filter, tabReload, userReload, bypassCache } = options(opts)

  /**
   * Получение директории расширения. Директория расширения всегда константна.
   * 
   * @returns {Promise->DirectoryEntry} 
   */
  function getPackageDirectoryEntry() {
    return new Promise((s, e) => chrome.management.getSelf(({ installType }) => {
      if (installType === 'development') {
        chrome.runtime.getPackageDirectoryEntry((de) => (
          de ?
            s(de) :
            e(`${name}:\nОшибка получения DirectoryEntry.`))
        )
      } else {
        e(`${name}:\nОтслеживание корневой директории расширения, возможно только в режим development.`)
      }
    }))
  }

  /**
   * Список файлов. Эта функция не выбрасывает ошибок.
   * 
   * @param {DirectoryEntry} directoryEntry
   * @returns {Promise->File[]} 
   */
  function getFiles(directoryEntry) {
    let files = []
    return new Promise((s) => {
      directoryEntry.createReader().readEntries(async (entries, error) => {
        if (error) {
          console.error(`${name}:\n`, error)
        } else {
          for (let fse of entries) {
            if (fse.isFile) {
              if (!filter || filter(fse.fullPath))
                await new Promise((fix) => fse.file((f, error) => {
                  error ?
                    console.error(`${name}:\n`, error) :
                    files.push({ path: fse.fullPath, lastModified: f.lastModified })
                  fix()
                }))
            }
            else if (fse.isDirectory) {
              files.push(...(await getFiles(fse)))
            }
          }
        }
        s(files)
      })
    })
  }

  /**
   * Поиск и перезагрузка активного таба.
   * 
   * @returns {Promise->url} 
   */
  function activeTabReload() {
    return new Promise((s) =>
      chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => (
        (tab && chrome.tabs.reload(tab.id, { bypassCache })), s(tab ? tab.url : null)
      )))
  }

  /**
   * Поиск до первого изменения.
   * 
   * @param {[]} oldFiles
   * @param {[]} current
   * @returns {Promise->boolean} 
   */
  async function differenceFiles(oldFiles, current) {
    let before = []

    const rewrite = () => (
      oldFiles.splice(0),
      oldFiles.push(...before),
      oldFiles.push(...current)
    )
    const find = (p) => oldFiles.findIndex(({ path }) => p === path)

    let f
    let i
    while (current.length) {
      f = current.shift()
      i = find(f.path)
      if (i === -1 || f.lastModified !== oldFiles[i].lastModified) {
        rewrite()
        return true
      } else {
        oldFiles.splice(i, 1)
        before.push(f)
      }
    }

    let diff = !!oldFiles.length
    rewrite()
    return diff
  }

  /**
   * Отслеживаем изменения.
   * 
   * @param {{}} data
   * @private
   */
  async function watchTimer(data) {
    let files = await getFiles(data.directoryEntry)
    if (await differenceFiles(data.old, files)) {
      userReload ? userReload() : chrome.runtime.reload()
    } else {
      setTimeout(watchTimer, readInterval, data)
    }
  }

  // +++
  // Run
  void async function () {
    // TODO Это может вызвать ошибку, если расширение не загружено в режиме разработчика
    const directoryEntry = await getPackageDirectoryEntry()

    if (tabReload) {
      let url = await activeTabReload()
      if (url) {
        console.log(`%c${name}:\n`, color, `Перезагружена вкладка ${url}`)
      }
    }

    const old = await getFiles(directoryEntry)
    const data = { directoryEntry, old }
    setTimeout(watchTimer, readInterval, data)
  }()

}
