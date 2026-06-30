import { useState, useMemo } from 'react'

const PAGE_SIZE = 20
const ALL_PERSONAS = 'Semua Persona'

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

function scoreColor(score) {
  if (score >= 75) return '#10b981'
  if (score >= 50) return '#f59e0b'
  if (score >= 25) return '#06b6d4'
  return '#f43f5e'
}

function PageButtons({ page, totalPages, onPage }) {
  const MAX = 5
  let start = Math.max(1, page - Math.floor(MAX / 2))
  let end   = Math.min(totalPages, start + MAX - 1)
  if (end - start < MAX - 1) start = Math.max(1, end - MAX + 1)

  const pages = []
  for (let i = start; i <= end; i++) pages.push(i)

  const btnBase =
    'w-[31px] h-[31px] rounded-md border text-[0.8rem] font-medium cursor-pointer inline-flex items-center justify-center transition-all font-[inherit] leading-none disabled:opacity-35 disabled:cursor-not-allowed'
  const btnDefault =
    'border-slate-200 bg-white text-slate-500 hover:bg-violet-50 hover:border-violet-200 hover:text-violet-500'
  const btnActive =
    'bg-violet-500 border-violet-500 text-white shadow-[0_2px_8px_rgba(139,92,246,0.35)]'

  return (
    <div className="flex gap-1.5 flex-wrap">
      <button className={`${btnBase} ${btnDefault}`} onClick={() => onPage(1)}      disabled={page === 1}          title="Pertama">«</button>
      <button className={`${btnBase} ${btnDefault}`} onClick={() => onPage(page-1)} disabled={page === 1}          title="Sebelumnya">‹</button>

      {start > 1 && <span className="px-1 text-slate-400 self-center">…</span>}

      {pages.map(p => (
        <button
          key={p}
          className={`${btnBase} ${p === page ? btnActive : btnDefault}`}
          onClick={() => onPage(p)}
        >
          {p}
        </button>
      ))}

      {end < totalPages && <span className="px-1 text-slate-400 self-center">…</span>}

      <button className={`${btnBase} ${btnDefault}`} onClick={() => onPage(page+1)}      disabled={page === totalPages} title="Berikutnya">›</button>
      <button className={`${btnBase} ${btnDefault}`} onClick={() => onPage(totalPages)}  disabled={page === totalPages} title="Terakhir">»</button>
    </div>
  )
}

/**
 * @param {{ customers: object[], stats: object[] }} props
 * `stats` digunakan untuk membangun daftar filter persona secara dinamis
 * sesuai data aktual di DB — tidak lagi hardcoded.
 */
export default function CustomerTable({ customers, stats }) {
  const [selectedPersona, setSelectedPersona] = useState(ALL_PERSONAS)
  const [page, setPage]                       = useState(1)

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
    <div className="glass-card p-6">
      <div className="flex items-start justify-between mb-5 gap-4">
        <div>
          <div className="text-[0.9375rem] font-bold text-slate-900 mb-0.5 tracking-tight">
            📋 Data Pelanggan
          </div>
          <div className="text-xs text-slate-400">
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

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-slate-50 to-blue-50/50">
              <th className="px-4 py-3 text-left text-[0.6875rem] font-bold text-slate-500 uppercase tracking-[0.07em] border-b border-slate-200 whitespace-nowrap w-10">#</th>
              <th className="px-4 py-3 text-left text-[0.6875rem] font-bold text-slate-500 uppercase tracking-[0.07em] border-b border-slate-200 whitespace-nowrap">ID</th>
              <th className="px-4 py-3 text-left text-[0.6875rem] font-bold text-slate-500 uppercase tracking-[0.07em] border-b border-slate-200 whitespace-nowrap">Usia</th>
              <th className="px-4 py-3 text-left text-[0.6875rem] font-bold text-slate-500 uppercase tracking-[0.07em] border-b border-slate-200 whitespace-nowrap">Gender</th>
              <th className="px-4 py-3 text-left text-[0.6875rem] font-bold text-slate-500 uppercase tracking-[0.07em] border-b border-slate-200 whitespace-nowrap">Income</th>
              <th className="px-4 py-3 text-left text-[0.6875rem] font-bold text-slate-500 uppercase tracking-[0.07em] border-b border-slate-200 whitespace-nowrap">Spending Score</th>
              <th className="px-4 py-3 text-left text-[0.6875rem] font-bold text-slate-500 uppercase tracking-[0.07em] border-b border-slate-200 whitespace-nowrap">Persona</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-slate-400 text-sm">
                  Tidak ada data pelanggan untuk persona ini.
                </td>
              </tr>
            ) : paginated.map((c, i) => (
              <tr key={c.id} className="border-b border-slate-50 last:border-0 hover:bg-violet-500/[.03] transition-colors">
                <td className="px-4 py-[0.8125rem] text-[0.8rem] font-medium text-slate-300 align-middle">
                  {startRow + i}
                </td>
                <td className="px-4 py-[0.8125rem] text-[0.8125rem] font-bold text-violet-700 align-middle">
                  #{c.id}
                </td>
                <td className="px-4 py-[0.8125rem] text-sm text-slate-900 align-middle">
                  {c.age} th
                </td>
                <td className="px-4 py-[0.8125rem] align-middle">
                  <span className={`inline-flex items-center gap-1 text-[0.8125rem] font-medium ${c.gender === 'Male' ? 'text-violet-700' : 'text-pink-600'}`}>
                    {c.gender === 'Male' ? '♂' : '♀'} {c.gender}
                  </span>
                </td>
                <td className="px-4 py-[0.8125rem] text-sm font-medium text-slate-900 align-middle">
                  ${c.income}K
                </td>
                <td className="px-4 py-[0.8125rem] align-middle">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-[5px] rounded-[3px] flex-shrink-0 opacity-75"
                      style={{
                        width: `${Math.min(c.spending_score, 100) * 0.7}px`,
                        background: scoreColor(c.spending_score),
                      }}
                    />
                    <span className="text-sm font-semibold min-w-[24px]">{c.spending_score}</span>
                  </div>
                </td>
                <td className="px-4 py-[0.8125rem] align-middle">
                  <span className={getBadgeClass(c.persona)}>
                    {c.persona?.trim()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-[1.125rem] pt-[1.125rem] border-t border-slate-100 flex-wrap gap-3">
          <span className="text-[0.8125rem] text-slate-400">
            Halaman <strong className="text-slate-600">{page}</strong> dari <strong className="text-slate-600">{totalPages}</strong>
            {' '}({filtered.length} total)
          </span>
          <PageButtons page={page} totalPages={totalPages} onPage={handlePage} />
        </div>
      )}
    </div>
  )
}
