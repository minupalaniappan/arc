import CsvReadableStream from 'csv-reader'
import { createReadStream } from 'fs'
import { createWriteStream, existsSync, mkdirSync } from 'fs-extra'
import { prisma } from '../server/prisma'
import moment from 'moment'
import * as dotenv from 'dotenv'

moment.suppressDeprecationWarnings = true

dotenv.config()

const EXPORT_URL =
  'https://public.domo.com/embed/pages/qx5g7/cards/1676470585/export'

const DOMO_EMBED_TOKEN =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI4OTcwNTcyNjMiLCJuYmYiOjE3NDA4NTQ4NDcsImRvbSI6ImNpZ2llLWdvdi5kb21vLmNvbSIsImlzcyI6ImFwaUVtYmVkIiwiZW1iIjpbIntcInRva2VuXCI6XCJxeDVnN1wiLFwibGlua1R5cGVcIjpcIlNFQVJDSEFCTEVcIixcInBlcm1pc3Npb25zXCI6W1wiUkVBRFwiXX0iXSwiZXhwIjoxNzQwODgzNjU3LCJpYXQiOjE3NDA4NTQ4NTcsImp0aSI6IjQ0MWVkMWVhLTk2N2EtNDhjYi1hOTcxLTY4MjEwZGQ1MDQ4ZSJ9.1BhTjWH_kGZh4WzMK67hE5Z8II9NeyJsX6yACGSmYnE'

const ENCODED_REQUEST_BODY = {
  queryOverrides: {
    filters: [],
    dataControlContext: {
      filterGroupIds: [],
    },
    functionOverrides: {},
  },
  watermark: true,
  mobile: false,
  showAnnotations: true,
  type: 'file',
  fileName: 'PPP details.csv',
  accept: 'text/csv',
}

export const PAID_IN_FULL = 'Paid in Full'
export const UNANSWERED = 'Unanswered'
export const TWO_PLUS = 'Existing or more than 2 years old'

export const downloadPandemicOversightDataset = async () => {
  console.info('Downloading Pandemic Oversight Dataset')

  const urlParams = new URLSearchParams()

  urlParams.set('request', JSON.stringify(ENCODED_REQUEST_BODY))

  await fetch(EXPORT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-Domo-Embed-Token': DOMO_EMBED_TOKEN,
      'x-domo-requestcontext': '{"clientToe":"O60S2405KF-U1JER"}',
    },
    body: urlParams,
  }).then((res) => {
    if (res.status > 299) {
      throw new Error(
        `Failed to download Pandemic Oversight Dataset: ${res.statusText}`,
      )
    }

    if (!existsSync('tmp')) {
      mkdirSync('tmp')
    }

    let fileStream

    if (!existsSync('tmp/pandemic-oversight-dataset.csv')) {
      fileStream = createWriteStream('tmp/pandemic-oversight-dataset.csv')
    } else {
      fileStream = createWriteStream('tmp/pandemic-oversight-dataset.csv', {
        flags: 'a',
      })
    }

    res.body?.pipeTo(
      new WritableStream({
        write(chunk) {
          fileStream.write(chunk)
        },
      }),
    )
  })

  console.info('Pandemic Oversight Dataset downloaded')
}

export const writePandemicOversightDatasetToDb = async () => {
  const fileStream = createReadStream(
    'tmp/pandemic-oversight-dataset.csv',
    'utf-8',
  )

  fileStream
    .pipe(
      new CsvReadableStream({
        parseNumbers: true,
        parseBooleans: true,
        trim: true,
      }),
    )
    .on('data', async (row: (string | number)[]) => {
      await prisma.pandemicOversightBusiness.create({
        data: {
          borrower: row[0].toString(),
          loanAmount: Number(row[1]),
          amountForgiven: Number(row[2]),
          loanStatus: row[3] === PAID_IN_FULL ? 'COMPLETE' : 'PENDING',
          dateApproved: moment(row[4]).toISOString(),
          dateForgiven: moment(row[5]).toISOString(),
          payroll: Number(row[6]),
          rent: Number(row[7]),
          utilities: Number(row[8]),
          healthCare: Number(row[9]),
          mortageInterest: Number(row[10]),
          debtInterest: Number(row[11]),
          refinancingEIDL: Number(row[12]),
          notProvided: Number(row[13]),
          lenderName: row[14].toString(),
          businessType: row[15].toString(),
          industry: row[16].toString(),
          industryDetailed: row[17].toString(),
          ageOfBusiness: row[18] === TWO_PLUS ? '2+' : '0-1',
          borrowerCity: row[19].toString(),
          borrowerState: row[20].toString(),
          borrowerZip: row[21].toString(),
          borrowerCounty:
            row[22].toString().split('-').length > 1
              ? row[22].toString().split('-')[1]
              : '',
          borrowerCongressionalDistrict: Number(row[23]),
          jobsReported: Number(row[24]),
          gender: row[25].toString() === UNANSWERED ? null : row[25].toString(),
          race: row[26].toString() === UNANSWERED ? null : row[26].toString(),
        },
      })
    })
    .on('end', function () {
      console.info(`Successfully wrote all rows to database`)
    })
    .on('error', function (err) {
      console.error(err)
    })
}

export default downloadPandemicOversightDataset
