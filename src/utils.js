
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
export function mergeOptions(parent, child) {
  const options = {}
  for (const key in parent) {
    mergeField(key)
  }
  for (const key in child) {
    // mergeField(key)
    if (!parent.hasOwnProperty(key)) {
      mergeField(key)
    }
  }
  function mergeField(key) {
    // 策略模式，用策略减少if / else
    if (strats[key]) {
      options[key] = strats[key](parent[key], child[key])
    } else {
      // 不在策略中，则优先采用儿子，在采用父亲
      options[key] = child[key] || parent[key]
    }
  }
  return options
}
