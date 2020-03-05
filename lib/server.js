/* server.js [ 03.03.2020 : 19:17:32 ] */
/* global process */

import http from 'http'


const listener = () => {
  let keeper
  return {
    requestListener(req, res) {
      res.setHeader('Connection', 'keep-alive')
      res.setHeader('Content-Type', 'text/event-stream')
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.writeHead(200)
      res.write('event: message\ndata: connect\n\n')
      keeper = res
    },
    reloader() {
      (keeper && keeper.end('event: message\ndata: reload\n\n'))
      keeper = null
    }
  }
}


/**
 * Запуск сервера. Порт будет разрешен с Promise.
 * 
 * @param {number} [port=0] Предпочтительный порт.
 * @returns {[Promise->port:number, reloader:function]} 
 */
export default (port) => {
  const { requestListener, reloader } = listener()
  const server = http.createServer(requestListener)
  // В node v13.0.0 это значение по умолчанию рано 0
  server.setTimeout(0)
  process.addListener('beforeExit', () => server.close())
  return [
    new Promise((s, e) =>
      server.listen(port, (err) => (err ? (console.error(err), e(err)) : s(server.address().port)))
    ),
    reloader
  ]
}
