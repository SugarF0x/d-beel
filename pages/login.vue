<script setup lang="ts">
import { UserLogin } from "#components"

const { data } = useAuth()
const route = useRoute()

if (data.value) await navigateTo('/')

function getInviteCodeFromQuery() {
  const query = route.query.inviteCode
  const code = Array.isArray(query) ? query[0] : query
  return code ?? ''
}

const username = ref('')
const password = ref('')
const inviteCode = ref(getInviteCodeFromQuery())
const loading = ref(false)

const loginForm = ref<InstanceType<typeof UserLogin> | null>(null)

const tab = ref(Boolean(inviteCode.value))
const TABS = ['Вход', 'Регистрация']
</script>

<template>
  <div class="wrapper">
    <v-sheet class="card">
      <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="center" grow :disabled="loading">
        <v-tab v-for="tab in TABS" :value="tab">{{ tab }}</v-tab>
      </v-tabs>
      <v-window v-model="tab">
        <v-window-item :value="TABS[0]">
          <user-login
            ref="loginForm"
            v-model:username="username"
            v-model:password="password"
            v-model:loading="loading"
          />
        </v-window-item>
        <v-window-item :value="TABS[1]">
          <user-register
            v-model:username="username"
            v-model:password="password"
            v-model:invite-code="inviteCode"
            v-model:loading="loading"
            @success="loginForm?.login"
          />
        </v-window-item>
      </v-window>
    </v-sheet>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  form {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}

.header {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 8px;
}

.title {
  margin-bottom: 12px;
  text-align: center;
}

.card {
  border-radius: 16px;
  overflow: hidden;
}
</style>
