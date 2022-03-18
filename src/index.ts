import { handleRequest} from './handler'

addEventListener('fetch', (event) => {
  try {
    return event.respondWith(handleRequest(event))
  } catch (e) {
    if (e instanceof Error) {
      return event.respondWith(new Response("Error thrown " + e.message))
    }
  }
})