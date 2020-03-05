/* package.config.js [ 05.03.2020 : 22:45:55 ] */

import resolve from '@rollup/plugin-node-resolve'
import cleanup from 'rollup-plugin-cleanup'
import { name } from './config.js'

export default {
  input: './index.js',
  output: {
    dir: 'package',
    format: 'cjs',
    sourcemap: false,
    banner: `/* ${name} */\n/* global exports require process */`
  },
  plugins: [
    resolve(),
    cleanup({
      comments: ['eslint', /@memberof/],
      maxEmptyLines: 1,
      sourcemap: false
    })
  ]
}
