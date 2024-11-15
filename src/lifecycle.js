import Watcher from "./observe/watcher";
import { createElmentVNode, createTextVNode } from "./vdom";
function patch(oldVnode,vnode) {
  const isRealElement = oldVnode.nodeType
  if (isRealElement) {
    const elm = oldVnode
    const parentElm = elm.parentNode
    const newElm =  createElm(vnode)

    parentElm.insertBefore(newElm,elm.nextSibling)
    parentElm.removeChild(elm)
    return newElm
  } else {
    // diff算法

  }
}
function createElm(vnode) {
  let { tag, data, children, text } = vnode
  if (typeof tag === "string") { 
    vnode.el = document.createElement(tag)
    patchProps(vnode.el, data)
    children.forEach(child => {
      vnode.el.appendChild(createElm(child))
    });
  } else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el
}
function patchProps(el, props) {
  for (const key in props) {
    if (key == "style") {
      for (const styleName in props.style) {
          el.style[styleName] = props.style[styleName]
      }
    } else {
      el.setAttribute(key,props[key])
    }
  }
}
export function initLifeCycle(Vue) {
  // 为vue原型链上进行赋值
  Vue.prototype._update = function (vnode) {
    // console.log("update",vnode);
    const vm = this
    const el = vm.$el
    /* 既有初始化的功能，也有更新的逻辑 */
    vm.$el =  patch(el,vnode)
  };
  // _c("div",{},...children)
  Vue.prototype._c = function () {
    return createElmentVNode(this, ...arguments);
  };
  // _v(text)

  Vue.prototype._v = function () {
    return createTextVNode(this, ...arguments);
  };
  Vue.prototype._s = function (value) {
    if (typeof value !== "object") return value
    return JSON.stringify(value);

  };
  Vue.prototype._render = function () {
    const vm = this;
    return vm.$options.render.call(vm);
  };
}
export function mountComponent(vm, el) {
  vm.$el = el
  const updateComponent = () => {
    vm._update(vm._render());
  }
  // 创建观察者对象
  // 在模板里取值的属性才会进行Dep.target = this的赋值，渲染watcher
  const watcher = new Watcher(vm, updateComponent, true)
  console.log(watcher);
}

export function callHook(vm,hook) {
  const handlers = vm.$options[hook]
  if (handlers) {
    console.log(handlers);
    handlers.forEach(handler=>handler.call(vm));
  }
}