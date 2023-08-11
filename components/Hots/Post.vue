<script setup lang="ts">
import { format } from 'date-fns'
import { hotsRatingColors } from "~/const/hots/colors"
import type { HotsPost } from "~/server/api/hots/index.get"
import emojiShortcutToImageUrlMap from "~/const/hots/emojiShortcutToImageUrlMap"

defineProps<HotsPost & {
  preview?: boolean
}>()

const { data: authData } = useAuth()
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
            <td>{{ created_by ?? "легаси" }}</td>
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
        <button v-if="authData" class="reaction new">
          <v-icon icon="mdi-plus-circle-outline" />
        </button>

        <button
          v-for="[shortcut, authors] of Object.entries(reactions ?? {})"
          :key="shortcut"
          :class="{ authored: authors.includes(authData?.user.username) }"
          :disabled="!authData"
          class="reaction"
        >
          <v-img :src="emojiShortcutToImageUrlMap[shortcut]" />
          {{ authors.length }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.hots-post {
  box-shadow: 0 0 15px 6px rgba(0,0,0,.4);
  border: 1px solid rgba(153,204,255,.2);
  background-color: #0a1133;
  position: relative;
}

.reactions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  margin: 0 8px 8px 8px;
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
</style>
