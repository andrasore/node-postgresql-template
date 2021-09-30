import assert from 'assert'
import { Database } from '../src/Database'
import { UrlToIdConverter } from '../src/UrlToIdConverter'

describe('URL Shortener', function () {
  it('Should return the hexadecimal representation for an id', async function () {
    const converter = new UrlToIdConverter('http://foo.bar')

    const result = converter.idToUrl(16)

    assert.deepStrictEqual(result.href, 'http://foo.bar/00000010')
  })
})

const USE_SQLITE = true

describe('Database', function () {
  it('Insert and tryGet should work', async function () {
    const database = new Database('foo.url', USE_SQLITE)
    await database.init()
    await database.insertUrl('http://foo.bar')

    const result = await database.tryGetByUrl('http://foo.bar')

    assert(result !== null)
    assert.strictEqual(result.longUrl, 'http://foo.bar')
  })

  it('Update should work', async function () {
    const database = new Database('foo.url', USE_SQLITE)
    await database.init()
    const id = await database.insertUrl('http://foo.bar')

    await database.updateUrl(id, 'http://baz.ly/asdfasdf')

    const result = await database.tryGetByUrl('http://foo.bar')
    assert(result !== null)
    assert.strictEqual(result.shortUrl, 'http://baz.ly/asdfasdf')
  })

  it('Get by short url should work', async function () {
    const database = new Database('foo.url', USE_SQLITE)
    await database.init()
    const id = await database.insertUrl('http://foo.bar')

    await database.updateUrl(id, 'http://baz.ly/asdfasdf')

    const result = await database.tryGetByShortUrl('http://baz.ly/asdfasdf')
    assert(result !== null)
    assert.strictEqual(result.longUrl, 'http://foo.bar')
  })
})
