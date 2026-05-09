// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  runtimeConfig: {
    public: {
      shopifyDomain: process.env.SHOPIFY_STORE_DOMAIN,
      shopifyToken: process.env.SHOPIFY_STOREFRONT_TOKEN,
      shopifyApiVersion: process.env.SHOPIFY_API_VERSION ?? '2025-01',
    },
  },
})
