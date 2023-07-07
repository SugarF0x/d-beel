export const useSignInCallbackUrl = () => {
  const route = useRoute()

  return computed(() => {
    const callbackUrlParam = route.query.callbackUrl
    return typeof callbackUrlParam === "string" && callbackUrlParam.length > 0 ? callbackUrlParam : "/"
  })
}
