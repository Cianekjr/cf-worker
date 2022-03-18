import { ICookie } from "./types"
import { regions } from "./utilities/regions"
import { abTests, pagesAbTests } from "./abTests"

interface IOutput {
  cookiesToFetch: ICookie
  cookiesToSet: ICookie
  cookiesToCache: string[]
}

export const getCookies = (cookies: ICookie, pathname: string, cfCountry: string | undefined): IOutput  => {
  const cookiesToFetch = { ...cookies }
  const cookiesToSet: ICookie = {}

  for (const [key, value] of Object.entries(abTests)) {
    if (!cookiesToFetch[key]) {
      const cookieValue = Math.random() >= value.value ? 'ok' : 'nok'

      cookiesToFetch[key] = cookieValue

      cookiesToSet[key] = cookieValue
    }
  }

  if (Object.values(regions).includes(cookies.region)) {
    cookiesToFetch.region = cookies.region
  } else {
    if (cfCountry) {
      const userRegion = regions[cfCountry] || '_other'

      cookiesToFetch.region = userRegion
      cookiesToSet.region = userRegion
    } else {
      cookiesToFetch.region = '_other'
      cookiesToSet.region = '_other'
    }
  }

  const cookiesToCache = (pagesAbTests[pathname] || []).reduce<string[]>((acc, item) => {
    return acc.concat(cookiesToFetch[item])
  }, [])

  return { cookiesToFetch, cookiesToSet, cookiesToCache }
}

