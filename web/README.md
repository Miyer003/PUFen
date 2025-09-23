# PU分 - 积分签到系统前端

基于 React + TypeScript + Vite 构建的现代化积分签到系统前端应用。

## 功能特性

### 📱 移动端优先设计
- 响应式设计，完美适配手机端
- 类似微信小程序的UI风格
- 流畅的交互动画和反馈

### 🎯 核心功能
- **用户认证**：登录、注册、用户信息管理
- **积分签到**：每日签到、补签、连续签到奖励
- **积分兑换**：优惠券兑换、分阶段解锁
- **组队瓜分**：创建团队、邀请好友、积分瓜分
- **记录查询**：积分记录、组队记录、兑换记录

### 🛠 技术栈
- **框架**：React 18 + TypeScript
- **构建工具**：Vite
- **UI组件**：Ant Design + Styled Components
- **状态管理**：Zustand
- **路由**：React Router DOM
- **HTTP客户端**：Axios
- **时间处理**：Day.js

## 项目结构

```
web/
├── public/                 # 静态资源
├── src/
│   ├── components/        # 共用组件
│   │   ├── styled.tsx    # 样式组件库
│   │   └── ProtectedRoute.tsx # 路由保护组件
│   ├── pages/            # 页面组件
│   │   ├── Login.tsx     # 登录页
│   │   ├── Register.tsx  # 注册页
│   │   ├── Points.tsx    # 积分主页
│   │   └── Records.tsx   # 记录页面
│   ├── services/         # API服务
│   │   ├── api.ts       # HTTP客户端
│   │   ├── auth.ts      # 认证相关API
│   │   ├── points.ts    # 积分相关API
│   │   ├── team.ts      # 组队相关API
│   │   └── reward.ts    # 兑换相关API
│   ├── store/           # 状态管理
│   │   ├── auth.ts      # 认证状态
│   │   └── points.ts    # 积分状态
│   ├── types/           # TypeScript类型定义
│   │   └── index.ts     # 通用类型
│   ├── utils/           # 工具函数
│   │   ├── date.ts      # 日期处理
│   │   └── common.ts    # 通用工具
│   ├── App.tsx          # 根组件
│   ├── main.tsx         # 入口文件
│   └── index.css        # 全局样式
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 快速开始

### 环境要求
- Node.js >= 16
- npm >= 8 或 yarn >= 1.22

### 安装依赖
```bash
cd web
npm install
# 或
yarn install
```

### 启动开发服务器
```bash
npm run dev
# 或
yarn dev
```

访问 http://localhost:3000 查看应用

### 构建生产版本
```bash
npm run build
# 或
yarn build
```

### 预览生产版本
```bash
npm run preview
# 或
yarn preview
```

## API 配置

前端默认配置了代理，将 `/api` 开头的请求转发到后端服务器。

在 `vite.config.ts` 中修改后端地址：

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3001', // 修改为你的后端地址
      changeOrigin: true,
    },
  },
}
```

## 主要页面介绍

### 1. 登录/注册页面
- 手机号 + 密码登录
- 用户注册功能
- 表单验证和错误提示
- JWT Token 管理

### 2. 积分主页
- 积分余额显示（小猪存钱罐样式）
- 7天签到日历
- 签到状态和积分倍数显示
- 连续签到奖励提示
- 组队邀请按钮
- 积分兑换区域

### 3. 记录页面
- 积分记录：签到、组队、兑换等积分流水
- 组队记录：参与的组队活动
- 兑换记录：优惠券兑换历史
- 分页加载和筛选功能

## 状态管理

使用 Zustand 进行状态管理，主要包含：

### 认证状态 (useAuthStore)
- 用户信息
- 登录状态
- Token管理
- 自动登录检查

### 积分状态 (usePointsStore)
- 积分账户信息
- 签到配置
- 签到状态
- 余额更新

## 样式系统

### Styled Components
使用 styled-components 创建可复用的样式组件：
- 主题色彩：绿色系为主色调
- 响应式设计：移动端优先
- 动画效果：渐入、点击反馈等

### Ant Design
使用 Ant Design 作为基础UI组件库：
- 表单组件：Form, Input, Button等
- 反馈组件：message, Modal等
- 导航组件：Tabs等

## 开发规范

### 文件命名
- 组件文件：PascalCase (如：`UserProfile.tsx`)
- 工具文件：camelCase (如：`dateUtils.ts`)
- 页面文件：PascalCase (如：`LoginPage.tsx`)

### 代码风格
- 使用 TypeScript 严格模式
- 使用 ESLint 进行代码检查
- 组件使用函数式组件 + Hooks
- 异步操作使用 async/await

### Git 提交规范
```
feat: 新功能
fix: 修复问题
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建/工具相关
```

## 部署说明

### 环境变量
生产环境可以通过环境变量配置：

```bash
# .env.production
VITE_API_BASE_URL=https://your-api-domain.com/api
```

### Nginx 配置示例
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    # 处理前端路由
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API代理
    location /api/ {
        proxy_pass http://your-backend-server:3001/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 故障排查

### 常见问题

1. **依赖安装失败**
   ```bash
   # 清除缓存重新安装
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **TypeScript 类型错误**
   - 检查 tsconfig.json 配置
   - 确保所有依赖包的类型声明已安装

3. **API 请求失败**
   - 检查 vite.config.ts 中的代理配置
   - 确认后端服务器正在运行
   - 检查网络和跨域配置

4. **构建失败**
   ```bash
   # 检查代码类型错误
   npm run build
   # 查看详细错误信息
   ```

## 更新日志

### v1.0.0 (2024-01-20)
- ✨ 初始版本发布
- 🎨 完成UI设计和基础功能
- 🔐 用户认证系统
- 📱 积分签到功能
- 🎁 积分兑换系统
- 👥 组队瓜分功能
- 📊 记录查询功能

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

[MIT License](LICENSE)

## 联系方式

如有问题或建议，请通过以下方式联系：

- 项目Issues：[GitHub Issues](https://github.com/your-username/pufen/issues)
- 邮箱：your-email@example.com