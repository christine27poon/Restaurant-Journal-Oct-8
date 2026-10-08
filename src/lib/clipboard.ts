/**
 * Copies text, tolerating browsers that refuse the async Clipboard API (e.g. Safari after an
 * await, or an unfocused document). Accepts a promise so the write can start inside the click
 * handler while the value is still loading. Returns whether the copy worked.
 */
export async function copyText(value: string | Promise<string>): Promise<boolean> {
  try {
    if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
      const text = Promise.resolve(value).then((v) => new Blob([v], { type: 'text/plain' }))
      await navigator.clipboard.write([new ClipboardItem({ 'text/plain': text })])
      return true
    }
    await navigator.clipboard.writeText(await value)
    return true
  } catch {
    // fall through to the legacy path
  }
  try {
    const text = await value
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    const ok = document.execCommand('copy')
    area.remove()
    return ok
  } catch {
    return false
  }
}
