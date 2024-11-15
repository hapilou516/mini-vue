let id = 0
class Dep{
  constructor() {
    this.id = id++ // 属性的dep要收集
    this.subs = [] // 
  }
  // Dep.target是watcher对象
  depend() {
    // 通过watcher里的Set去重
    // 双向处理
    Dep.target.addDep(this)
  }
  addSub(watcher) {
    this.subs.push(watcher)
  }
  notify() {
    this.subs.forEach(watcher=>watcher.update()); // 告诉watcher要更新了
  }
}
Dep.target = null
/* dep.target是watcher对象，通过一个栈来维护两个watcher */
let stack = []
export function pushTarget(watcher){
  stack.push(watcher)
  Dep.target = watcher
}
export function popTarget() {
  stack.pop()
  Dep.target = stack[stack.length - 1]
}
export default Dep
