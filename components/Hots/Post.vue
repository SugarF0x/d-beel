<script setup lang="ts">
import { HotsPostRow } from "~/server/ydb/tables/hots_post"
import { format } from 'date-fns'
import { hotsRatingColors } from "~/const/hots/colors"

defineProps<HotsPostRow>()
</script>

<template>
  <div class="hots-post">
    <v-img class="banner" :src="`/img/hots/heroes/banner/${String(hero)}.jpg`" />

    <div class="container">
      <div class="info">
        <h2>{{ username }}</h2>
        <table>
          <tr>
            <th>Герой</th>
            <td>{{ hero ?? "???" }}</td>
          </tr>
          <tr>
            <th>Автор</th>
            <td>{{ created_by ?? "???" }}</td>
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
    </div>
  </div>
</template>

<style scoped lang="scss">
.hots-post {
  box-shadow: 0 0 15px 6px rgba(0,0,0,.4);
  border: 1px solid rgba(153,204,255,.2);
  background-color: #0a1133;
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
