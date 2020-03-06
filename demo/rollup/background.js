(function () {
  'use strict';



  /* WE-LiveReloader */
  ((url, userReload, tabReload, bypassCache, disconnect) => {
    console.log('%cWE-LiveReloader:\n', 'color:#FF9800;font-weight:bold', 'Подключен скрипт отслеживания изменений файлов директории расширения.')

    function activeTabReload() {
      return new Promise((s) =>
        chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => (
          tab ? (chrome.tabs.reload(tab.id, { bypassCache }), s(tab.url)) : s(null)
        )))
    }

    function reload() {
      userReload ? userReload() : chrome.runtime.reload()
    }

    if (tabReload) {
      void async function () {
        let url = await activeTabReload()
        if (url) {
          console.log('%cWE-LiveReloader:\n', 'color:#FF9800;font-weight:bold', 'Перезагружена вкладка ' + url)
        }
      }()
    }

    let eventSource = new EventSource(url)
    let timeDisconnect = Date.now()
    let error = false
    eventSource.addEventListener('message', (e) => {
      error = false
      if (e.data === 'reload') {
        reload()
      } else {
        timeDisconnect = Date.now()
      }
    })

    eventSource.addEventListener('error', (e) => {
      if (error && (timeDisconnect + disconnect - Date.now()) < 0) {
        eventSource.close()
        console.log('%cWE-LiveReloader:\n', 'color:#FF9800;font-weight:bold', 'Подключение к серверу прервано. Для дальнейшего обновления запустите сервер и принудительно перезагрузите фоновый скрипт(F5).')
      } else if (!error) {
        error = true
        timeDisconnect = Date.now()
        console.error('WE-LiveReloader:\n', e)
      }
    })
  })('http://127.0.0.1:62293/', null, true, false, 300000);



  /* mod.js [ 03.03.2020 : 13:33:20 ] */

  // Меняем какой нибудь текст и просматриваем в консоли расширения вывод при перезагрузке.

  const background = {
    number: 123,
    str: 'Text'
  };

  /* background.js [ 03.03.2020 : 23:50:35 ] */

  console.log(background);

}());
//# sourceMappingURL=background.js.map
