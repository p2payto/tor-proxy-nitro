import { defineNuxtModule, addServerHandler, createResolver } from '@nuxt/kit'
import { endpoints } from './endpoints.js'

const toBoolean = (v) => String(v || '').toLowerCase() === 'true'

export default defineNuxtModule({
  meta: {
    name: 'tor-proxy-nitro',
    configKey: 'torProxyNitro'
  },

  defaults: {
    enabled: false,
    prefix: '/api/tor-proxy',

    // Optional overrides (can be set by host app)
    torProxySecret: undefined,
    torSocksUrl: undefined,
    robosatsCoordinatorUrl: undefined
  },

  setup(options, nuxt) {
    const enabled = toBoolean(options.enabled)
    if (!enabled) return

    // Map module options -> runtimeConfig (server-only)
    // Keep it non-public and override only if provided
    if (options.torProxySecret !== undefined) {
      nuxt.options.runtimeConfig.torProxySecret = options.torProxySecret
    }
    if (options.torSocksUrl !== undefined) {
      nuxt.options.runtimeConfig.torSocksUrl = options.torSocksUrl
    }
    if (options.robosatsCoordinatorUrl !== undefined) {
      nuxt.options.runtimeConfig.robosatsCoordinatorUrl = options.robosatsCoordinatorUrl
    }

    // Defaults (only if still missing)
    nuxt.options.runtimeConfig.torSocksUrl =
      nuxt.options.runtimeConfig.torSocksUrl ?? 'socks5h://127.0.0.1:9050'

    nuxt.options.runtimeConfig.robosatsCoordinatorUrl =
      nuxt.options.runtimeConfig.robosatsCoordinatorUrl ??
      'http://otmoonrndnrddqdlhu6b36heunmbyw3cgvadqo2oqeau3656wfv7fwad.onion'

    const resolver = createResolver(import.meta.url)
    const prefix = String(options.prefix || '/api/tor-proxy').replace(/\/+$/, '')

    const seen = new Set()

    for (const ep of endpoints) {
      const method = String(ep.method).toUpperCase()

      const routeRel = String(ep.route).replace(/^\/+/, '').replace(/\/+$/, '')
      const route = routeRel ? `${prefix}/${routeRel}` : `${prefix}`

      const key = `${method} ${route}`
      if (seen.has(key)) throw new Error(`[tor-proxy-nitro] Duplicate endpoint: ${key}`)
      seen.add(key)

      const def = {
        route,
        handler: resolver.resolve(`../runtime/handlers/${ep.file}`)
      }

      // "ALL" = no method constraint
      if (method !== 'ALL') def.method = method

      addServerHandler(def)
    }
  }
})
