import Dep, { popTarget, pushTarget } from "./dep"

// 每个属性有一个dep（属性就是被观察者），watcher就是观察者（属性变化了会通知观察者更新） -> 观察者模式
let id = 0
class Watcher{
  constructor(vm, fn,options) {
    this.id = id++
    this.renderWatcher = options
    this.getter = fn
    // 收集
    this.deps = [] // 后续实现计算属性，和一些清理工作需要用到
    this.depsId = new Set()
    this.get()
  }
  get() {
    // 在实例的vm里取值
    Dep.target = this
    // pushTarget(this)
    // 调用updateComponent函数，相关涉及到的watcher进行更新
    this.getter()
    Dep.target = null
    // popTarget()
  }
  addDep(dep) { // 一个组件对应多个属性，重复属性不用记录
    let id = dep.id
    if (!this.depsId.has(id)) {
      this.deps.push(dep)
      this.depsId.add(id)
      dep.addSub(this)
    }
  }
  update() {
    // 使用异步队列进行去重并更新
    queueWatcher(this)
    // this.get() // 重新渲染
  }
  run() {
    console.log("run");
    this.get()
  }
}
// 需要给每个属性增加一个dep，收集wathcer
let queue = []
let has = []
let pending = false //防抖的作用
function flushSchedulerQueue() {
  let flushQueue = queue.slice(0)
  queue = []
  has = {}
  pending = false
  // 队列中调用run时，查询watcher中的属性变化
  flushQueue.forEach(q=>q.run())
}
// 只进入第一步渲染watcher，后面相同id进不来
function queueWatcher(watcher) {
  const id = watcher.id
  if (!has[id]) {
    queue.push(watcher)
    has[id] = true
    if (!pending) {
      // 根据事件循环的处理，等待queueWacher调用完后，最后调用定时器的宏任务
      setTimeout(flushSchedulerQueue, 0)
      pending = true
    }
  }
}
let callbacks = []
let waiting = false
function flushCallbacks() {
  waiting = true
  let cbs = callbacks.slice(0)
  cbs.forEach(cb=>cb())
}
let timerFn
if (Promise) {
  timerFn = () => {
    Promise.resolve().then(flushCallbacks)
  }
} else if (MutationObserver) {
  // 监听节点变化，返回的是异步函数
  let observe = new MutationObserver(flushCallbacks)
  let textNode = document.createTextNode(1)
  observe.observe(textNode, {
    characterData:true 
  })
  timerFn = () => {
    textNode.textContent = 2
  }
}else if (setImmediate) {
  timerFn = () => {
    setImmediate(flushCallbacks)
  }
} else {
  timerFn = () => {
    setTimeout(flushCallbacks)
  }
}
export function nextTick(cb) {
  // console.log(cb);
  callbacks.push(cb) // 维护nextTick中的callBack方法，最后一起刷新，最后一起处理
  if (!waiting) {
    timerFn(flushCallbacks)
    waiting = true
  }
}
export default Watcher