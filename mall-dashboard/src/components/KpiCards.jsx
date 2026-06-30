const PERSONA_VIP = 'Target Utama (VIP)'

const COLOR_CONFIG = {
  purple: {
    bar:    'bg-gradient-to-r from-violet-500 to-violet-400',
    blob:   'bg-violet-500',
    iconBg: 'bg-violet-100',
  },
  amber: {
    bar:    'bg-gradient-to-r from-amber-500 to-amber-400',
    blob:   'bg-amber-500',
    iconBg: 'bg-amber-100',
  },
  cyan: {
    bar:    'bg-gradient-to-r from-cyan-500 to-cyan-400',
    blob:   'bg-cyan-100',
    iconBg: 'bg-cyan-100',
  },
  emerald: {
    bar:    'bg-gradient-to-r from-emerald-500 to-emerald-400',
    blob:   'bg-emerald-500',
    iconBg: 'bg-emerald-100',
  },
}

export default function KpiCards({ customers, stats }) {
  const total = customers.length

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
      id:       'kpi-total',
      color:    'purple',
      icon:     '👥',
      value:    total.toLocaleString('id-ID'),
      label:    'Total Pelanggan',
      sublabel: 'Data tersegmentasi',
    },
    {
      id:       'kpi-vip',
      color:    'amber',
      icon:     '👑',
      value:    vipCount,
      label:    'Target Utama (VIP)',
      sublabel: `${vipPct}% dari total`,
    },
    {
      id:       'kpi-income',
      color:    'cyan',
      icon:     '💰',
      value:    `$${avgIncome}K`,
      label:    'Rata-rata Income',
      sublabel: 'Annual income rata-rata',
    },
    {
      id:       'kpi-score',
      color:    'emerald',
      icon:     '📈',
      value:    avgScore,
      label:    'Spending Score',
      sublabel: 'Skor pengeluaran rata-rata',
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-5 mb-6 max-lg:grid-cols-2 max-[540px]:grid-cols-1">
      {cards.map(card => {
        const cfg = COLOR_CONFIG[card.color]
        return (
          <div
            key={card.id}
            id={card.id}
            className="glass-card px-6 pt-6 pb-[1.375rem] relative overflow-hidden"
          >
            <div className={`absolute top-0 left-0 right-0 h-[3.5px] rounded-t-2xl ${cfg.bar}`} />

            <div className={`absolute -top-[30px] -right-[30px] w-[110px] h-[110px] rounded-full opacity-[0.07] ${cfg.blob}`} />

            <div className={`relative z-10 w-[46px] h-[46px] ${cfg.iconBg} rounded-xl flex items-center justify-center text-[1.375rem] mb-[1.125rem]`}>
              {card.icon}
            </div>

            <div className="relative z-10 text-[2.1rem] font-extrabold text-slate-900 leading-none mb-1.5 tracking-tight">
              {card.value}
            </div>

            <div className="relative z-10 text-sm font-medium text-slate-500">
              {card.label}
            </div>

            <div className="relative z-10 text-[0.72rem] text-slate-400 mt-1">
              {card.sublabel}
            </div>
          </div>
        )
      })}
    </div>
  )
}
