// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  modules: [
    '@sidebase/nuxt-auth',
    '@invictus.codes/nuxt-vuetify'
  ],
  auth: {
    provider: {
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
    preset: 'aws-lambda',
    rollupConfig: {
      output: {
        sourcemap: false
      }
    }
  }
})
