export default function (callback: () => void | Promise<void>) {
  /**
   * this is a hacky fix to layout suspense child double render
   * issue is within vue router and has been open for 2 years
   * :(
   */

  const didUnmount = ref(false)
  onUnmounted(() => { didUnmount.value = true })

  onMounted(() => {
    nextTick(() => {
      if (!didUnmount.value) callback()
    })
  })
}
