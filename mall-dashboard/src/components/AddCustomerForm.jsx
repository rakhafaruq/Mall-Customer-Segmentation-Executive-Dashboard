import { useState } from 'react'
import { addCustomer } from '../api/client'

const INITIAL_FORM = {
  age:            '',
  gender:         'Male',
  income:         '',
  spending_score: '',
}

const TOAST_STYLES = {
  success: 'bg-emerald-100 text-emerald-800 border border-emerald-300',
  error:   'bg-rose-100 text-rose-700 border border-rose-300',
  warning: 'bg-amber-100 text-amber-700 border border-amber-300',
}

const RESULT_CONFIG = {
  success: { icon: '✅', label: 'Berhasil' },
  warning: { icon: '⚠️', label: 'Duplikat' },
  error:   { icon: '❌', label: 'Error' },
}

export default function AddCustomerForm({ onClose, onAdded }) {
  const [form, setForm]       = useState(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState(null)

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setResult(null)
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const payload = {
        age:            parseInt(form.age, 10),
        gender:         form.gender,
        income:         parseFloat(form.income),
        spending_score: parseFloat(form.spending_score),
      }

      const res = await addCustomer(payload)

      if (res.error) {
        setResult({ type: 'warning', msg: res.error, persona: res.persona })
      } else {
        setResult({
          type: 'success',
          msg: 'Pelanggan berhasil ditambahkan!',
          persona: res.persona,
        })
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

  return (
    <div
      className="fixed inset-0 bg-slate-900/[.45] backdrop-blur-[5px] z-[1000] flex items-center justify-center p-4 animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white rounded-3xl p-8 w-full max-w-[490px] border border-violet-500/[.10] animate-slide-up"
        style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.08)' }}
      >
        <div className="flex items-start justify-between mb-7">
          <div>
            <div id="modal-title" className="text-[1.1875rem] font-extrabold text-slate-900 tracking-tight">
              ➕ Tambah Pelanggan
            </div>
            <div className="text-[0.8rem] text-slate-400 mt-1">
              Persona akan diprediksi otomatis melalui K-Means clustering
            </div>
          </div>
          <button
            id="modal-close-btn"
            className="w-[30px] h-[30px] rounded-md border border-slate-200 bg-slate-50 cursor-pointer flex items-center justify-center text-slate-400 text-base flex-shrink-0 leading-none font-[inherit] hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300 transition-all"
            onClick={onClose}
            aria-label="Tutup modal"
            type="button"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-2 gap-4 max-[540px]:grid-cols-1">
            <div className="mb-[1.125rem]">
              <label htmlFor="input-age" className="block text-[0.8125rem] font-semibold text-slate-500 mb-1.5">
                Usia
              </label>
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
              <span className="block text-[0.72rem] text-slate-400 mt-1">Rentang: 1–120 tahun</span>
            </div>

            <div className="mb-[1.125rem]">
              <label htmlFor="input-gender" className="block text-[0.8125rem] font-semibold text-slate-500 mb-1.5">
                Gender
              </label>
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

          <div className="grid grid-cols-2 gap-4 max-[540px]:grid-cols-1">
            <div className="mb-[1.125rem]">
              <label htmlFor="input-income" className="block text-[0.8125rem] font-semibold text-slate-500 mb-1.5">
                Income ($K)
              </label>
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
              <span className="block text-[0.72rem] text-slate-400 mt-1">Pendapatan tahunan dalam ribuan USD</span>
            </div>

            <div className="mb-[1.125rem]">
              <label htmlFor="input-score" className="block text-[0.8125rem] font-semibold text-slate-500 mb-1.5">
                Spending Score
              </label>
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
              <span className="block text-[0.72rem] text-slate-400 mt-1">Skor 1–100 (mall scoring)</span>
            </div>
          </div>

          <div className="h-px bg-slate-100 my-5" />

          {result && (
            <div className={`flex items-center gap-3 px-4 py-[0.875rem] rounded-xl mt-4 text-sm font-medium animate-fade-in ${TOAST_STYLES[result.type]}`}>
              <span className="text-[1.1rem]">{RESULT_CONFIG[result.type].icon}</span>
              <div>
                <div className="font-bold text-[0.8125rem]">{RESULT_CONFIG[result.type].label}</div>
                <div className="text-[0.8125rem] opacity-85">
                  {result.msg}
                  {result.persona && (
                    <span> — Persona: <strong>{result.persona}</strong></span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              className="btn-secondary flex-1"
              onClick={onClose}
              disabled={loading}
            >
              Batal
            </button>
            <button
              id="btn-predict-simpan"
              type="submit"
              className="btn-primary flex-[2] justify-center"
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
