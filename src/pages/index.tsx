import { trpc } from '../utils/trpc'

const Page = () => {
  const { data } = trpc.axleBusiness.list.useQuery(undefined, {
    refetchInterval: 10000,
  })

  return <div className="py-10">Total Axle Businesses Fetched: {data}</div>
}

export default Page
