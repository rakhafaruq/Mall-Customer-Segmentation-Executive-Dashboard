/**
 * AddCustomerForm.jsx
 * Modal form untuk menambah pelanggan baru.
 * Backend akan otomatis memprediksi persona via K-Means.
 */

import { useState } from 'react'
import { addCustomer } from '../api/client'

const INITIAL_FORM = {
  age:           '',
  gender:        'Male',
  income:        '',
  spending_score: '',
}

export default function AddCustomerForm({ onClose, onAdded }) {
  const [form, setForm]       = useState(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState(null) // { type: 'success'|'error'|'warning', msg, persona }

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setResult(null) // reset result on change
  }

  // Tutup modal jika klik backdrop
  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const payload = {
        age:           parseInt(form.age, 10),
        gender:        form.gender,
        income:        parseFloat(form.income),
        spending_score: parseFloat(form.spending_score),
      }

      const res = await addCustomer(payload)

      if (res.error) {
        // 409 Conflict — pelanggan sudah ada
        setResult({
          type: 'warning',
          msg: res.error,
          persona: res.persona,
        })
      } else {
        setResult({
          type: 'success',
          msg: 'Pelanggan berhasil ditambahkan!',
          persona: res.persona,
        })
        // Tunggu sebentar agar user bisa lihat hasilnya, lalu refresh
        setTimeout(() => onAdded(), 1800)
      }
    } catch {
      setResult({
        type: 'error',
        msg: 'Tidak dapat terhubung ke server. Pastikan backend berjalan.',
      })
    } finally {
      setLoading(false)
    }
  }

  const resultConfig = {
    success: { icon: '✅', label: 'Berhasil' },
    warning: { icon: '⚠️', label: 'Duplikat' },
    error:   { icon: '❌', label: 'Error' },
  }

  return (
    <div
      className="modal-overlay"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal">
        {/* ── Header ─────────────────────────── */}
        <div className="modal-header">
          <div>
            <div id="modal-title" className="modal-title">➕ Tambah Pelanggan</div>
            <div className="modal-desc">
              Persona akan diprediksi otomatis melalui K-Means clustering
            </div>
          </div>
          <button
            id="modal-close-btn"
            className="modal-close"
            onClick={onClose}
            aria-label="Tutup modal"
            type="button"
          >
            ×
          </button>
        </div>

        {/* ── Form ───────────────────────────── */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            {/* Usia */}
            <div className="form-group">
              <label htmlFor="input-age" className="form-label">Usia</label>
              <input
                id="input-age"
                type="number"
                name="age"
                className="form-input"
                placeholder="cth. 28"
                min="1"
                max="120"
                step="1"
                value={form.age}
                onChange={handleChange}
                required
              />
              <span className="form-hint">Rentang: 1–120 tahun</span>
            </div>

            {/* Gender */}
            <div className="form-group">
              <label htmlFor="input-gender" className="form-label">Gender</label>
              <select
                id="input-gender"
                name="gender"
                className="form-select"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="Male">♂ Male</option>
                <option value="Female">♀ Female</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            {/* Income */}
            <div className="form-group">
              <label htmlFor="input-income" className="form-label">Income ($K)</label>
              <input
                id="input-income"
                type="number"
                name="income"
                className="form-input"
                placeholder="cth. 60"
                min="1"
                step="0.1"
                value={form.income}
                onChange={handleChange}
                required
              />
              <span className="form-hint">Pendapatan tahunan dalam ribuan USD</span>
            </div>

            {/* Spending Score */}
            <div className="form-group">
              <label htmlFor="input-score" className="form-label">Spending Score</label>
              <input
                id="input-score"
                type="number"
                name="spending_score"
                className="form-input"
                placeholder="cth. 50"
                min="1"
                max="100"
                step="1"
                value={form.spending_score}
                onChange={handleChange}
                required
              />
              <span className="form-hint">Skor 1–100 (mall scoring)</span>
            </div>
          </div>

          {/* ── Result Toast ───────────────────── */}
          {result && (
            <div className={`result-toast ${result.type}`}>
              <span style={{ fontSize: '1.1rem' }}>
                {resultConfig[result.type].icon}
              </span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.8125rem' }}>
                  {resultConfig[result.type].label}
                </div>
                <div style={{ fontSize: '0.8125rem', opacity: 0.85 }}>
                  {result.msg}
                  {result.persona && (
                    <span> — Persona: <strong>{result.persona}</strong></span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Actions ────────────────────────── */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Batal
            </button>
            <button
              id="btn-predict-simpan"
              type="submit"
              className="btn-primary"
              disabled={loading || result?.type === 'success'}
            >
              {loading
                ? '⏳ Memproses…'
                : result?.type === 'success'
                ? '✅ Tersimpan!'
                : '🎯 Prediksi & Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
