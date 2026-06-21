/**
 * ChartPersona.jsx
 * Bar chart — jumlah pelanggan per persona (5 klaster)
 * Data: stats[] dari GET /stats
 */

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Cell, ResponsiveContainer, LabelList,
} from 'recharts'

// Warna per persona (harus konsisten di seluruh dashboard)
export const PERSONA_COLORS = {
  'Pelanggan Standar':   '#8b5cf6',
  'Target Utama (VIP)':  '#f59e0b',
  'Implusif':            '#06b6d4',
  'Hemat/Konservatif':   '#10b981',
  'Sensitif Harga':      '#f43f5e',
}

// Label pendek untuk sumbu X
const SHORT_LABEL = {
  'Pelanggan Standar':   'Standar',
  'Target Utama (VIP)':  'VIP',
  'Implusif':            'Implusif',
  'Hemat/Konservatif':   'Hemat',
  'Sensitif Harga':      'Sensitif',
}

/* ── Custom Tooltip ─────────────────────── */
function PersonaTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: 10,
      padding: '10px 14px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
      fontSize: 13,
    }}>
      <p style={{ fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{d.persona}</p>
      <p style={{ color: '#64748b' }}>
        Jumlah: <strong style={{ color: PERSONA_COLORS[d.persona] }}>{d.jumlah}</strong>
      </p>
      <p style={{ color: '#94a3b8', fontSize: 11, marginTop: 2 }}>
        Avg. Income: ${d.avg_income}K
      </p>
      <p style={{ color: '#94a3b8', fontSize: 11 }}>
        Avg. Spending: {d.avg_spending}
      </p>
    </div>
  )
}

export default function ChartPersona({ stats }) {
  const data = stats.map(s => ({
    ...s,
    label: SHORT_LABEL[s.persona] ?? s.persona,
  }))

  return (
    <div className="glass-card chart-card">
      <div className="chart-title">📊 Distribusi Persona</div>
      <div className="chart-subtitle">Jumlah pelanggan per klaster K-Means</div>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart
          data={data}
          margin={{ top: 16, right: 12, left: -12, bottom: 8 }}
          barCategoryGap="30%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f4ff" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11.5, fill: '#94a3b8', fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<PersonaTooltip />} cursor={{ fill: 'rgba(139,92,246,0.05)' }} />
          <Bar dataKey="jumlah" radius={[6, 6, 0, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={`cell-${i}`}
                fill={PERSONA_COLORS[entry.persona] ?? '#8b5cf6'}
              />
            ))}
            <LabelList
              dataKey="jumlah"
              position="top"
              style={{ fontSize: 11, fontWeight: 700, fill: '#475569' }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
