import { compileToFunction } from "./compiler/index";
import { callHook, mountComponent } from "./lifecycle";
import { initState } from "./state";
import { mergeOptions } from "./utils";

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    let vm = this;
    // 保存自定义对象
    // vm.$options =  options;
    vm.$options = mergeOptions(this.constructor.options,options)
    console.log(options);
    callHook(vm,"beforeCreate")
    initState(vm);
    // 挂载实例方法到函数对象中
    callHook(vm,"created")
    if (options.el) {
      vm.$mouted(options.el);
    }
  };
  Vue.prototype.$mouted = function (el) {
    const vm = this;
    el = document.querySelector(el);
    let ops = vm.$options;
    let template;
    let { render } = ops;
    if (!render) {
      if (!ops.template && el) {
        template = el.outerHTML;
      } else {
        if (el) {
          template = ops.template;
        }
      }
    }
    // debugger
    if (template) {
      const render = compileToFunction(template);
      ops.render = render;
    }
    // 进行组件的挂载:
    mountComponent(vm, el);
  };
}

// 数据初始化
