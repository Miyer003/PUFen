import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, token, loading } = useAuthStore();
  
  console.log('ProtectedRoute 状态检查:', { 
    isAuthenticated, 
    hasToken: !!token, 
    loading,
    tokenValue: token ? `${token.substring(0, 10)}...` : 'null'
  });
  
  // 如果还在加载认证状态，显示加载界面
  if (loading) {
    console.log('ProtectedRoute: 显示加载界面');
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ color: 'white', fontSize: '18px' }}>加载中...</div>
      </div>
    );
  }
  
  // 如果没有token或未认证，重定向到登录页
  if (!token || !isAuthenticated) {
    console.log('ProtectedRoute: 重定向到登录页');
    return <Navigate to="/login" replace />;
  }

  console.log('ProtectedRoute: 渲染受保护的内容');
  return <>{children}</>;
};

export default ProtectedRoute;