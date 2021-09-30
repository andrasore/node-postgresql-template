
export function decodeUrlToString (uriEncodedUrl: string): string {
  try {
    return new URL(decodeURIComponent(uriEncodedUrl)).href
  } catch (err) {
    throw new RangeError(`Invalid URI encoded URL: "${uriEncodedUrl}"`)
  }
}
