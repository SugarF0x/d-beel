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

    <h1>Дебильные модули:</h1>
    <div class="modules-container">
      <app-card-tilt v-for="module of modules" :key="module" @click="navigateTo(`/${module}`)">
        <v-img :src="`/img/${module}/logo.png`" width="128" height="128" />
      </app-card-tilt>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  gap: 24px;

  nav {
    position: absolute;
    top: 24px;
    right: 24px;
    display: flex;
    flex-direction: row;
    gap: 8px;
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
