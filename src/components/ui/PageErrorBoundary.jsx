/**
 * PageErrorBoundary — error boundary per halaman.
 * Mencegah error di satu page crash seluruh app.
 */
import { Component } from 'react'

export default class PageErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // Log ke console untuk debugging — bisa dikirim ke error tracking service
    console.error('[PageErrorBoundary]', error, info.componentStack)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            fontFamily: 'monospace',
            padding: '32px',
            background: '#050810',
          }}
        >
          <div style={{ color: '#ff4444', fontSize: '20px' }}>⚠</div>
          <p
            style={{
              color: 'rgba(200,214,229,0.6)',
              fontSize: '10px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            Halaman ini mengalami kesalahan
          </p>
          <p
            style={{
              color: 'rgba(255,68,68,0.55)',
              fontSize: '9px',
              maxWidth: '360px',
              textAlign: 'center',
              lineHeight: 1.6,
            }}
          >
            {this.state.error?.message || 'Terjadi kesalahan yang tidak diketahui'}
          </p>
          <button
            onClick={this.handleReset}
            style={{
              marginTop: '4px',
              padding: '6px 20px',
              background: 'rgba(0,255,136,0.08)',
              border: '1px solid rgba(0,255,136,0.25)',
              color: '#00ff88',
              fontSize: '9px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              borderRadius: '3px',
            }}
          >
            Coba Lagi
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
