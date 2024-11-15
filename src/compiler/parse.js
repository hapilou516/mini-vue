// import { unicodeRegExp } from "../util/lang";
export const unicodeRegExp =
  /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/

const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
// 第一个分组就是属性的key，value就是分组3/分组4/分组5
const dynamicArgAttribute =
  /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
// 匹配开始标签
const startTagOpen = new RegExp(`^<${qnameCapture}`);
const startTagClose = /^\s*(\/?)>/;
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
const doctype = /^<!DOCTYPE [^>]+>/i;
// #7298: escape - to avoid being passed as HTML comment when inlined in page
const comment = /^<!\--/;
const conditionalComment = /^<!\[/;
export function parseHTML(html) {
  let ELMENT_TYPE = 1
  let TEXT_TYPE = 3
  let stack = []
  let currentParent
  let root
  function createASTElement(tag,attrs) {
    return {
      tag,
      type: ELMENT_TYPE,
      children: [],
      attrs,
      parent:null
    }
  }
  function advance(n) {
    html = html.substring(n);
  }
  function start(tag, attrs) {
    let node = createASTElement(tag, attrs)
    if (!root) {
      root = node      
    }
    if (currentParent) {
      node.parent = currentParent
      currentParent.children.push(node)
    }
    stack.push(node)
    currentParent = node
    // console.error(tag,attrs);
  }
  function chars(text) {
    text = text.replace(/\s/g,'')
    text && currentParent.children.push({
      type: TEXT_TYPE,
      text,
      parent:currentParent
    })
    console.log(text,'文本');
  }
  function end(tag) {
    stack.pop()
    currentParent = stack[stack.length -1 ]
    console.log(tag,'结束'); 
  }
  function parseStartTag() {
    const start = html.match(startTagOpen);
    if (start) {
      const match = {
        tagName: start[1],
        attrs: [],
      };
      // 将标签头进行分割
      advance(start[0].length);
      console.log(html);
      let attr,end;
      // 将属性进行分割出来
      // 同时获取闭合的>
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length);
        match.attrs.push({name:attr[1],value:attr[3] || attr[4] || attr[5]})
      }
      if (end) {
        advance(end[0].length)
      }
      return match
    }
    return false;

  }
  while (html) {
    // console.error(html);
    // debugger
    let textEnd = html.indexOf("<");
    if (textEnd == 0) {
      let startTagMatch = parseStartTag();
      if (startTagMatch) {
        start(startTagMatch.tagName,startTagMatch.attrs)
        continue
      }
      let endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(startTagMatch.tagName)
        continue
      }
      // console.log(html);
      break;
    }
    if (textEnd > 0) {
      let text = html.substring(0, textEnd)
      if (text) {
        chars(text)

        advance(text.length)
      }
    }
  }
  // console.log(root);
  return root
}
export function compileToFunction(template) {
  // console.log(template);
  let ast = parseHTML(template);
}
