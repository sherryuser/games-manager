// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  typescript: {
    strict: true
  },
  app: {
    head: {
      title: 'Games List Manager',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#13151e' }
      ]
    }
  }
})