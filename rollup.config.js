/* rollup.config.js [ 29.02.2020 : 23:28:39 ] */
/* global process */

import resolve from '@rollup/plugin-node-resolve'
import minify from 'rollup-plugin-babel-minify'

import { rollupPluginWeReloader } from './index'
// ... или import rollupPluginWeReloader from 'we-live-reloader/rollup-plugin-we-reloader'

const DEV = !!process.env.DEV
const plugins = [resolve()]

const WeReloader = DEV ? rollupPluginWeReloader({
  // tabReload перезагружаем активную вкладку
  tabReload: true,
  // Только для примера - выведем в консоль пути к файлам
  filter: (path) => (console.log('UserFilter', path), true)
}) : null
if (!DEV) {
  plugins.push(minify({ comments: false, sourceMap: false }))
}

const output = {
  dir: 'demo/rollup',
  format: 'iife',
  sourcemap: DEV
}

// Экспорт нескольких конфигураций.
//   Для фонового скрипта следует установить основной плагин, который встраивает перезагрузчик.
export default [
  {
    input: 'demo-src/background.js',
    output,
    // Установим в режиме разработки и только для background.js
    plugins: WeReloader ? plugins.concat(WeReloader) : plugins
  },
  {
    input: { 'app/content': 'demo-src/app/content.js' },
    output,
    // _parallelWatch() возвратит мини плагин, с методом обновления родителя rollupPluginWeReloader
    plugins: WeReloader ? plugins.concat(WeReloader._parallelWatch()) : plugins
  }
]
