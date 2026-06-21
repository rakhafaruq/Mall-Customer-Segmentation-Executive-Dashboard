/**
 * api/client.js
 * Semua fungsi fetch ke backend Express (localhost:3001)
 */

const BASE_URL = 'http://localhost:3001'

/** Ambil semua pelanggan, atau filter by persona */
export async function fetchCustomers(persona = null) {
  const url = persona
    ? `${BASE_URL}/customers?persona=${encodeURIComponent(persona)}`
    : `${BASE_URL}/customers`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Gagal mengambil data pelanggan (${res.status})`)
  return res.json()
}

/** Ambil statistik agregat per persona dari /stats */
export async function fetchStats() {
  const res = await fetch(`${BASE_URL}/stats`)
  if (!res.ok) throw new Error(`Gagal mengambil statistik (${res.status})`)
  return res.json()
}

/**
 * Tambah pelanggan baru — backend akan auto-prediksi persona via K-Means
 * @param {{ age: number, gender: string, income: number, spending_score: number }} data
 */
export async function addCustomer(data) {
  const res = await fetch(`${BASE_URL}/customers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  // Kembalikan JSON apapun statusnya (bisa 409 conflict, dll)
  return res.json()
}
