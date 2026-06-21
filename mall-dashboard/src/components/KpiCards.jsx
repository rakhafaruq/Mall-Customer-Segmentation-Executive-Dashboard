/**
 * KpiCards.jsx
 * Menampilkan 4 kartu KPI: Total, VIP, Avg Income, Avg Spending Score
 * 
 * VIP count dihitung dari `stats` (server-side aggregate) bukan client-side filter
 * agar selalu konsisten dengan data aktual di DB.
 */

const PERSONA_VIP = 'Target Utama (VIP)'

export default function KpiCards({ customers, stats }) {
  const total = customers.length

  // Gunakan stats dari server untuk count VIP — lebih akurat dan tidak tergantung
  // string matching di frontend
  const vipStat  = stats.find(s => s.persona.trim() === PERSONA_VIP)
  const vipCount = vipStat ? vipStat.jumlah : 0

  const avgIncome =
    total > 0
      ? (customers.reduce((s, c) => s + Number(c.income), 0) / total).toFixed(1)
      : '0'

  const avgScore =
    total > 0
      ? (customers.reduce((s, c) => s + Number(c.spending_score), 0) / total).toFixed(1)
      : '0'

  const vipPct = total > 0 ? ((vipCount / total) * 100).toFixed(1) : '0'

  const cards = [
    {
      id: 'kpi-total',
      colorClass: 'kpi-purple',
      icon: '👥',
      value: total.toLocaleString('id-ID'),
      label: 'Total Pelanggan',
      sublabel: 'Data tersegmentasi',
    },
    {
      id: 'kpi-vip',
      colorClass: 'kpi-amber',
      icon: '👑',
      value: vipCount,
      label: 'Target Utama (VIP)',
      sublabel: `${vipPct}% dari total`,
    },
    {
      id: 'kpi-income',
      colorClass: 'kpi-cyan',
      icon: '💰',
      value: `$${avgIncome}K`,
      label: 'Rata-rata Income',
      sublabel: 'Annual income rata-rata',
    },
    {
      id: 'kpi-score',
      colorClass: 'kpi-emerald',
      icon: '📈',
      value: avgScore,
      label: 'Spending Score',
      sublabel: 'Skor pengeluaran rata-rata',
    },
  ]

  return (
    <div className="kpi-grid">
      {cards.map(card => (
        <div key={card.id} id={card.id} className={`glass-card kpi-card ${card.colorClass}`}>
          <div className="kpi-icon-wrap">{card.icon}</div>
          <div className="kpi-value">{card.value}</div>
          <div className="kpi-label">{card.label}</div>
          <div className="kpi-sublabel">{card.sublabel}</div>
        </div>
      ))}
    </div>
  )
}
