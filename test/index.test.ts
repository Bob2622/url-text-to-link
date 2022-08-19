import UrlToLink from '../src/index'

const clearLineChart = (text: string):string => {
  return text.replace(/\n([ ]*)/g, '')
}

test('after format, text without link should has link', () => {
  expect(UrlToLink(clearLineChart(`
    hello www.baidu.com world
  `))).toBe(clearLineChart(`
    hello <a href="www.baidu.com">www.baidu.com</a> world`
  ))
})

test('text which contain link should not be repeat format ', () => {
  // expect(UrlToLink(`
  //   hello <a>www.baidu.com</a> world
  // `)).toBe(clearLineChart(`
  //   hello <a href="www.baidu.com">www.baidu.com</a> world
  // `))

  expect(UrlToLink(clearLineChart(`
    hello <a href="www.baidu.com">www.baidu.com</a> world
  `))).toBe(clearLineChart(`
    hello <a href="www.baidu.com">www.baidu.com</a> world
  `))
})

test('param attributes test', () => {
  expect(UrlToLink(clearLineChart(`
    hello www.baidu.com world
  `), { attributes: { target: '_blank' } })).toBe(clearLineChart(`
    hello <a target="_blank" href="www.baidu.com">www.baidu.com</a> world
  `))
})
