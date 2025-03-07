import * as cheerio from 'cheerio'
import { prisma } from '../server/prisma'
import range from 'lodash/range'
import chunk from 'lodash/chunk'
import { Prisma } from '@prisma/client'
import { HttpsProxyAgent } from 'https-proxy-agent'
import { downloadAxleBusinessCookie } from './downloadDataAxleViaBrowser'

const PROXY_URL =
  'http://brd-customer-hl_b114005c-zone-datacenter_proxy1:yjfk4x1kol0l@brd.superproxy.io:33335'

const TOTAL_PAGES = 731988

const proxyAgent = new HttpsProxyAgent(PROXY_URL)

export const fetchHeaders = (cookie: string, requestId: string) => {
  const myHeaders = new Headers()
  myHeaders.append('Accept', 'text/html, */*; q=0.01')
  myHeaders.append('Accept-Language', 'en-US,en;q=0.9')
  myHeaders.append('Connection', 'keep-alive')
  myHeaders.append(
    'Content-Type',
    'application/x-www-form-urlencoded; charset=UTF-8',
  )
  myHeaders.append('Cookie', cookie)
  myHeaders.append('Origin', 'https://www-referenceusa-com.ezproxy.mdpls.org')
  myHeaders.append(
    'Referer',
    `https://www-referenceusa-com.ezproxy.mdpls.org/UsBusiness/Result/${requestId}`,
  )
  myHeaders.append(
    'Request-Context',
    'appId=cid-v1:6f5cad55-8123-4589-8d6d-e647a71d2872',
  )
  myHeaders.append('Sec-Fetch-Dest', 'empty')
  myHeaders.append('Sec-Fetch-Mode', 'cors')
  myHeaders.append('Sec-Fetch-Site', 'same-origin')
  myHeaders.append(
    'User-Agent',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36',
  )
  myHeaders.append('X-Requested-With', 'XMLHttpRequest')
  myHeaders.append(
    'sec-ch-ua',
    '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
  )
  myHeaders.append('sec-ch-ua-mobile', '?0')
  myHeaders.append('sec-ch-ua-platform', '"macOS"')

  return myHeaders
}

const setMessage = async (message: string) => {
  await fetch('https://mathflow-tawny.vercel.app/api/set/count', {
    method: 'POST',
    body: JSON.stringify({
      message,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.info(`Message emitted: ${JSON.stringify(data)}`)
    })
}

export const downloadBaseAxelBusiness = async () => {
  const raw = (page: number, requestKey: string) =>
    `requestKey=${requestKey}&sort=&direction=Ascending&pageIndex=${page}&optionalColumn=`

  const latestPage = await prisma.axleBusinessPageSearched.findFirst({
    orderBy: {
      pageNumber: 'desc',
    },
  })

  await setMessage(`Starting page ${latestPage?.pageNumber ?? 0}`)

  const numbers = range((latestPage?.pageNumber ?? 0) + 1, TOTAL_PAGES)
  const chunks = chunk(numbers, 5)

  const data = await downloadAxleBusinessCookie()

  let cookie = data.items[0].cookie
  let requestKey = data.items[0].requestId

  console.info(`EXECUTING WITH COOKIE ${cookie} AND REQUEST KEY ${requestKey}`)

  await setMessage(
    `Executing with cookie ${cookie} and request key ${requestKey}`,
  )

  for (const chunk of chunks) {
    console.info(`Starting chunk ${chunk[0]} to ${chunk[chunk.length - 1]}`)
    await setMessage(`Starting chunk ${chunk[0]} to ${chunk[chunk.length - 1]}`)

    const results = await Promise.all(
      chunk.map(async (i) => {
        const requestOptions = {
          method: 'POST',
          headers: fetchHeaders(cookie, requestKey),
          body: raw(i, requestKey),
          agent: proxyAgent,
        }

        return fetch(
          'https://www-referenceusa-com.ezproxy.mdpls.org/UsBusiness/Result/Page',
          requestOptions,
        )
          .then((response) => response.text())
          .then((result) => {
            const $ = cheerio.load(result ?? '')

            const rows = $('#searchResultsPage > tr')
              .map((i, el) => {
                return {
                  name: $(el).find('td:nth-child(2)').text().trim(),
                  executiveName: $(el).find('td:nth-child(3)').text().trim(),
                  streetAddress: $(el).find('td:nth-child(4)').text().trim(),
                  city: ($(el).find('td:nth-child(5)').text().trim() ?? '')
                    .split(',')[0]
                    .trim(),
                  state: ($(el).find('td:nth-child(5)').text().trim() ?? '')
                    .split(',')[1]
                    .trim(),
                  zip: $(el).find('td:nth-child(6)').text().trim(),
                  phone: $(el).find('td:nth-child(7)').text().trim(),
                  employeeSize: $(el).find('td:nth-child(8)').text().trim(),
                  axelBusinessUrl: $(el)
                    .find('td:nth-child(2) > a')
                    .attr('data-tagged-url'),
                  axelBusinessId: $(el)
                    .find('td:nth-child(2) > a')
                    .attr('data-tagged-url')
                    ?.split('?')[1]
                    .split('=')[1],
                }
              })
              .toArray()

            return rows
          })
          .catch((error) => console.error(error))
      }),
    )

    console.info(`Results: ${results.flat().length}`)

    await setMessage(`Results: ${results.flat().length}`)

    if (results.flat().length === 0) {
      const data = await downloadAxleBusinessCookie()

      cookie = data.items[0].cookie
      requestKey = data.items[0].requestId

      console.info(`Reloaded cookie ${cookie} and request key ${requestKey}`)
    } else {
      const records = await prisma.axleBusiness.createMany({
        data: (results.flat() as Prisma.AxleBusinessCreateManyInput[]).filter(
          (e) => !!e,
        ),
      })

      console.info(`Saved ${records.count} records`)

      await setMessage(`Saved ${records.count} records`)

      console.info(`Downloaded page ${chunk[0]} to ${chunk[chunk.length - 1]}`)

      await setMessage(
        `Downloaded page ${chunk[0]} to ${chunk[chunk.length - 1]}`,
      )

      await prisma.axleBusinessPageSearched.createMany({
        data: chunk.map((i) => ({
          pageNumber: i,
        })),
      })

      const totalBusinesses = await prisma.axleBusiness.count()

      console.info(`Total businesses: ${totalBusinesses}`)

      await setMessage(`Total businesses: ${totalBusinesses}`)

      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }
}
