import UrlToLink from '../src/index'

const clearLineChart = (text: string):string => {
  return text.replace(/\n([ ]*)/g, '')
}

test('after format, text without link should has link', () => {
  expect(UrlToLink(clearLineChart(`
    hello www.baidu.com world
  `))).toBe(clearLineChart(`
    hello <a href="//www.baidu.com">www.baidu.com</a> world`
  ))
})

test('param attributes test', () => {
  expect(UrlToLink(clearLineChart(`
    hello www.baidu.com world
  `), { attributes: { target: '_blank' } })).toBe(clearLineChart(`
    hello <a target="_blank" href="//www.baidu.com">www.baidu.com</a> world
  `))
})

test('link in tag attr shuould not be formatted', () => {
  expect(UrlToLink(clearLineChart(`
    hello <a href="http://www.baidu.com">www.baidu.com</a> world
  `))).toBe(clearLineChart(`
    hello <a href="http://www.baidu.com">www.baidu.com</a> world
  `))

  expect(UrlToLink(clearLineChart(`
    <p>hello www.baidu.com world <span> inner www.taobao.com</span></p>
  `))).toBe(clearLineChart(`
    <p>
      hello <a href="//www.baidu.com">www.baidu.com</a> world 
      <span> inner <a href="//www.taobao.com">www.taobao.com</a></span>
    </p>
  `))

  expect(UrlToLink(clearLineChart(`
    <p>hello world</p><img src="https://www.imgserve/testimage">
  `), { attributes: { target: '_blank' } })).toBe(clearLineChart(`
    <p>hello world</p><img src="https://www.imgserve/testimage">
  `))

  expect(UrlToLink(clearLineChart(`
    <p>hello world</p><img src="https://www.imgserve/testimage" style="width: 100%" />
  `), { attributes: { target: '_blank' } })).toBe(clearLineChart(`
    <p>hello world</p><img src="https://www.imgserve/testimage" style="width: 100%" />
  `))
})
