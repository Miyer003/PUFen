/**
 * 移动端开发调试工具
 */

import VConsole from 'vconsole';

// 扩展import.meta类型
declare global {
  interface ImportMeta {
    env: {
      DEV: boolean;
      PROD: boolean;
      MODE: string;
    };
  }
}

/**
 * 初始化移动端调试工具
 */
export const initDevTools = () => {
  // 只在开发环境或需要调试时启用
  const isDev = typeof import.meta !== 'undefined' && import.meta.env?.DEV;
  if (isDev || window.location.search.includes('debug=true')) {
    // 初始化VConsole
    new VConsole({
      defaultPlugins: ['system', 'network', 'element', 'storage'],
      theme: 'light'
    });
    
    console.log('VConsole已启用 - 移动端调试工具');
    
    // 添加设备信息到控制台
    console.group('📱 设备信息');
    console.log('User Agent:', navigator.userAgent);
    console.log('屏幕尺寸:', `${screen.width}x${screen.height}`);
    console.log('视窗尺寸:', `${window.innerWidth}x${window.innerHeight}`);
    console.log('设备像素比:', window.devicePixelRatio);
    console.log('触摸支持:', 'ontouchstart' in window);
    console.groupEnd();
  }
};

/**
 * 添加移动端测试工具栏
 */
export const addMobileTestToolbar = () => {
  const isProd = typeof import.meta !== 'undefined' && import.meta.env?.PROD;
  if (isProd) return;
  
  // 创建工具栏容器
  const toolbar = document.createElement('div');
  toolbar.id = 'mobile-test-toolbar';
  toolbar.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 10px;
    border-radius: 8px;
    font-size: 12px;
    z-index: 10000;
    display: none;
    flex-direction: column;
    gap: 8px;
    min-width: 200px;
  `;
  
  // 添加设备信息
  const deviceInfo = document.createElement('div');
  deviceInfo.innerHTML = `
    <strong>📱 设备模拟</strong><br>
    屏幕: ${window.innerWidth}x${window.innerHeight}<br>
    DPR: ${window.devicePixelRatio}<br>
    UA: ${navigator.userAgent.includes('Mobile') ? '移动端' : '桌面端'}
  `;
  toolbar.appendChild(deviceInfo);
  
  // 添加常用设备预设
  const devicePresets = [
    { name: 'iPhone 14', width: 390, height: 844 },
    { name: 'iPhone 14 Plus', width: 428, height: 926 },
    { name: 'iPhone SE', width: 375, height: 667 },
    { name: 'iPad', width: 768, height: 1024 },
    { name: 'Android', width: 360, height: 640 },
    { name: '小米', width: 393, height: 851 },
    { name: '华为', width: 360, height: 780 }
  ];
  
  const presetsContainer = document.createElement('div');
  presetsContainer.innerHTML = '<strong>快速切换:</strong>';
  toolbar.appendChild(presetsContainer);
  
  devicePresets.forEach(device => {
    const button = document.createElement('button');
    button.textContent = device.name;
    button.style.cssText = `
      background: #4CAF50;
      color: white;
      border: none;
      padding: 4px 8px;
      margin: 2px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 11px;
    `;
    button.onclick = () => simulateDevice(device.width, device.height, device.name);
    presetsContainer.appendChild(button);
  });
  
  // 添加功能测试按钮
  const testContainer = document.createElement('div');
  testContainer.innerHTML = '<strong>功能测试:</strong>';
  toolbar.appendChild(testContainer);
  
  const testButtons = [
    { name: '振动测试', action: () => testVibration() },
    { name: '分享测试', action: () => testShare() },
    { name: '触摸测试', action: () => testTouch() },
    { name: '网络状态', action: () => testNetwork() }
  ];
  
  testButtons.forEach(test => {
    const button = document.createElement('button');
    button.textContent = test.name;
    button.style.cssText = `
      background: #2196F3;
      color: white;
      border: none;
      padding: 4px 8px;
      margin: 2px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 11px;
    `;
    button.onclick = test.action;
    testContainer.appendChild(button);
  });
  
  // 添加关闭按钮
  const closeButton = document.createElement('button');
  closeButton.textContent = '❌ 关闭';
  closeButton.style.cssText = `
    background: #f44336;
    color: white;
    border: none;
    padding: 6px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 11px;
  `;
  closeButton.onclick = () => toolbar.style.display = 'none';
  toolbar.appendChild(closeButton);
  
  document.body.appendChild(toolbar);
  
  // 添加显示工具栏的快捷键
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'M') {
      toolbar.style.display = toolbar.style.display === 'none' ? 'flex' : 'none';
    }
  });
  
  // 显示使用提示
  console.log('📱 移动端测试工具栏已启用');
  console.log('快捷键: Ctrl+Shift+M 显示/隐藏工具栏');
  
  // 默认显示工具栏
  toolbar.style.display = 'flex';
};

/**
 * 模拟设备尺寸
 */
function simulateDevice(width: number, height: number, deviceName: string) {
  // 使用CSS模拟设备尺寸
  const style = document.createElement('style');
  style.id = 'device-simulator';
  
  // 移除之前的样式
  const existing = document.getElementById('device-simulator');
  if (existing) existing.remove();
  
  style.textContent = `
    body {
      max-width: ${width}px !important;
      max-height: ${height}px !important;
      margin: 0 auto !important;
      border: 2px solid #333 !important;
      border-radius: 20px !important;
      overflow: hidden !important;
      box-shadow: 0 0 20px rgba(0,0,0,0.3) !important;
      position: relative !important;
    }
    
    body::before {
      content: "${deviceName} (${width}×${height})" !important;
      position: absolute !important;
      top: -30px !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      background: #333 !important;
      color: white !important;
      padding: 4px 12px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      z-index: 10001 !important;
    }
    
    html {
      background: #f0f0f0 !important;
      padding: 40px 20px !important;
    }
  `;
  
  document.head.appendChild(style);
  
  // 触发resize事件
  window.dispatchEvent(new Event('resize'));
  
  console.log(`📱 已切换到 ${deviceName} 模拟 (${width}×${height})`);
}

/**
 * 测试振动功能
 */
function testVibration() {
  if ('vibrate' in navigator) {
    navigator.vibrate([100, 50, 100, 50, 200]);
    console.log('📳 振动测试: 短-短-长');
  } else {
    console.log('❌ 当前环境不支持振动API');
  }
}

/**
 * 测试分享功能
 */
function testShare() {
  if (navigator.share) {
    navigator.share({
      title: 'PUFen积分系统',
      text: '快来体验积分签到系统！',
      url: window.location.href,
    }).then(() => {
      console.log('✅ 分享测试成功');
    }).catch((error) => {
      console.log('❌ 分享测试失败:', error);
    });
  } else {
    console.log('❌ 当前环境不支持原生分享API');
    // 模拟复制链接
    navigator.clipboard.writeText(window.location.href).then(() => {
      console.log('📋 链接已复制到剪贴板');
    });
  }
}

/**
 * 测试触摸功能
 */
function testTouch() {
  const testDiv = document.createElement('div');
  testDiv.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 200px;
    height: 100px;
    background: #4CAF50;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    cursor: pointer;
    user-select: none;
    z-index: 10001;
  `;
  testDiv.textContent = '点击测试触摸反馈';
  
  let touchCount = 0;
  const handleTouch = () => {
    touchCount++;
    testDiv.style.background = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0'][touchCount % 4];
    testDiv.textContent = `触摸次数: ${touchCount}`;
    
    // 振动反馈
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    if (touchCount >= 5) {
      setTimeout(() => {
        document.body.removeChild(testDiv);
        console.log('✅ 触摸测试完成');
      }, 1000);
    }
  };
  
  testDiv.addEventListener('click', handleTouch);
  testDiv.addEventListener('touchstart', handleTouch);
  
  document.body.appendChild(testDiv);
  console.log('👆 触摸测试开始 - 请点击屏幕中央的绿色区域');
}

/**
 * 测试网络状态
 */
function testNetwork() {
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  
  console.group('🌐 网络状态测试');
  console.log('在线状态:', navigator.onLine ? '在线' : '离线');
  
  if (connection) {
    console.log('连接类型:', connection.effectiveType || '未知');
    console.log('下载速度:', connection.downlink ? `${connection.downlink}Mbps` : '未知');
    console.log('往返时延:', connection.rtt ? `${connection.rtt}ms` : '未知');
    console.log('数据节省:', connection.saveData ? '开启' : '关闭');
  } else {
    console.log('❌ 当前环境不支持网络信息API');
  }
  
  console.groupEnd();
}

/**
 * 添加响应式设计辅助线
 */
export const addResponsiveGuides = () => {
  const isProd = typeof import.meta !== 'undefined' && import.meta.env?.PROD;
  if (isProd) return;
  
  const guides = document.createElement('div');
  guides.id = 'responsive-guides';
  guides.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 9999;
    border: 2px dashed rgba(255, 0, 0, 0.3);
  `;
  
  // 添加安全区域指示
  const safeArea = document.createElement('div');
  safeArea.style.cssText = `
    position: absolute;
    top: env(safe-area-inset-top, 20px);
    left: env(safe-area-inset-left, 0);
    right: env(safe-area-inset-right, 0);
    bottom: env(safe-area-inset-bottom, 20px);
    border: 1px dashed rgba(0, 255, 0, 0.5);
  `;
  
  // 添加尺寸信息
  const sizeInfo = document.createElement('div');
  sizeInfo.style.cssText = `
    position: absolute;
    top: 5px;
    left: 5px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 4px 8px;
    font-size: 12px;
    border-radius: 4px;
  `;
  
  const updateSizeInfo = () => {
    sizeInfo.textContent = `${window.innerWidth}×${window.innerHeight} (${window.devicePixelRatio}x)`;
  };
  
  updateSizeInfo();
  window.addEventListener('resize', updateSizeInfo);
  
  guides.appendChild(safeArea);
  guides.appendChild(sizeInfo);
  document.body.appendChild(guides);
  
  console.log('📐 响应式辅助线已启用');
};

/**
 * 自动检测并提示移动端模拟
 */
export const autoDetectMobileSimulation = () => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isSmallScreen = window.innerWidth <= 768;
  const isDev = typeof import.meta !== 'undefined' && import.meta.env?.DEV;
  
  if (!isMobile && !isSmallScreen && isDev) {
    setTimeout(() => {
      const notice = document.createElement('div');
      notice.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #2196F3;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 10002;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        cursor: pointer;
      `;
      notice.innerHTML = `
        📱 <strong>移动端预览提示</strong><br>
        按 <kbd>Ctrl+Shift+M</kbd> 打开移动端工具栏<br>
        或按 <kbd>F12</kbd> 开启开发者工具的设备模拟
      `;
      
      notice.onclick = () => {
        notice.remove();
        // 尝试打开工具栏
        const toolbar = document.getElementById('mobile-test-toolbar');
        if (toolbar) {
          toolbar.style.display = 'flex';
        }
      };
      
      document.body.appendChild(notice);
      
      // 5秒后自动消失
      setTimeout(() => {
        if (notice.parentNode) {
          notice.remove();
        }
      }, 5000);
    }, 2000);
  }
};