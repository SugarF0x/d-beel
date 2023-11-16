<script setup lang="ts">
import { format } from 'date-fns'
import { hotsRatingColors } from "~/const/hots/colors"
import type { HotsPost } from "~/server/api/hots/index.get"
import emojiShortcutToImageUrlMap from "~/const/hots/emojiShortcutToImageUrlMap"
import EmojiSelector from "~/components/Hots/EmojiSelector.vue"

const emit = defineEmits<{
  (e: 'reaction-update', p: {
    emoji: string,
    add: boolean,
    username: string,
    created_at: string
  }): void
}>()

const props = defineProps<HotsPost & {
  preview?: boolean
}>()

const { data: authData } = useAuth()

const isEmojiSelectorOpen = ref(false)

const ownEmoji = computed(() => {
  if (!authData.value) return []

  const shortcuts: string[] = []

  for (const shortcut in props.reactions ?? {}) {
    if (props.reactions?.[shortcut].includes(authData.value.user.username)) shortcuts.push(shortcut)
  }

  return shortcuts
})

const isLoading = ref(false)
async function react(emoji: string) {
  isLoading.value = true

  const shouldAdd = !ownEmoji.value.includes(emoji)
  const result = await $fetch('/api/hots', {
    method: 'PUT',
    body: {
      type: 'reaction',
      username: props.username,
      created_at: props.created_at,
      reaction: emoji,
      shouldAdd
    }
  })

  if (result) emit('reaction-update', {
    emoji,
    add: shouldAdd,
    username: props.username,
    created_at: props.created_at
  })

  isLoading.value = false
}

function gotoAuthor() {
  if (props.created_by) navigateTo(`/profile/${props.created_by}`)
}
</script>

<template>
  <div class="hots-post">
    <v-img class="banner" :src="`/img/hots/heroes/banner/${String(hero)}.jpg`" />

    <div class="container">
      <div class="info">
        <h2>{{ username }}</h2>
        <table>
          <tr>
            <th>Автор</th>
            <td @click="gotoAuthor" :class="{ clickable: Boolean(created_by) }">
              {{ created_by ?? "-" }}
            </td>
          </tr>
          <tr>
            <th>Дата публикации</th>
            <td>{{ format(new Date(created_at), 'dd.MM.yyyy') }}</td>
          </tr>
        </table>
      </div>

      <p class="comment">
        {{ comment }}
      </p>

      <v-rating class="rating" :readonly="true" :model-value="rating" :color="hotsRatingColors[rating]" />

      <div v-if="!preview" class="reactions">
        <button
          v-if="authData"
          :disabled="isLoading"
          class="reaction new"
          @click="isEmojiSelectorOpen = true"
        >
          <v-icon icon="mdi-plus-circle-outline" />
        </button>

        <button
          v-for="[shortcut, authors] of Object.entries(reactions ?? {})"
          :key="shortcut"
          :class="{ authored: authors.includes(authData?.user?.username ?? ''), loading: isLoading }"
          :disabled="!authData || isLoading"
          class="reaction"
          @click="react(shortcut)"
        >
          <v-img height="32" width="32" :src="emojiShortcutToImageUrlMap[shortcut]" />
          {{ authors.length }}
        </button>
      </div>

      <div class="loader-container">
        <v-progress-linear height="1" v-show="isLoading" :indeterminate="true" />
      </div>
    </div>

    <emoji-selector
      v-if="isEmojiSelectorOpen"
      class="emoji-selector"
      :selected-emoji="ownEmoji"
      @select="react"
      @hide="isEmojiSelectorOpen = false"
    />
  </div>
</template>

<style scoped lang="scss">
.hots-post {
  box-shadow: 0 0 15px 6px rgba(0,0,0,.4);
  border: 1px solid rgba(153,204,255,.2);
  background-color: #0a1133;
  position: relative;
}

.emoji-selector {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 16px;
}

.reactions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  margin: 0 8px;
}

.loader-container {
  margin-top: 8px;
  height: 1px;
}

.reaction {
  border-radius: 48px;
  background-color: rgba(153,204,255,.2);
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 8px;
  border: 1px solid transparent;
  transition: .1s ease-in-out;
  transform: scale(1);
  user-select: none;

  &.loading {
    opacity: .5;
  }

  &.authored {
    border-color: rgba(210, 252, 255, 0.8);
  }

  &.new {
    padding: 4px;
    opacity: .5;
  }

  &:not(:disabled) {
    &:hover {
      border-color: rgba(210, 252, 255, 0.3)
    }

    &:active {
      transform: scale(.95);
    }

    &.authored {
      &:hover {
        border-color: rgba(210, 252, 255, 1);
      }
    }

    &.new {
      &:hover {
        opacity: 1;
      }

      &:active {
        opacity: .8;
      }
    }
  }
}

.container {
  position: relative;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
}

.rating {
  align-self: center;
}

.info {
  position: absolute;
  width: 100%;
  bottom: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  table {
    border: 1px solid #5266cc;
    background-color: rgba(10,17,51,.9);

    border-spacing: 0;

    th, td {
      text-align: left;
      padding: 0 10px;
    }

    tr:not(:last-child) {
      th, td {
        border-bottom: 1px solid #5266cc;
      }
    }

    th {
      border-right: 1px solid #5266cc;
    }
  }
}

.comment {
  padding: 20px 20px 0 20px;
}

.banner {
  aspect-ratio: 600 / 400;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: -webkit-gradient(
        linear, left bottom, left top,
        color-stop(25%,rgba(30,92,153,.6)),
        color-stop(35%,rgba(30, 92, 153, .4)),
        color-stop(50%,rgba(30,92,153,.2)),
        to(rgba(41,102,163,0))
    )
  }
}

.clickable {
  user-select: none;
  cursor: pointer;
}
</style>
