import { Component, useLayoutEffect } from 'react'
import { abortStartup, markApplicationReady } from './startup'

function Ready({ children }) {
  useLayoutEffect(() => {
    markApplicationReady()
  }, [])
  return children
}

export default class StartupBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    abortStartup()
    console.error('[mây] Không thể hiển thị ứng dụng:', error)
  }

  render() {
    if (this.state.failed) {
      return (
        <section className="startup-failure">
          <div className="startup-failure-card" role="alert">
            <h1>Chưa thể mở mây.</h1>
            <p>Vui lòng tải lại trang để nhận phiên bản mới nhất.</p>
            <button type="button" onClick={() => window.location.reload()}>
              Tải lại trang
            </button>
          </div>
        </section>
      )
    }
    return <Ready>{this.props.children}</Ready>
  }
}
