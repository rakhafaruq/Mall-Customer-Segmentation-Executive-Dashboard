import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Cell, ResponsiveContainer, LabelList,
} from 'recharts'

const AGE_GROUPS = [
  { label: '≤ 25',  icon: '🧒', min: 0,  max: 25,  color: '#8b5cf6' },
  { label: '26–35', icon: '🧑', min: 26, max: 35,  color: '#06b6d4' },
  { label: '36–50', icon: '👨', min: 36, max: 50,  color: '#f59e0b' },
  { label: '> 50',  icon: '👴', min: 51, max: 999, color: '#10b981' },
]

function AgeTooltip({ active, payload }) {
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
      <p style={{ fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>
        {d.icon} {d.label} tahun
      </p>
      <p style={{ color: '#64748b' }}>
        Jumlah: <strong style={{ color: d.color }}>{d.jumlah}</strong>
      </p>
      <p style={{ color: '#94a3b8', fontSize: 11, marginTop: 2 }}>
        {d.pct}% dari total pelanggan
      </p>
    </div>
  )
}

export default function ChartAge({ customers }) {
  const total = customers.length

  const data = AGE_GROUPS.map(g => {
    const jumlah = customers.filter(c => c.age >= g.min && c.age <= g.max).length
    return {
      ...g,
      jumlah,
      pct: total > 0 ? ((jumlah / total) * 100).toFixed(1) : 0,
    }
  })

  return (
    <div className="glass-card p-6">
      <div className="text-[0.9375rem] font-bold text-slate-900 mb-0.5 tracking-tight">
        🎂 Distribusi Usia
      </div>
      <div className="text-xs text-slate-400 mb-5">
        Persebaran usia pelanggan
      </div>

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
          <Tooltip content={<AgeTooltip />} cursor={{ fill: 'rgba(139,92,246,0.05)' }} />
          <Bar dataKey="jumlah" radius={[6, 6, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={`cell-${i}`} fill={entry.color} />
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
