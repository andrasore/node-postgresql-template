import { URL } from 'url'

const MAX_ID = 8 ** 8 - 1

export class UrlToIdConverter {
  constructor (basePath: string) {
    this.basePath = new URL(basePath)
  }

  private readonly basePath: URL

  idToUrl (id: number): URL {
    this.validateId(id)

    const result = new URL(this.basePath.toString())
    const idHexString = id.toString(16).padStart(8, '0')
    result.pathname = idHexString

    return result
  }

  urlToId (url: URL): number {
    this.validateUrl(url)

    const idHexString = url.pathname.slice(1)
    const result = Number.parseInt(idHexString, 16)

    this.validateId(result)

    return result
  }

  private validateId (id: number): void {
    if (isNaN(id)) {
      throw new RangeError('Id should be a number!')
    }
    if (id < 0) {
      throw new RangeError('Id should be 0 or larger')
    }
    if (id % 1 !== 0) {
      throw new RangeError('Id should be a whole number!')
    }
    if (id >= MAX_ID) {
      throw new RangeError('Id should be smaller than MAX_ID (8 ** 8)!')
    }
  }

  private validateUrl (url: URL): void {
    if (url.origin !== this.basePath.origin) {
      throw new RangeError('Input url should have basePath as origin!')
    }
  }
}
