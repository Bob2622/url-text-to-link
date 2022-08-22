import createHtmlElement from 'create-html-element'
import { HTMLAttributes } from 'stringify-attributes'
import urlRegexSafe from 'url-regex-safe'

interface Option {
  attributes?: HTMLAttributes,
  type?: 'string' | 'dom',
  value?: string | ((href: string) => string)
}

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

// Capture the whole URL in group 1 to keep `String#split()` support
const urlRegex = () => {
  return urlRegexSafe({
    returnString: true
  })
  // /((?<!\+)https?:\/\/(?:www\.)?(?:[-\w.]+?[.@][a-zA-Z\d]{2,}|localhost)(?:[-\w.:%+~#*$!?&/=@]*?(?:,(?!\s))*?)*)/g
  // const linkRegexp = '<a[^>]*>[^<][^\\][^a][^>]*</a>)'
  // const regexp = new RegExp('(<a[^>]*>[^<]*</a>)|www.baidu.com', 'g')
  // return new RegExp(`${linkRegexp}|${urlRegexpStr}`, 'g')
}

const linkRegex = () => {
  return '(<a[^>]*>[^<][^\\][^a][^>]*</a>)'
}

// Get `<a>` element as string
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

// Get DOM node from HTML
const domify = (html: string) => document.createRange().createContextualFragment(html)

const getAsString = (string: string, options: Option) => string.replace(
  new RegExp(`${linkRegex()}|${urlRegex()}`, 'g'),
  (match: string) => {
    if (match.match(new RegExp(linkRegex()))) {
      // const hrefMatchs = match.match(/href="([^"]*)"/)
      // const href = hrefMatchs ? hrefMatchs[1] : ''
      return match
    } else {
      return linkify(match, options)
    }
  }
)

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
