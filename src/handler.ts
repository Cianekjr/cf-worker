import { parse, serialize } from "cookie"
import { serializeCookiesGroup } from './utilities/serializeCookiesGroup'
import { getCookies } from "./cookies"
import { pagesAbTests } from "./abTests"

export async function handleRequest(event: FetchEvent): Promise<Response> {
  const { request } = event

  const cfCountry = request.cf?.country
  
  const cache = caches.default
  const url = new URL(request.url)

  if (url.pathname.endsWith('/') && url.pathname !== '/') {
    url.pathname = url.pathname.slice(0, -1)
  }

  
  const fetchUrl = new URL(url.pathname, 'https://itchy-swan-41.loca.lt')

  // It is not nuxt page
  if (!pagesAbTests[url.pathname]) {
    return await fetch(fetchUrl.toString(), {
      headers: {
        ...request.headers,
        'Bypass-Tunnel-Reminder': '1',
      }
    })
  }

  const userCookies = parse(request.headers.get("Cookie") || "")
  
  const { cookiesToFetch, cookiesToSet, cookiesToCache } = getCookies(userCookies, url.pathname, cfCountry)
  
  const cacheKey = [fetchUrl.toString(), ...cookiesToCache].join('/')
  
  let response = await cache.match(cacheKey)
  
  if (response) {
    response = new Response(response.body, response)
  } else {
    response = await fetch(fetchUrl.toString(), {
      headers: {
        ...request.headers,
        'Bypass-Tunnel-Reminder': '1',
        Cookie: serializeCookiesGroup(cookiesToFetch)
      }
    })

    response = new Response(response.body, response)

    response.headers.delete("Cache-Control")
    response.headers.append("Cache-Control", "s-maxage=100")
    response.headers.delete("Vary")
    response.headers.delete("Set-Cookie");
    
    const responseClone = response.clone()
    
    event.waitUntil(cache.put(cacheKey, responseClone))
  }
  
  for (const [key, value] of Object.entries(cookiesToSet)) {
    response.headers.append("Set-Cookie", serialize(key, value, { path: '/', maxAge: 31536000 })) // 1 year
  }
  
  return response
}