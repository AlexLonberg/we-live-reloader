/* bundle.config.js [ 29.02.2020 : 23:28:39 ] */

import resolve from '@rollup/plugin-node-resolve'
import minify from 'rollup-plugin-babel-minify'
import { name } from './config.js'


const output = {
  dir: 'demo/fs-we-reloader',
  format: 'iife',
  sourcemap: false,
  banner: `/* ${name} */`
}

const plugins = [
  resolve(),
  minify({
    comments: false,
    sourceMap: false,
    booleans: false,
    builtIns: false,
    infinity: false,
    removeDebugger: true,
    simplifyComparisons: false,
    typeConstructors: false
  })
]

export default [
  {
    input: { 'fs-we-reloader.min': 'fs-we-entry/default.js' },
    output,
    plugins
  },
  {
    input: { 'fs-we-reloader-tab.min': 'fs-we-entry/tab.js' },
    output,
    plugins
  }
] 
