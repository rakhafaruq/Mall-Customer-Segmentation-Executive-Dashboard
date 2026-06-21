import { useState, useEffect, useCallback } from 'react'
import { fetchCustomers, fetchStats } from '../api/client'
import KpiCards from './KpiCards'
import ChartPersona from './ChartPersona'
import ChartGender from './ChartGender'
import ChartAge from './ChartAge'
import CustomerTable from './CustomerTable'
import AddCustomerForm from './AddCustomerForm'

/**
 * Dashboard — komponen root yang meng-orkestrasi fetch data
 * dan menyebarkan state ke semua child component.
 */
export default function Dashboard() {
  const [customers, setCustomers] = useState([])
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  // Muat data dari backend
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

  // Format tanggal Indonesia
  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <>
      {/* ── Navbar ─────────────────────────────────────────── */}
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="navbar-logo">🛍️</div>
          <div>
            <span className="navbar-title">Mall Segmentation</span>
            <span className="navbar-subtitle">Customer Analytics Dashboard</span>
          </div>
        </div>

        <div className="navbar-actions">
          <span className="navbar-date">{today}</span>
          <button
            id="btn-tambah-pelanggan"
            className="btn-primary"
            onClick={() => setShowModal(true)}
          >
            ＋&nbsp;Tambah Pelanggan
          </button>
        </div>
      </nav>

      {/* ── Main Content ───────────────────────────────────── */}
      <main className="dashboard-layout">
        {/* Page header */}
        <div className="dashboard-title-row">
          <div>
            <h1 className="dashboard-heading">Overview Segmentasi Pelanggan</h1>
            <p className="dashboard-subheading">
              Analisis distribusi {customers.length} pelanggan berdasarkan 5 klaster persona K-Means
            </p>
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner" />
            <span className="loading-text">Memuat data dari server…</span>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <KpiCards customers={customers} stats={stats} />

            {/* Charts */}
            <div className="charts-grid">
              <ChartPersona stats={stats} />
              <ChartGender customers={customers} />
              <ChartAge customers={customers} />
            </div>

            {/* Data Table — terima stats untuk daftar filter persona dinamis */}
            <CustomerTable customers={customers} stats={stats} />
          </>
        )}
      </main>

      {/* ── Modal Tambah Pelanggan ─────────────────────────── */}
      {showModal && (
        <AddCustomerForm
          onClose={() => setShowModal(false)}
          onAdded={handleCustomerAdded}
        />
      )}
    </>
  )
}
