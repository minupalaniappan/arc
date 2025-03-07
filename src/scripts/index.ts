import { first } from 'lodash'
import {
  downloadPandemicOversightDataset,
  writePandemicOversightDatasetToDb,
} from './downloadPandemicOversightDataset'
import {
  downloadGenericBizBuySell,
  downloadGenericBizBuySellDetail,
} from './downloadBizBuySell'
import { downloadBaseAxelBusiness } from './downloadDataAxle'

const execute = async () => {
  const command = first(process.argv.slice(2))
  const verb = first(process.argv.slice(3))

  switch (command) {
    case 'pandemicoversight':
      if (verb === 'read') {
        await downloadPandemicOversightDataset()
      } else if (verb === 'write') {
        await writePandemicOversightDatasetToDb()
      }
      return
    case 'bizbuysell':
      await downloadGenericBizBuySell()
      return
    case 'bizbuyselldetail':
      await downloadGenericBizBuySellDetail()
      return
    case 'axelbase':
      console.info('Downloading base axle business')
      await downloadBaseAxelBusiness()
      return
  }
}

execute()
