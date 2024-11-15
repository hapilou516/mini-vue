/* 重写部分方法 */
let oldArrayPrototype = Array.prototype
export let newArrayPrototype = Object.create(oldArrayPrototype)
/* 找所有的变异方法 */
let methods = [
  "push",
  "pop",
  "shift",
  "unshift",
  "reverse",
  'sort',
  'splice'
]
methods.forEach(method => {
  newArrayPrototype[method] = function (...args) {
    let res = oldArrayPrototype[method].call(this, ...args)
    // 函数劫持，调用内部方法，更改函数
    // 需要对新增的内容进行劫持
    let ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
        inserted = args

        break
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break;
      default:
        break;
    }
    if (inserted) {

      ob.observeArray(inserted)
    }
    // 数组变化了 通知对应的watcher实现逻辑更新
    ob.dep.notify()
    return res
  }
})
