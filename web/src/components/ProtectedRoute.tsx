import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, setUser, setIsAuthenticated } = useAuthStore();
  
  // 开发环境自动登录
  useEffect(() => {
    const isDev = typeof import.meta !== 'undefined' && import.meta.env?.DEV;
    const hasDevParam = window.location.search.includes('dev=true');
    
    if ((isDev || hasDevParam) && !isAuthenticated) {
      // 设置一个虚拟用户用于开发测试
      const mockUser = {
        id: 'dev-user-001',
        username: '测试用户',
        email: 'test@example.com',
        phone: '13800138000',
        avatar: '',
        isNewUser: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      
      console.log('🔧 开发模式：已自动登录测试账号');
      console.log('用户信息:', mockUser);
    }
  }, [isAuthenticated, setUser, setIsAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;