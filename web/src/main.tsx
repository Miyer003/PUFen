import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('main.tsx 开始执行');

// 移动端开发工具
import { 
  initDevTools, 
  addMobileTestToolbar, 
  addResponsiveGuides, 
  autoDetectMobileSimulation 
} from './utils/devtools.ts'

console.log('导入开发工具成功');

// 暂时注释掉开发工具初始化来排查问题
// initDevTools(); // 这个包含VConsole，先不启用
addMobileTestToolbar();
addResponsiveGuides();

console.log('部分开发工具初始化完成');

// 页面加载完成后检测移动端模拟
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded 事件触发');
  autoDetectMobileSimulation();
});

console.log('即将渲染React应用');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

console.log('React应用渲染完成');