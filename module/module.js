import { defineNuxtModule, addServerHandler, createResolver } from '@nuxt/kit'
import { endpoints } from './endpoints.js'

export default defineNuxtModule({
  meta: {
    name: 'tor-proxy-nitro',
    configKey: 'torProxyNitro'
  },

  defaults: {
    prefix: '/api/tor-proxy'
  },

  setup(options, nuxt) {
    nuxt.options.runtimeConfig.public.robosatsCoordinatorUrl = nuxt.options.runtimeConfig.public.robosatsCoordinatorUrl ?? 'http://otmoonrndnrddqdlhu6b36heunmbyw3cgvadqo2oqeau3656wfv7fwad.onion'

    const resolver = createResolver(import.meta.url)

    const prefix = (options.prefix || '/api/tor-proxy').replace(/\/+$/, '')

    const seen = new Set()

    for (const ep of endpoints) {
      if (!ep?.method || !ep?.route || !ep?.file) {
        throw new Error(`[tor-proxy-nitro] Invalid endpoint entry: ${JSON.stringify(ep)}`)
      }

      const method = String(ep.method).toLowerCase()
      const routeRel = String(ep.route).replace(/^\/+/, '').replace(/\/+$/, '')
      const route = `${prefix}/${routeRel}`

      const key = `${method} ${route}`
      if (seen.has(key)) {
        throw new Error(`[tor-proxy-nitro] Duplicate endpoint: ${key}`)
      }
      seen.add(key)

      addServerHandler({
        method,
        route,
        handler: resolver.resolve(`../runtime/handlers/${ep.file}`)
      })
    }
  }
})
