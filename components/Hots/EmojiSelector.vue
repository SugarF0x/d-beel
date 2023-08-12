<script setup lang="ts">
import emojiFuzzySearch from "~/const/hots/emojiFuzzySearch"
import emojiShortcutToImageUrlMap from "~/const/hots/emojiShortcutToImageUrlMap"

defineProps<{ selectedEmoji: string[] }>()
const emit = defineEmits<{
  (e: 'click', emoji: string): void
  (e: 'hide'): void
}>()

const wrapper = ref()
onClickOutside(wrapper, close)

const isVisible = ref(false)
onMounted(() => { isVisible.value = true })

function search(pattern: string): string[] {
  return emojiFuzzySearch.search(pattern).slice(0, 25).map(e => e.item)
}

const emojiPool = ref(search(':'))

const searchValue = ref('')
watchDebounced(searchValue, val => { emojiPool.value = search(val || ':') }, { debounce: 250, maxWait: 1000 })

function close() {
  if (!isVisible.value) return

  isVisible.value = false
  setTimeout(() => { emit('hide') }, 500)
}

function select(emoji: string) {
  emit('click', emoji)
  close()
}
</script>

<template>
  <div
    ref="wrapper"
    class="emoji-selector"
    :class="{ visible: isVisible }"
  >
    <div class="pool">
      <button
        v-for="emoji of emojiPool"
        :key="emoji"
        :class="{ selected: selectedEmoji.includes(emoji) }"
        class="emoji"
        @click="select(emoji)"
      >
        <v-img :src="emojiShortcutToImageUrlMap[emoji]" width="50" height="50" />
      </button>
    </div>

    <v-text-field
      v-model="searchValue"
      density="compact"
      label="тег"
      placeholder=":orhpeameh:"
      hide-details
    />
  </div>
</template>

<style scoped lang="scss">
.emoji-selector {
  background-color: #0a1133;
  box-shadow: 0 0 15px 6px rgba(0,0,0,.4);
  border: 1px solid rgba(153,204,255,.2);
  padding: 8px;
  opacity: 0;
  transition: .5s ease-in-out;
  display: flex;
  flex-direction: column;

  &.visible {
    opacity: 1;
  }
}

.pool {
  flex: 1;
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  justify-content: space-between;
}

.emoji {
  border-radius: 50%;
  transition: .1s ease-in-out;
  background-color: transparent;
  border: 1px solid transparent;
  transform: scale(1);

  &:active {
    transform: scale(.95);
  }

  &:hover {
    background-color: rgba(153,204,255,.1);
    border-color: rgba(153,204,255,.2);
  }

  &.selected {
    background-color: rgba(153,204,255,.1);
    border-color: rgba(153,204,255,.2);

    &:hover {
      background-color: rgba(153,204,255,.2);
      border-color: rgba(153,204,255,.1);
    }
  }
}
</style>
