<script setup lang="ts">
const { data, signOut } = useAuth()
const authButtonText = computed(() => !data.value ? 'Войти' : 'Выйти')

function handleAuth() {
  if (!data.value) navigateTo('/login')
  else signOut()
}

const modules = ['hots', 'wow']
</script>

<template>
  <div class="wrapper">
    <v-btn class="auth-button" @click="handleAuth">{{ authButtonText }}</v-btn>

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
}

.modules-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 24px;
}

.auth-button {
  position: absolute;
  top: 24px;
  right: 24px;
}
</style>
