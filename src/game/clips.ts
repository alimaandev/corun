const DB_NAME = 'code_run_clips'
const DB_VERSION = 1
const STORE = 'clips'

interface ClipRecord {
  id?: number
  blob: Blob
  score: number
  date: string
  url?: string
}

let createdUrls: string[] = []

function revokeStaleUrls() {
  createdUrls.forEach(u => URL.revokeObjectURL(u))
  createdUrls = []
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function saveClip(blob: Blob, score: number): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).add({ blob, score, date: new Date().toISOString() })
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function getAllClips(): Promise<ClipRecord[]> {
  revokeStaleUrls()
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).getAll()
    req.onsuccess = () => {
      const records = req.result as ClipRecord[]
      records.forEach(r => {
        r.url = URL.createObjectURL(r.blob)
        createdUrls.push(r.url!)
      })
      resolve(records.reverse())
    }
    req.onerror = () => reject(req.error)
  })
}

export async function deleteClip(id: number): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).delete(id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export function downloadClip(blob: Blob, score: number) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `coderun-${score}pts-${Date.now()}.webm`
  a.click()
  URL.revokeObjectURL(url)
}
