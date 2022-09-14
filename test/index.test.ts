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

test('link in richtext tag shuould not be formatted', () => {
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

  expect(UrlToLink(clearLineChart(`
    hello <a href="http://www.baidu.com">www.baidu.com</a> world
  `))).toBe(clearLineChart(`
    hello <a href="http://www.baidu.com">www.baidu.com</a> world
  `))
})
