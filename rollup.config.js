// 指定配置导出对象
import babel from "rollup-plugin-babel"
import resolve from '@rollup/plugin-node-resolve'
export default {
  input:"./src/index.js",
  output: {
    file: "./dist/vue.js",
    name: "Vue",
    format: "umd",
    sourcemap:true // 希望可以调试代码
  },
  plugins: [
    babel({
      exclude:"node_modules/**"
    }),
    resolve()
  ]
}