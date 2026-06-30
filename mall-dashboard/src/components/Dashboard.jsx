import { useState, useEffect, useCallback } from 'react'
import { fetchCustomers, fetchStats } from '../api/client'
import KpiCards from './KpiCards'
import ChartPersona from './ChartPersona'
import ChartGender from './ChartGender'
import ChartAge from './ChartAge'
import CustomerTable from './CustomerTable'
import AddCustomerForm from './AddCustomerForm'


export default function Dashboard() {
  const [customers, setCustomers] = useState([])
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const [cust, st] = await Promise.all([fetchCustomers(), fetchStats()])
      setCustomers(cust)
      setStats(st)
    } catch (err) {
      console.error('[Dashboard] Gagal memuat data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const handleCustomerAdded = useCallback(() => {
    setShowModal(false)
    loadData()
  }, [loadData])

  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <>
      <nav className="sticky top-0 z-[200] h-[66px] bg-white/[.88] backdrop-blur-xl border-b border-violet-400/[.12] shadow-[0_1px_24px_rgba(99,102,241,0.06)] px-8 flex items-center justify-between md:px-8 max-md:px-4">
        <div className="flex items-center gap-3.5">
          <div className="w-[38px] h-[38px] bg-gradient-to-br from-violet-500 to-violet-700 rounded-[11px] flex items-center justify-center text-[19px] flex-shrink-0 shadow-[0_4px_12px_rgba(139,92,246,0.35)]">
            🛍️
          </div>
          <div>
            <span className="text-base font-bold text-slate-900 tracking-tight block leading-tight">
              Mall Segmentation
            </span>
            <span className="text-[0.7rem] text-slate-400 font-normal block">
              Customer Analytics Dashboard
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[0.8125rem] text-slate-400 font-normal max-md:hidden">
            {today}
          </span>
          <button
            id="btn-tambah-pelanggan"
            className="btn-primary"
            onClick={() => setShowModal(true)}
          >
            ＋&nbsp;Tambah Pelanggan
          </button>
        </div>
      </nav>

      <main className="max-w-[1500px] mx-auto px-8 pt-7 pb-12 max-md:px-4 max-md:pt-5 max-md:pb-8">
        <div className="flex items-start justify-between mb-7 gap-4 max-[540px]:flex-col">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Overview Segmentasi Pelanggan
            </h1>
            <p className="text-sm text-slate-400 mt-1.5 font-normal">
              Analisis distribusi {customers.length} pelanggan berdasarkan 5 klaster persona K-Means
            </p>
          </div>

          {!loading && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-emerald-100 text-emerald-700 border border-emerald-300 flex-shrink-0">
              <span className="w-[7px] h-[7px] rounded-full bg-emerald-500 animate-pulse-dot" />
              Live Data
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="w-11 h-11 border-[3px] border-violet-100 border-t-violet-500 rounded-full animate-spin" />
            <span className="text-[0.9375rem] font-medium text-slate-500">
              Memuat data dari server…
            </span>
          </div>
        ) : (
          <>
            <KpiCards customers={customers} stats={stats} />

            <div className="grid grid-cols-[2fr_1.2fr_1.2fr] gap-5 mb-6 max-[1280px]:grid-cols-2 [&>*:first-child]:max-[1280px]:col-span-2 max-md:grid-cols-1 [&>*:first-child]:max-md:col-span-1">
              <ChartPersona stats={stats} />
              <ChartGender customers={customers} />
              <ChartAge customers={customers} />
            </div>

            <CustomerTable customers={customers} stats={stats} />
          </>
        )}
      </main>

      {showModal && (
        <AddCustomerForm
          onClose={() => setShowModal(false)}
          onAdded={handleCustomerAdded}
        />
      )}
    </>
  )
}
