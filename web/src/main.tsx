import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// 移动端开发工具
import { 
  initDevTools, 
  addMobileTestToolbar, 
  addResponsiveGuides, 
  autoDetectMobileSimulation 
} from './utils/devtools.ts'

// 初始化开发工具
initDevTools();
addMobileTestToolbar();
addResponsiveGuides();

// 页面加载完成后检测移动端模拟
document.addEventListener('DOMContentLoaded', () => {
  autoDetectMobileSimulation();
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)