"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.replace.js");

require("core-js/modules/es.regexp.constructor.js");

require("core-js/modules/es.regexp.to-string.js");

require("core-js/modules/es.string.match.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.string.split.js");

var _createHtmlElement = _interopRequireDefault(require("create-html-element"));

var _urlRegexSafe = _interopRequireDefault(require("url-regex-safe"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function linkifyUrlsInRichText(string, options) {
  options = _objectSpread({
    attributes: {},
    type: 'string'
  }, options);
  console.log('options', options);

  if (options.type === 'string') {
    return getAsString(string, options);
  }

  if (options.type === 'dom') {
    return getAsDocumentFragment(string, options);
  }

  throw new TypeError('The type option must be either `dom` or `string`');
}

var _default = linkifyUrlsInRichText; // Capture the whole URL in group 1 to keep `String#split()` support

exports.default = _default;

const urlRegex = () => {
  return (0, _urlRegexSafe.default)({
    returnString: true
  }); // /((?<!\+)https?:\/\/(?:www\.)?(?:[-\w.]+?[.@][a-zA-Z\d]{2,}|localhost)(?:[-\w.:%+~#*$!?&/=@]*?(?:,(?!\s))*?)*)/g
  // const linkRegexp = '<a[^>]*>[^<][^\\][^a][^>]*</a>)'
  // const regexp = new RegExp('(<a[^>]*>[^<]*</a>)|www.baidu.com', 'g')
  // return new RegExp(`${linkRegexp}|${urlRegexpStr}`, 'g')
};

const linkRegex = () => {
  return '(<a[^>]*>[^<][^\\][^a][^>]*</a>)';
}; // Get `<a>` element as string


const linkify = (href, options) => (0, _createHtmlElement.default)({
  name: 'a',
  attributes: _objectSpread(_objectSpread({}, options.attributes), {}, {
    href
  }),
  // 由于依赖的类型系统有错误，只能兼容处理
  text: typeof options.value === 'undefined' ? href : undefined,
  html: typeof options.value === 'undefined' ? undefined : typeof options.value === 'function' ? options.value(href) : options.value
}); // Get DOM node from HTML


const domify = html => document.createRange().createContextualFragment(html);

const getAsString = (string, options) => string.replace(new RegExp("".concat(linkRegex(), "|").concat(urlRegex()), 'g'), match => {
  if (match.match(new RegExp(linkRegex()))) {
    // const hrefMatchs = match.match(/href="([^"]*)"/)
    // const href = hrefMatchs ? hrefMatchs[1] : ''
    return match;
  } else {
    return linkify(match, options);
  }
});

const getAsDocumentFragment = (string, options) => {
  const fragment = document.createDocumentFragment();

  for (const [index, text] of Object.entries(string.split(urlRegex()))) {
    if (Number(index) % 2) {
      // URLs are always in odd positions
      fragment.append(domify(linkify(text, options)));
    } else if (text.length > 0) {
      fragment.append(text);
    }
  }

  return fragment;
};
