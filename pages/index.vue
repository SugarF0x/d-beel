<script setup lang="ts">
const { data, signOut } = useAuth()
const username = computed(() => data.value?.user?.username)

const authButtonText = computed(() => !username.value ? 'Войти' : 'Выйти')

function handleAuth() {
  if (!data.value) navigateTo('/login')
  else signOut()
}

const modules = ['hots', 'wow']
</script>

<template>
  <div class="wrapper">
    <nav>
      <v-btn v-if="username" :to="`/profile/${username}`">Профиль</v-btn>
      <v-btn @click="handleAuth">{{ authButtonText }}</v-btn>
    </nav>

    <div class="title">
      <h1>Реестр дебилов</h1>
      <h2>По версии #фрупывке</h2>
    </div>

    <v-container class="container">
      <app-card-tilt v-for="module of modules" :key="module" @click="navigateTo(`/${module}`)">
        <v-img :src="`/img/${module}/logo.png`" width="128" height="128" />
      </app-card-tilt>
    </v-container>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  nav {
    position: absolute;
    top: 24px;
    right: 24px;
    display: flex;
    flex-direction: row;
    gap: 8px;
  }
}

.container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
}

.title {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 96px;

  h2 {
    opacity: .5;
  }
}

.modules-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 24px;
}
</style>
