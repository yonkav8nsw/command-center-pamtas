import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts'
import { KERAWANAN_CATEGORIES } from '../../constants/kerawananCategories'

const TOOLTIP_STYLE = {
  background: 'rgba(5,12,8,0.97)',
  border: '1px solid rgba(0,255,136,0.2)',
  borderRadius: '2px',
  color: '#c8d6e5',
  fontSize: '11px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
}

/* ── Bar chart kerawanan per kategori ──────────────────── */
export function KerawananChart({ kerawananList = [] }) {
  const data = KERAWANAN_CATEGORIES.map(cat => ({
    name:      cat.label.split(' ')[0],
    fullName:  cat.label,
    value:     kerawananList.filter(k => k.kategori === cat.id).length,
    color:     cat.color,
  })).filter(d => d.value > 0)

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-28 text-[rgba(200,214,229,0.3)] text-xs tracking-wider uppercase">
        Tidak ada data
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={130}>
      <BarChart data={data} margin={{ top: 4, right: 0, left: -28, bottom: 0 }}>
        <XAxis
          dataKey="name"
          tick={{ fill: 'rgba(200,214,229,0.4)', fontSize: 9 }}
          axisLine={{ stroke: 'rgba(0,255,136,0.1)' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: 'rgba(200,214,229,0.4)', fontSize: 9 }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          cursor={{ fill: 'rgba(0,255,136,0.04)' }}
          formatter={(val, _, props) => [val + ' kasus', props.payload.fullName]}
        />
        <Bar dataKey="value" radius={[2, 2, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} fillOpacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

/* ── Pie chart distribusi agama ────────────────────────── */
export function AgamaChart({ demografi }) {
  if (!demografi) return null

  const COLORS = ['#00ff88', '#4488ff', '#bb88ff', '#ffaa00', '#ff88cc', '#888']
  const data = [
    { name: 'Islam',   value: Number(demografi.islam    || 0) },
    { name: 'Kristen', value: Number(demografi.kristen  || 0) },
    { name: 'Katolik', value: Number(demografi.katolik  || 0) },
    { name: 'Hindu',   value: Number(demografi.hindu    || 0) },
    { name: 'Buddha',  value: Number(demografi.buddha   || 0) },
    { name: 'Lainnya', value: Number(demografi.konghucu || 0) + Number(demografi.lainnya || 0) },
  ].filter(d => d.value > 0)

  if (data.length === 0) return null

  return (
    <ResponsiveContainer width="100%" height={160}>
      <PieChart>
        <Pie
          data={data}
          cx="50%" cy="50%"
          innerRadius={38} outerRadius={60}
          paddingAngle={2}
          dataKey="value"
          strokeWidth={0}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.85} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          formatter={(val) => [val.toLocaleString('id-ID') + ' jiwa']}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
