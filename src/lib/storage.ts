// JSON.parse returns `any`; the caller owns the type contract for T
export const storageGet = <T>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key)
    if (item === null) return null
    return JSON.parse(item) as T
  } catch {
    return null
  }
}

export const storageSet = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const storageRemove = (key: string): void => {
  localStorage.removeItem(key)
}
