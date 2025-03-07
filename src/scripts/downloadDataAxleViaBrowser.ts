import {
  PuppeteerCrawler,
  createPuppeteerRouter,
  Dataset,
  ProxyConfiguration,
} from 'crawlee'

const ROOT_URL = 'https://www-referenceusa-com.ezproxy.mdpls.org/Home/Home'
const SEARCH_URL =
  'https://www-referenceusa-com.ezproxy.mdpls.org/UsBusiness/Search/Quick'

const USERNAME = '99081000986929'
const PASSWORD = '1213'

export const PROXY_URL =
  'http://brd-customer-hl_b114005c-zone-datacenter_proxy1:yjfk4x1kol0l@brd.superproxy.io:33335'

const router = createPuppeteerRouter()

router.addDefaultHandler(async ({ page }) => {
  await page.waitForSelector("input[name='user']", {
    visible: true,
    timeout: 10000,
  })
  await page.waitForSelector("input[name='pass']", {
    visible: true,
    timeout: 10000,
  })

  await page.type("input[name='user']", USERNAME)
  await page.type("input[name='pass']", PASSWORD)
  await page.click('input[type="submit"]')

  await page.waitForSelector('#searchInterface', {
    visible: true,
    timeout: 10000,
  })

  await page.goto(SEARCH_URL)

  const cookie = await page.evaluate(() => {
    const cookie = document.cookie

    return cookie
  })

  const currentUrl = page.url()
  const tokens = currentUrl.split('/')

  const requestId = tokens[tokens.length - 1]

  await page.click('div.submitButton')

  await page.waitForSelector('div#dbSelector', {
    timeout: 10000,
  })

  await Dataset.pushData({
    cookie,
    requestId,
  })

  await new Promise((resolve) => setTimeout(resolve, 500))
})

const crawler = new PuppeteerCrawler({
  requestHandler: router,
  headless: true,
  proxyConfiguration: new ProxyConfiguration({
    proxyUrls: [PROXY_URL],
  }),
})

export const downloadAxleBusinessCookie = async () => {
  await crawler.run([{ url: ROOT_URL }])

  const data = await Dataset.open()

  return data.getData()
}
