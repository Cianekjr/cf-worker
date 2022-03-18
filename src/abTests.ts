export const abTests = {
  cro_new_get_app: { value: 0.5 },
  cro_new_abtest: { value: 0.5 },
}

interface IPagesAbTests {
  [key: string]: (keyof typeof abTests)[]
}

// only pages with split_version=nuxt
// do not add user specific pages like checkout, account
export const pagesAbTests: IPagesAbTests = {
  '/get-app': ['cro_new_get_app'],
  '/de/get-app': ['cro_new_get_app'],
  '/fr/get-app': ['cro_new_get_app'],
  '/': [],
  '/de': [],
  '/fr': [],
}