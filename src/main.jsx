import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'
import { sendErrorReport } from './utils/telegram'

// Đăng ký Service Worker để ứng dụng hoạt động offline và load nhanh hơn
registerSW({ immediate: true })

// --- GLOBAL ERROR HANDLING ---
// Bắt các lỗi runtime thông thường
window.onerror = (message, source, lineno, colno, error) => {
  sendErrorReport(error || message, `Runtime Error: ${source}:${lineno}`);
};

// Bắt các lỗi Promise bị reject mà không có .catch()
window.onunhandledrejection = (event) => {
  sendErrorReport(event.reason, "Unhandled Promise Rejection");
};
// -----------------------------

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
