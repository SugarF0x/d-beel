<script setup lang="ts">
const { data, signOut } = useAuth()

const authButtonText = computed(() => !data.value ? 'Войти' : 'Выйти')

function handleAuth() {
  if (!data.value) navigateTo('/login')
  else signOut()
}
</script>

<template>
  <div class="wrapper">
    <v-btn class="auth-button" @click="handleAuth">{{ authButtonText }}</v-btn>

    <app-card-tilt @click="navigateTo('/hots')">
      <v-img src="/img/hots/logo.png" width="128" height="128" />
    </app-card-tilt>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  flex: 1;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.auth-button {
  position: absolute;
  top: 24px;
  right: 24px;
}
</style>
