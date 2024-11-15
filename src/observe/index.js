import { newArrayPrototype } from "./array";
import Dep from "./dep";

class Observe {
  constructor(data) {
    this.dep = new Dep()
    // 由于是递归遍历this，所以会造成死循环，为ob的this添加不可枚举属性
    Object.defineProperty(data, "__ob__", {
      value: this,
      enumerable: false,
    });
    if (Array.isArray(data)) {
      data.__proto__ = newArrayPrototype;
      this.observeArray(data);
    } else {
      this.walk(data);
    }
  }
  walk(data) {
    // 对属性进行劫持
    Object.keys(data).forEach((key) => defineReactive(data, key, data[key]));
  }
  observeArray(data) {
    // 观察对象
    data.forEach((item) => {

      observe(item);
    });
  }
}
// 深层次嵌套会递归，递归多了性能差，不存在属性监听不到，存在的属性需要重写方法
function dependArray(value) {
  for (let index = 0; index < value.length; index++) {
    let current = value[index]
    current.__ob__ && current.__ob__.dep.depend
    if (Array.isArray(current)) {
      dependArray(current)
    }
  }
}
// 设置响应式方法
export function defineReactive(target, key, value) {
  // 这里因为内部使用了value,进行存储value值，垃圾回收不会回收value值

  let childOb = observe(value); // 对所有的对象进行属性劫持，childOb.dep 用来收集依赖
  // 通过闭包进行Dep容器的保存
  let dep = new Dep()
  
  Object.defineProperty(target, key, {
    get() {
      if (Dep.target) {
        dep.depend()  // 让属性的收集器记住当前的watcher
        if (childOb) {
          childOb.dep.depend() // 让数组和对象本身也实现依赖收集
          if (Array.isArray(value)) {
            // 递归数组进行依赖收集
            dependArray(value)
          }
        }
      }
      return value;
    },
    set(newValue) {
      if (newValue == value) return;
      observe(newValue)
      value = newValue;
      dep.notify() // 通知更新
    },
  });
}
export function observe(data) {
  console.log(data);
  if (typeof data != "object" || data == null) {
    return;
  }
  if (data.__ob__ instanceof Observe) {
    return data.__ob__;
  }
  return new Observe(data);
}
