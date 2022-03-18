import { serialize } from "cookie"
import { ICookie } from '../types'

export const serializeCookiesGroup = (cookie: ICookie): string => {
  const serializedCookies = []
  for (const [key, value] of Object.entries(cookie)) {
    serializedCookies.push(serialize(key, value))
  }

  return serializedCookies.join('; ')
}