const toBoolean = (v) => String(v || '').toLowerCase() === 'true'

export default defineNitroConfig({
  runtimeConfig: {
    moduleEnabled: toBoolean(process.env.NUXT_TOR_PROXY_ENABLED),
    torProxySecret: process.env.NUXT_TOR_PROXY_SECRET,
    torSocksUrl: process.env.NUXT_TOR_SOCKS_URL || 'socks5h://127.0.0.1:9050',
    robosatsCoordinatorUrl: process.env.NUXT_ROBOSATS_COORDINATOR_URL,
  },
});
