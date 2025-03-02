import JSSoup from 'jssoup'

const BASE_ENDPOINT_URL = 'https://www.bizbuysell.com/businesses-for-sale/'

export const downloadGenericBizBuySell = async () => {
  const response = await fetch(BASE_ENDPOINT_URL)
    .then((res) => res.text())
    .then((data) => data)

  const htmlParse = new JSSoup(response)

  console.info(htmlParse)
}

export const downloadSpecificBizBuySell = async (id: string) => {}

export const writeBizBuySell = async () => {}
