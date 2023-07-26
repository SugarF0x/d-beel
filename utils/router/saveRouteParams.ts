export default function () {
  /**
   * useUrlSearchParams does not write for some reason, gotta sync manually
   */
  void useRouter().replace(window.location.pathname + (window.location.search ?? ''))
}
