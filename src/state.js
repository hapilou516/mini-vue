import { observe } from "./observe";

export function initState(vm) {
  var opts = vm.$options;
  var {data} = opts.data;
  if (data) {
    console.log("data-<",data);
    initData(vm);
  }
  // if (computed) {
  //   initComputed(vm)
  // }
}
function proxy(vm, target, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[target][key]
    },
    set(newValue) {
      vm[target][key] = newValue
    }
    
  })
}
function initData(vm) {
  let data = vm.$options.data
  data = typeof data == 'function' ? data.call(vm) : data;
  vm._data = data
  observe(data)
  for (let key in data) {
    proxy(vm,"_data",key)
  }
}
function initComputed(vm) {
  const computed = vm.$options.computed
  console.log(computed);
}