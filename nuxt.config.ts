// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  modules: [
    '@sidebase/nuxt-auth',
    '@invictus.codes/nuxt-vuetify',
    '@vueuse/nuxt',
    'modules/prepare-for-yandex-functions'
  ],
  css: ['~/assets/styles/global.scss'],
  auth: {
    baseURL: process.env.AUTH_ORIGIN,
    provider: {
      addDefaultCallbackUrl: true,
      type: 'authjs'
    },
    globalAppMiddleware: {
      isEnabled: true
    }
  },
  vuetify: {
    vuetifyOptions: {
      theme: {
        defaultTheme: 'dark'
      }
    }
  },
  experimental: {
    noVueServer: true
  },
  nitro: {
    prerender: {
      crawlLinks: false,
      routes: ['/']
    },
    preset: 'aws-lambda',
    rollupConfig: {
      output: {
        sourcemap: false
      }
    }
  }
})
