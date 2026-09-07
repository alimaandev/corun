const BUILD_ID_KEY = 'corun_build_id'
const BUILD_URL = '/build.json'

// Called on app boot and when the tab becomes visible again. If the
// deployed build id differs from the one this page loaded with, the
// page holds stale precached chunks — reload to pick up the new build.
export async function checkForUpdate(): Promise<void> {
  try {
    const res = await fetch(BUILD_URL, { cache: 'no-store' })
    if (!res.ok) return
    const meta = (await res.json()) as { id?: string }
    if (!meta.id) return
    const known = sessionStorage.getItem(BUILD_ID_KEY)
    if (known && known !== meta.id) {
      sessionStorage.setItem(BUILD_ID_KEY, meta.id)
      window.location.reload()
      return
    }
    sessionStorage.setItem(BUILD_ID_KEY, meta.id)
  } catch {
    // Offline or no network — skip the check.
  }
}
