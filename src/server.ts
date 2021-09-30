/* eslint-disable @typescript-eslint/no-misused-promises */
// async express handlers violate this rule
import express from 'express'
import { Database } from './Database'
import { UrlToIdConverter } from './UrlToIdConverter'
import { decodeUrlToString } from './utils'

const PORT = process.env.PORT ?? 3000
const BASE_PATH = process.env.BASE_PATH ?? 'http://localhost/'
const DB_URL = process.env.DB_URL ?? 'postgres://user:pass@db:5432/test'

const database = new Database(DB_URL)

const converter = new UrlToIdConverter(BASE_PATH)

const app = express()

app.post('/shorten/:url', async (req, res, next) => {
  try {
    const url = decodeUrlToString(req.params.url)
    const id = await database.tryGetIdByUrl(url)
    if (id === null) {
      const newId = await database.insertUrl(url)
      const shortUrl = converter.idToUrl(newId).href
      // this shouln't actually get stored because of our implementation
      await database.updateUrl(newId, shortUrl)
      res.send(shortUrl)
    }
    res.json('foo')
  } catch (err) {
    return next(err)
  }
})

database
  .init()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App listening at http://localhost:${PORT}`)
      console.log(`BasePath is "${BASE_PATH}"`)
    })
  })
  .catch(err => console.error(err))
