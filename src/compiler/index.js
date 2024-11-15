import { parseHTML } from "./parse";
function genProps(attrs) {
  console.log(attrs);
  let str = "";
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i];
    /* 解析style值 */
    if (attr.name === "style") {
      let obj = {};
      console.log(attr.value);
      attr.value.split(";").forEach((item) => {
        let [key, value] = item.split(":");
        obj[key] = value;
      });
      attr.value = obj;
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`;
  }
  return `{${str.slice(0, -1)}}`;
}
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{assss}} 匹配到的内容就算表达式的变量
function gen(node) {
  if (node.type === 1) {
    return codegen(node);
  } else {
    // 文本
    let text = node.text;
    if (!defaultTagRE.test(text)) {
      return `_v(${JSON.stringify(text)})`;
    } else {
      let tokens = [];
      let match;
      defaultTagRE.lastIndex = 0;
      let lastIndex = 0;

      while ((match = defaultTagRE.exec(text))) {
        let index = match.index;
        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }
        tokens.push(`_s(${match[1].trim()})`);
        lastIndex = index + match[0].length;
      }
      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }
      return `_v(${tokens.join("+")})`;
    }
  }
}
function genChildren(children) {
  return children.map((child) => gen(child)).join(",");
}
function codegen(ast) {
  let children = genChildren(ast.children);
  let code = `_c('${ast.tag}',${ast.attrs.length > 0 ? genProps(ast.attrs) : "null"}${ast.children.length ? `,${children}` : ""})`;
  return code;
}

export function compileToFunction(template) {
  // console.log(template);
  let ast = parseHTML(template);
  // console.log(codegen(ast));
  let code = codegen(ast)
  // 通过this可以
  code = `with(this){return ${code}}`
  console.log(code);
  let render = new Function(code)
  // console.log();
  // render(){
  //   // 创建div 的属性，style：{}，_v表示生成字符，_s表示讲object对象转为字符
  //   return _c('div', { id: 'app' }, _c('div', { style: {color:'red'} }),_v(_s(name)+'hello'))
  // }
  console.log(render);
  // console.log();
  return render
}
