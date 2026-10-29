import FooterArt from './FooterArt'
import './AppFooter.css'

export default function AppFooter() {
  return (
    <footer className="app-footer" aria-label="Chân trang">
      <span className="app-footer-brand">
        <FooterArt />
        <span className="app-footer-signature">
          <span className="app-footer-wordmark">
            mây<span>.</span>
          </span>
          <svg width="50" height="10" viewBox="0 0 50 10" fill="none" aria-hidden="true">
            <path
              d="M3 7C12 3.5 28 2 46 3.2"
              stroke="#a38aba"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
            <path
              d="M16 8C24 6.4 34 5.4 41.5 5.8"
              stroke="#d0bbdf"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </span>
      <span className="app-footer-note">Nhẹ ghi chép, nhẹ âu lo.</span>
    </footer>
  )
}
