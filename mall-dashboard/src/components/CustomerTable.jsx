/**
 * CustomerTable.jsx
 * Tabel data pelanggan dengan:
 * - Filter dropdown persona (di-derive dari data aktual via stats)
 * - Pagination 20 baris per halaman
 * - Badge berwarna per persona
 * - Spending score bar visual
 */

import { useState, useMemo } from 'react'

const PAGE_SIZE = 20
const ALL_PERSONAS = 'Semua Persona'

/* ── Badge style map ─────────────────────── */
const BADGE_MAP = {
  'Target Utama (VIP)': 'badge badge-vip',
  'Pelanggan Standar':  'badge badge-standar',
  'Implusif':           'badge badge-implusif',
  'Hemat/Konservatif':  'badge badge-hemat',
  'Sensitif Harga':     'badge badge-sensitif',
}

function getBadgeClass(persona) {
  return BADGE_MAP[persona?.trim()] ?? 'badge badge-standar'
}

/* ── Spending score bar color ────────────── */
function scoreColor(score) {
  if (score >= 75) return '#10b981'
  if (score >= 50) return '#f59e0b'
  if (score >= 25) return '#06b6d4'
  return '#f43f5e'
}

/* ── Pagination buttons ─────────────────── */
function PageButtons({ page, totalPages, onPage }) {
  const MAX = 5
  let start = Math.max(1, page - Math.floor(MAX / 2))
  let end   = Math.min(totalPages, start + MAX - 1)
  if (end - start < MAX - 1) start = Math.max(1, end - MAX + 1)

  const pages = []
  for (let i = start; i <= end; i++) pages.push(i)

  return (
    <div className="pagination-buttons">
      <button className="page-btn" onClick={() => onPage(1)} disabled={page === 1} title="Pertama">«</button>
      <button className="page-btn" onClick={() => onPage(page - 1)} disabled={page === 1} title="Sebelumnya">‹</button>

      {start > 1 && <span style={{ padding: '0 4px', color: '#94a3b8', alignSelf: 'center' }}>…</span>}

      {pages.map(p => (
        <button
          key={p}
          className={`page-btn${p === page ? ' active' : ''}`}
          onClick={() => onPage(p)}
        >
          {p}
        </button>
      ))}

      {end < totalPages && <span style={{ padding: '0 4px', color: '#94a3b8', alignSelf: 'center' }}>…</span>}

      <button className="page-btn" onClick={() => onPage(page + 1)} disabled={page === totalPages} title="Berikutnya">›</button>
      <button className="page-btn" onClick={() => onPage(totalPages)} disabled={page === totalPages} title="Terakhir">»</button>
    </div>
  )
}

/* ── Main Component ─────────────────────── */
/**
 * @param {{ customers: object[], stats: object[] }} props
 * `stats` digunakan untuk membangun daftar filter persona secara dinamis
 * sesuai data aktual di DB — tidak lagi hardcoded.
 */
export default function CustomerTable({ customers, stats }) {
  const [selectedPersona, setSelectedPersona] = useState(ALL_PERSONAS)
  const [page, setPage]                       = useState(1)

  // Buat daftar pilihan persona dari stats (server-side) agar selalu sinkron dengan DB
  const personaOptions = useMemo(() => {
    const fromStats = stats.map(s => s.persona.trim()).filter(Boolean)
    return [ALL_PERSONAS, ...fromStats]
  }, [stats])

  // Filter dengan trim() defensif agar tidak ada mismatch whitespace
  const filtered = useMemo(() => {
    if (selectedPersona === ALL_PERSONAS) return customers
    return customers.filter(c => c.persona?.trim() === selectedPersona)
  }, [customers, selectedPersona])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page],
  )

  function handlePersonaChange(e) {
    setSelectedPersona(e.target.value)
    setPage(1)
  }

  function handlePage(p) {
    setPage(Math.max(1, Math.min(totalPages, p)))
  }

  const startRow = filtered.length > 0 ? (page - 1) * PAGE_SIZE + 1 : 0
  const endRow   = Math.min(page * PAGE_SIZE, filtered.length)

  return (
    <div className="glass-card table-card">
      {/* ── Header ─────────────────────────── */}
      <div className="table-header">
        <div>
          <div className="chart-title">📋 Data Pelanggan</div>
          <div className="chart-subtitle">
            {filtered.length > 0
              ? `Menampilkan ${startRow}–${endRow} dari ${filtered.length} pelanggan`
              : 'Tidak ada data untuk filter ini'}
          </div>
        </div>
        <select
          id="filter-persona"
          className="filter-select"
          value={selectedPersona}
          onChange={handlePersonaChange}
          aria-label="Filter berdasarkan persona"
        >
          {personaOptions.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* ── Table ──────────────────────────── */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th style={{ width: 40 }}>#</th>
              <th>ID</th>
              <th>Usia</th>
              <th>Gender</th>
              <th>Income</th>
              <th>Spending Score</th>
              <th>Persona</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} style={{
                  textAlign: 'center', padding: '2.5rem',
                  color: '#94a3b8', fontSize: '0.875rem',
                }}>
                  Tidak ada data pelanggan untuk persona ini.
                </td>
              </tr>
            ) : paginated.map((c, i) => (
              <tr key={c.id}>
                <td style={{ color: '#cbd5e1', fontSize: '0.8rem', fontWeight: 500 }}>
                  {startRow + i}
                </td>
                <td style={{ fontWeight: 700, color: '#6d28d9', fontSize: '0.8125rem' }}>
                  #{c.id}
                </td>
                <td>{c.age} th</td>
                <td>
                  <span className={`gender-chip ${c.gender === 'Male' ? 'male' : 'female'}`}>
                    {c.gender === 'Male' ? '♂' : '♀'} {c.gender}
                  </span>
                </td>
                <td style={{ fontWeight: 500 }}>${c.income}K</td>
                <td>
                  <div className="score-bar-wrap">
                    <div
                      className="score-bar"
                      style={{
                        width: `${Math.min(c.spending_score, 100) * 0.7}px`,
                        background: scoreColor(c.spending_score),
                        opacity: 0.75,
                      }}
                    />
                    <span style={{ fontWeight: 600, minWidth: 24 }}>{c.spending_score}</span>
                  </div>
                </td>
                <td>
                  <span className={getBadgeClass(c.persona)}>
                    {c.persona?.trim()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ─────────────────────── */}
      {totalPages > 1 && (
        <div className="pagination">
          <span className="pagination-info">
            Halaman <strong>{page}</strong> dari <strong>{totalPages}</strong>
            {' '}({filtered.length} total)
          </span>
          <PageButtons page={page} totalPages={totalPages} onPage={handlePage} />
        </div>
      )}
    </div>
  )
}
