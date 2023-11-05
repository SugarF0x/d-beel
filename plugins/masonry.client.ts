import { VueMasonryPlugin } from 'vue-masonry'

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(VueMasonryPlugin)
})
