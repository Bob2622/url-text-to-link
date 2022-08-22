import createHtmlElement from 'create-html-element'
import { HTMLAttributes } from 'stringify-attributes'
import urlRegexSafe from 'url-regex-safe'

interface Option {
  attributes?: HTMLAttributes,
  type?: 'string' | 'dom',
  value?: string | ((href: string) => string)
}

/**
 * 文本中包含类超链接的字段，格式化为链接(富文本)
 * @param string rich text string to be formated
 * @param options formated option
 * @returns formated string
 */
function linkifyUrlsInRichText (string: string, options?: Option) {
  options = {
    attributes: {},
    type: 'string',
    ...options
  }

  if (options.type === 'string') {
    return getAsString(string, options)
  }

  if (options.type === 'dom') {
    return getAsDocumentFragment(string, options)
  }

  throw new TypeError('The type option must be either `dom` or `string`')
}

export default linkifyUrlsInRichText

/**
 * 获取 url 正则表达式
 * @returns url 正则表达式
 */
const urlRegex = () => {
  return urlRegexSafe({
    returnString: true
  })
}

/**
 * 获取超链正则表达式
 * @returns 超链正则表达式
 */
const linkRegex = () => {
  return '(<a[^>]*>[^<][^\\][^a][^>]*</a>)'
}

/**
 * 类超链文本转换为超链
 * @param 超链地址
 * @param a 标签指定属性
 * @returns 可点击超链纯文本
 */
const linkify = (href:string, options: Option) => createHtmlElement({
  name: 'a',
  attributes: {
    ...options.attributes,
    href
  },
  // 由于依赖的类型系统有错误，只能兼容处理
  text: (typeof options.value === 'undefined' ? href : undefined) as undefined,
  html: typeof options.value === 'undefined'
    ? undefined
    : (typeof options.value === 'function' ? options.value(href) : options.value)
})

/**
 * Get DOM node from HTML
 * @param html 富文本纯文本
 * @returns DOM node
 */
const domify = (html: string) => document.createRange().createContextualFragment(html)

/**
 * 文本中包含类超链接的字段，格式化为链接(富文本), 返回纯文本形式
 * @param string 包含类超链接纯文本
 * @param options 超链格式化指定属性
 * @returns 纯文本
 */
const getAsString = (string: string, options: Option) => string.replace(
  new RegExp(`${linkRegex()}|${urlRegex()}`, 'g'),
  (match: string) => {
    if (match.match(new RegExp(linkRegex()))) {
      return match
    } else {
      return linkify(match, options)
    }
  }
)

/**
 * 文本中包含类超链接的字段，格式化为链接(富文本), 返回 dom 结构
 * @param string 包含类超链接纯文本
 * @param options 超链格式化指定属性
 * @returns dom node
 */
const getAsDocumentFragment = (string: string, options: Option) => {
  const fragment = document.createDocumentFragment()
  for (const [index, text] of Object.entries(string.split(urlRegex()))) {
    if (Number(index) % 2) { // URLs are always in odd positions
      fragment.append(domify(linkify(text, options)))
    } else if (text.length > 0) {
      fragment.append(text)
    }
  }
  return fragment
}
