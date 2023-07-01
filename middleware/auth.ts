export default defineNuxtRouteMiddleware((to) => {
  const { status } = useAuth()
  const isSignedIn = status.value === 'authenticated'

  if (!isSignedIn && to.path !== '/login') return navigateTo('/login')
  if (isSignedIn && to.path === '/login') return navigateTo('/')
})
