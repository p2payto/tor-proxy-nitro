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
    // Do NOT write into runtimeConfig.public here.
    // Users should set runtimeConfig in their app if needed.
    const resolver = createResolver(import.meta.url)
    const prefix = (options.prefix).replace(/\/+$/, '')

    const seen = new Set()

    for (const ep of endpoints) {
      if (!ep?.method || ep.route === undefined || ep.route === null || !ep?.file) {
        throw new Error(`[tor-proxy-nitro] Invalid endpoint entry: ${JSON.stringify(ep)}`)
      }

      const method = String(ep.method).toUpperCase()

      // route is RELATIVE to prefix ('' or '**' etc)
      const routeRel = String(ep.route).replace(/^\/+/, '').replace(/\/+$/, '')
      const route = routeRel ? `${prefix}/${routeRel}` : `${prefix}`

      const key = `${method} ${route}`
      if (seen.has(key)) {
        throw new Error(`[tor-proxy-nitro] Duplicate endpoint: ${key}`)
      }
      seen.add(key)

      const def = {
        route,
        handler: resolver.resolve(`../runtime/handlers/${ep.file}`)
      }

      // Support "ALL" meaning: match any HTTP method
      if (method !== 'ALL') {
        def.method = method
      }

      addServerHandler(def)
    }
  }
})

