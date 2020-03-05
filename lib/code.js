/* code.js [ 03.03.2020 : 15:42:59 ] */

import { host, name, color } from '../config.js'


const code = `
console.log('%c${name}:\\n', '${color}', 'Подключен скрипт отслеживания изменений файлов директории расширения.')

function activeTabReload() {
  return new Promise((s) =>
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => (
      (tab && chrome.tabs.reload(tab.id, { bypassCache })), s(tab ? tab.url : null)
    )))
}

function reload() {
  userReload ? userReload() : chrome.runtime.reload()
}

if (tabReload) {
  void async function() {
    let url = await activeTabReload()
    if(url){
      console.log('%c${name}:\\n', '${color}', 'Перезагружена вкладка ' + url)
    }
  }()
}

let eventSource = new EventSource(url)
let timeDisconnect = Date.now()
let error = false
eventSource.addEventListener('message', (e) => {
  error = false
  if(e.data === 'reload') {
    reload()
  } else {
    timeDisconnect = Date.now()
  }
})

eventSource.addEventListener('error', (e) => {
  if(error && (timeDisconnect + disconnect - Date.now()) < 0){
    eventSource.close()
    console.log('%c${name}:\\n', '${color}', 'Подключение к серверу прервано. Для дальнейшего обновления запустите сервер и принудительно перезагрузите фоновый скрипт(F5).')
  } else if (!error) {
    error = true
    timeDisconnect = Date.now()
    console.error('${name}:\\n', e)
  }
})
`


/**
 * Встраиваем скрипт rollup-ом или webpack
 * 
 * @private
 * @param {number}         port
 * @param {function} userReload
 * @param {boolean}   tabReload
 * @param {boolean} bypassCache
 * @param {number}   disconnect
 * @returns {string} 
 */
export default (port, userReload, tabReload, bypassCache, disconnect) => {
  return `/* ${name} */\n((url, userReload, tabReload, bypassCache, disconnect)=>{${code}})('${host}:${port}/', ${userReload}, ${tabReload}, ${bypassCache}, ${disconnect});\n\n`
}
