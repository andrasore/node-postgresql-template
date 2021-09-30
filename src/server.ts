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
    const result = await database.tryGetByUrl(url)
    if (result === null) {
      const newId = await database.insertUrl(url)
      const shortUrl = converter.idToUrl(Number(newId)).href
      // this shouln't actually get stored because of our implementation
      await database.updateUrl(newId, shortUrl)
      return res.send(shortUrl)
    } else {
      return res.send(result.shortUrl)
    }
  } catch (err) {
    return next(err)
  }
})

app.get('/:shortUrl', async (req, res, next) => {
  try {
    const result = await database.tryGetByShortUrl(req.params.shortUrl)
    if (result === null) {
      return res.status(404)
    }
    else {
      return res.redirect(result.longUrl)
    }
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
