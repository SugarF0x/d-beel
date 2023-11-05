import { VueMasonryPlugin } from 'vue-masonry'

// TODO: make a plugin to create web-types file with directives on demand? question mark?
//   e.g. add to Plugin object a new entity 'webTypes' with .directive.add() method that
//   would collect all the directives from all possible plugins and shove them all into the ./web-types.json

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.use(VueMasonryPlugin)
})
