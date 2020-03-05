/* config.js [ 03.03.2020 : 19:04:21 ] */

// Отображение в консоли - эти 2 свойства не могут передаваться с объектом опций.
export const name = 'WE-LiveReloader'
export const color = 'color:#FF9800;font-weight:bold'


// Все опции передаются объектом плагину `rollup-plugin-we-reloader`
//   или при самостоятельной сборке `fs-we-reloader`
// rollupPluginWeReloader({tabReload: true, ...})


// Только для `fs-we-reloader`
// Интервал чтения каталога расширения.
export const readInterval = 800

// Только для `rollup-plugin-we-reloader`
// Задержка при обновлении. 
//   Полезно если сразу обновляются большое кол-во файлов и команда обновления может повториться.
export const delayReload = 200

// По умолчанию для текущего активного tab-а, не вызывается `chrome.tabs.reload(tab.id)`.
// Если расширение использует встраивание скриптов, установка этого параметра в `true`, 
//   будет вызывать `chrome.tabs.reload(tab.id)`, после обновления `chrome.runtime.reload()`,
//   и только для текущего активного таба.
export const tabReload = false

// Обойти локальный веб-кеш
// См. https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/reload
export const bypassCache = false

// Только для `rollup-plugin-we-reloader`
// Когда сервер отключен, фоновый скрипт пытается переподключиться, 
//   что вызывает ошибку `GET http://127.0.0.1:62548/ net::ERR_CONNECTION_REFUSED`.
// После простоя соединения с интервалом `disconnect`, скрипт вызовет `EventSource.close()`.
//   Дальнейшее обновление при этом, будет возможно при принудительной перезагрузке `F5`.
export const disconnect = 5 * 60 * 1000

// Только для `rollup-plugin-we-reloader`
// К этому адресу добавиться и порт, только для `rollup-plugin-we-reloader` и `webpack-plugin-we-reloader`
export const host = 'http://127.0.0.1'
// Предпочтительный порт. По умолчанию система выберет свободный порт
export const port = 0
