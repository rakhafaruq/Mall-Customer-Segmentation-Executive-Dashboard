/**
 * ChartGender.jsx
 * Donut chart — proporsi Male vs Female
 * Data: customers[] dari GET /customers
 */

import {
  PieChart, Pie, Cell, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts'

const COLORS = {
  Male:   '#8b5cf6',
  Female: '#ec4899',
}

/* ── Custom Tooltip ─────────────────────── */
function GenderTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { name, value, payload: p } = payload[0]
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: 10,
      padding: '10px 14px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
      fontSize: 13,
    }}>
      <p style={{ fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
        {name === 'Male' ? '♂' : '♀'} {name}
      </p>
      <p style={{ color: '#64748b' }}>
        {value} pelanggan&nbsp;
        <strong style={{ color: COLORS[name] }}>({p.pct}%)</strong>
      </p>
    </div>
  )
}

/* ── Custom Legend ──────────────────────── */
function GenderLegend({ payload }) {
  // Filter out ghost pie entry
  const filtered = payload.filter(e => e.value === 'Male' || e.value === 'Female')
  return (
    <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', marginTop: 4 }}>
      {filtered.map(entry => (
        <div key={entry.value} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{
            width: 10, height: 10, borderRadius: '50%',
            background: entry.color, flexShrink: 0,
          }} />
          <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>
            {entry.value === 'Male' ? '♂' : '♀'}&nbsp;{entry.value}&nbsp;
            <strong style={{ color: '#0f172a' }}>({entry.payload.pct}%)</strong>
          </span>
        </div>
      ))}
    </div>
  )
}

export default function ChartGender({ customers }) {
  const male   = customers.filter(c => c.gender === 'Male').length
  const female = customers.filter(c => c.gender === 'Female').length
  const total  = male + female

  const data = [
    { name: 'Male',   value: male,   pct: total ? ((male / total) * 100).toFixed(1) : 0 },
    { name: 'Female', value: female, pct: total ? ((female / total) * 100).toFixed(1) : 0 },
  ]

  return (
    <div className="glass-card chart-card">
      <div className="chart-title">👤 Distribusi Gender</div>
      <div className="chart-subtitle">Proporsi pria &amp; wanita</div>

      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          {/* Donut utama */}
          <Pie
            data={data}
            cx="50%"
            cy="46%"
            innerRadius={58}
            outerRadius={82}
            paddingAngle={4}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map(entry => (
              <Cell key={entry.name} fill={COLORS[entry.name]} />
            ))}
          </Pie>

          <Tooltip content={<GenderTooltip />} />
          <Legend content={<GenderLegend />} />

          {/* Teks di tengah donut — pakai SVG absolut via foreignObject trick */}
          <text
            x="50%"
            y="41%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#0f172a"
            style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Inter, sans-serif' }}
          >
            {total}
          </text>
          <text
            x="50%"
            y="49%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#94a3b8"
            style={{ fontSize: 11, fontFamily: 'Inter, sans-serif' }}
          >
            Pelanggan
          </text>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
