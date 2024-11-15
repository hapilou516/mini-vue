// 静态方法
// 策略模式
import { mergeOptions } from "./utils"
export function initGlobalAPI(Vue) {
  const strats = {}
  const LIFECYCLE = [
    'beforeCreate',
    'created'
  ]
  LIFECYCLE.forEach(hook => {
    strats[hook] = function (p, c) {
      if (c) { // 如果儿子有，父亲有， 让父亲和儿子拼在一起
        if (p) {
          return p.concat(c)
        } else {
          return [c] // 儿子有父亲没有，则将儿子包装成数组
        }
      } else {
        return p // 如果儿子没有则用父亲即可
      }
    }
  })

  // 静态方法
  Vue.options = {

  }

  Vue.mixin = function (mixin) {
    // 期望将用户的选项和options进行合并
    this.options = mergeOptions(this.options, mixin)
    return this
  }
}