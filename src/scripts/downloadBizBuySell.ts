import * as cheerio from 'cheerio'
import { prisma } from '../server/prisma'
import { CheerioCrawler, Dataset } from 'crawlee'
import { BizBuySellProduct } from '@prisma/client'

const BASE_ENDPOINT_URL = 'https://www.bizbuysell.com/businesses-for-sale'
const IN_STOCK_URL = 'http://schema.org/InStock'

type Product = {
  '@type': 'Product'
  name: string
  logo: string
  image: string
  description: string
  url: string
  productId: string
  offers: Offer
}

type Offer = {
  '@type': 'Offer'
  price: number
  priceCurrency: string
  availability: string
  url: string
  image: string
  priceSpecification: null | string
  availableAtOrFrom: Place
}

type Place = {
  '@type': 'Place'
  address: PostalAddress
}

type ListItem = {
  '@type': 'ListItem'
  position: number
  item: Product
}

type PostalAddress = {
  '@type': 'PostalAddress'
  addressLocality: string
  addressRegion: string
}

export const downloadGenericBizBuySell = async () => {
  const response = await fetch(`${BASE_ENDPOINT_URL}/1`)
    .then((res) => res.text())
    .then((data) => data)

  const $ = cheerio.load(response)
  const totalPages = $('.ngx-pagination > li:nth-last-child(2) > a')
    .text()
    .trim()

  console.info(`Found total pages ${totalPages}`)

  for (let i = 0; i < parseInt(totalPages); i++) {
    const url = `${BASE_ENDPOINT_URL}/${i + 1}`

    const response = await fetch(url)
      .then((res) => res.text())
      .then((data) => data)

    console.info(`Downloaded page ${i + 1} of ${totalPages}`)

    const $ = cheerio.load(response)
    const jsonPayload = $('script[data-stype="searchResultsPage"]')
    const json = jsonPayload.text()
    const parsedJson = JSON.parse(json)

    console.info(`Found total pages ${totalPages}`)

    const results = await Promise.all(
      parsedJson.about.map(async (currentItem: ListItem) => {
        if (currentItem.item['@type'] === 'Product') {
          const itemExists = await prisma.bizBuySellProduct.findFirst({
            where: {
              productId: currentItem.item.productId,
            },
          })

          if (!itemExists) {
            return await prisma.bizBuySellProduct.create({
              data: {
                name: currentItem.item.name,
                logo: currentItem.item.logo,
                image: currentItem.item.image,
                description: currentItem.item.description,
                url: currentItem.item.url,
                productId: currentItem.item.productId,
                offerPrice: currentItem.item.offers.price,
                priceCurrency: currentItem.item.offers.priceCurrency,
                availability:
                  currentItem.item.offers.availability === IN_STOCK_URL,
                addressLocality:
                  currentItem.item.offers.availableAtOrFrom?.address
                    .addressLocality,
                addressRegion:
                  currentItem.item.offers.availableAtOrFrom?.address
                    .addressRegion,
              },
            })
          }
        }
      }),
    )

    console.info(`Written ${results.length} records`)

    console.info(`Downloaded page ${i + 1} of ${totalPages}`)
  }
}

export const visitBizBuySellDetail = async (
  bizProducts: BizBuySellProduct[],
) => {
  const crawler = new CheerioCrawler({
    // Use the requestHandler to process each of the crawled pages.
    async requestHandler({ request, log, $ }) {
      log.info(`Visiting ${request.url}`)

      const financials = $('.financials').text()
      const listingDetails = $('.listingProfile_details').text()

      await Dataset.pushData({
        productId: request.userData.productId,
        financials,
        listingDetails,
        url: request.url,
      })
    },
    maxRequestsPerCrawl: 20,
  })

  // Add first URL to the queue and start the crawl.
  await crawler.run(
    bizProducts.map((e) => ({
      url: e.url ?? '',
      userData: {
        productId: e.productId,
      },
    })),
  )
}

export const downloadGenericBizBuySellDetail = async () => {
  let records = await prisma.bizBuySellProduct.findMany()

  records = records.filter((e) => e.url)

  await visitBizBuySellDetail(records)
}
