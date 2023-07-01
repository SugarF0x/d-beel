// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@sidebase/nuxt-auth',
    '@invictus.codes/nuxt-vuetify'
  ],
  auth: {
    provider: {
      type: 'authjs'
    }
  }
})
