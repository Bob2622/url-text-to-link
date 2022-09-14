# 功能介绍
纯文本中包含类超链的文字，转换为富文本标签, 如    
`使用www.baidu.com可以进行中文搜索` to `使用<a href="www.baidu.com">www.baidu.com</a>可以进行中文搜索`

# 安装
```bash
npm install linkify-urls-in-rich-text --save
```

```javascript
import linkifyUrlsInRichText from 'linkify-urls-in-rich-text'
const text = linkifyUrlsInRichText('使用www.baidu.com可以进行中文搜索')
// 使用<a href="www.baidu.com">www.baidu.com</a>可以进行中文搜索
console.log(text)
```

# 功能
参考 [单侧case](https://github.com/Bob2622/url-text-to-link/blob/master/test/index.test.ts) 

# 参考项目
https://github.com/sindresorhus/get-urls
