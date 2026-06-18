import { formatDate } from '../../utils/formatDate'

/**
 * Popup marker Pos — desain bersih, teks jelas
 * KOTIS: gold · Pos biasa: cyan
 */
export function PosPopup({ pos, onDetailClick }) {
  const isKotis = pos.pos_id === 'KOTIS'
  const accent  = isKotis ? '#ffd700' : '#00ccff'
  const bgHead  = isKotis ? 'rgba(255,215,0,0.10)' : 'rgba(0,204,255,0.08)'
  const border  = isKotis ? 'rgba(255,215,0,0.40)'  : 'rgba(0,204,255,0.35)'
  const bgBtn   = isKotis ? 'rgba(255,215,0,0.12)'  : 'rgba(0,204,255,0.10)'
  const bgBtnHv = isKotis ? 'rgba(255,215,0,0.22)'  : 'rgba(0,204,255,0.20)'

  return (
    <div style={{
      minWidth: '230px',
      background: '#0b1120',
      border: `1px solid ${border}`,
      borderRadius: '4px',
      fontFamily: 'Inter, sans-serif',
      overflow: 'hidden',
    }}>

      {/* ── Header ── */}
      <div style={{
        background: bgHead,
        borderBottom: `1px solid ${border}`,
        padding: '9px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        {/* Badge pos_id — full text, no truncation */}
        <div style={{
          padding: '4px 10px',
          borderRadius: '3px',
          background: bgBtn,
          border: `1px solid ${border}`,
          fontSize: '12px',
          fontWeight: '800',
          color: accent,
          letterSpacing: '0.04em',
          flexShrink: 0,
          whiteSpace: 'nowrap',
        }}>
          {pos.pos_id}
        </div>

        {/* Nama pos */}
        <div style={{ minWidth: 0, flex: 1 }}>
          <p style={{
            margin: 0,
            fontSize: '12px',
            fontWeight: '700',
            color: '#ddeeff',
            lineHeight: 1.35,
            wordBreak: 'break-word',
          }}>
            {pos.nama_pos}
          </p>
          {pos.lokasi_desa && pos.lokasi_desa !== '—' && (
            <p style={{
              margin: '2px 0 0',
              fontSize: '10px',
              color: 'rgba(170,195,220,0.5)',
            }}>
              {pos.lokasi_desa}
            </p>
          )}
        </div>
      </div>

      {/* ── Data rows ── */}
      <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>

        <DataRow
          label="DPP"
          value={pos.komandan_pos || '—'}
          valueColor="#ddeeff"
          valueBold
        />

        <DataRow
          label="PERSONEL"
          value={`${pos.jumlah_personel || 0} orang`}
          valueColor={accent}
          valueBold
          valueLarge
        />

        {pos.lat && pos.lng && (
          <DataRow
            label="KOORDINAT"
            value={`${Number(pos.lat).toFixed(5)}, ${Number(pos.lng).toFixed(5)}`}
            valueColor="rgba(170,195,220,0.6)"
            mono
          />
        )}

      </div>

      {/* ── Button ── */}
      <div style={{ padding: '0 12px 10px' }}>
        <button
          onClick={() => onDetailClick && onDetailClick(pos.pos_id)}
          style={{
            width: '100%',
            padding: '8px 0',
            background: bgBtn,
            border: `1px solid ${border}`,
            borderRadius: '3px',
            color: accent,
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            textTransform: 'uppercase',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = bgBtnHv}
          onMouseLeave={e => e.currentTarget.style.background = bgBtn}
        >
          ▶ LIHAT DETAIL POS
        </button>
      </div>

    </div>
  )
}

function DataRow({ label, value, valueColor, valueBold, valueLarge, mono }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
      <span style={{
        fontSize: '9px',
        color: 'rgba(150,180,210,0.45)',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        flexShrink: 0,
      }}>
        {label}
      </span>
      <span style={{
        fontSize: valueLarge ? '14px' : mono ? '10px' : '12px',
        color: valueColor || '#ddeeff',
        fontWeight: valueBold ? '700' : '400',
        fontFamily: mono ? 'monospace' : 'inherit',
        textAlign: 'right',
      }}>
        {value}
      </span>
    </div>
  )
}

/**
 * Popup marker Kerawanan — inline styles, no Tailwind dependencies
 */
export function KerawananPopup({ item }) {
  const isAktif = item.status === 'aktif'
  return (
    <div style={{ minWidth: '180px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <div style={{
          width: '8px', height: '8px', borderRadius: '50%',
          background: isAktif ? '#ff3333' : '#00ff88',
          flexShrink: 0,
        }} />
        <span style={{
          fontSize: '10px', fontWeight: '700', letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: isAktif ? '#ff5555' : '#00ff88',
        }}>
          {item.kategori || 'Kerawanan'}
        </span>
      </div>

      {item.deskripsi && (
        <p style={{
          fontSize: '11px', color: 'rgba(200,214,229,0.75)',
          marginBottom: '8px', lineHeight: 1.5, margin: '0 0 8px 0',
        }}>
          {item.deskripsi}
        </p>
      )}

      <div style={{
        borderTop: '1px solid rgba(0,255,136,0.12)',
        paddingTop: '8px',
        display: 'flex', flexDirection: 'column', gap: '4px',
      }}>
        {item.tanggal && (
          <KPopupRow label="Tanggal" value={formatDate(item.tanggal)} />
        )}
        <KPopupRow
          label="Status"
          value={isAktif ? '● Aktif' : '✓ Selesai'}
          valueColor={isAktif ? '#ff5555' : '#00ff88'}
        />
        {item.pos_id && (
          <KPopupRow label="Pos" value={item.pos_id} />
        )}
      </div>
    </div>
  )
}

function KPopupRow({ label, value, valueColor }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
      <span style={{ fontSize: '10px', color: 'rgba(200,214,229,0.4)' }}>{label}</span>
      <span style={{ fontSize: '10px', color: valueColor || 'rgba(200,214,229,0.75)', fontWeight: '500' }}>
        {value}
      </span>
    </div>
  )
}
