// Catch entry-module failures before React mounts, so a failed import never leaves a blank page.
import('./main.jsx').catch((error) => {
  console.error('[mây] Không thể khởi động ứng dụng:', error)
  const root = document.getElementById('root')
  const screen = document.createElement('section')
  screen.style.cssText =
    'min-height:100svh;display:grid;place-items:center;padding:24px;box-sizing:border-box;background:#f7f8fc;font-family:system-ui,sans-serif;color:#34323f'
  screen.innerHTML = `
    <div role="alert" style="max-width:380px;padding:28px;border:1px solid #e7ddef;border-radius:16px;background:white;text-align:center">
      <h1 style="margin:0 0 12px;font-size:21px">Chưa thể mở mây.</h1>
      <p style="margin:0 0 20px;color:#65596f;font-size:14px;line-height:1.7">Vui lòng tải lại trang để nhận phiên bản mới nhất.</p>
      <button type="button" style="padding:11px 18px;border:0;border-radius:8px;background:#7b5ba4;color:white;font:inherit;cursor:pointer">Tải lại trang</button>
    </div>`
  screen.querySelector('button').addEventListener('click', () => window.location.reload())
  root.replaceChildren(screen)
})
