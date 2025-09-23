# 前端API使用文档

本文档详细记录了前端应用中每个页面和组件使用的API接口，方便后端开发时优先实现对应接口。

## 🔄 核心认证流程 (Auth Service)

### 登录页面 (Login.tsx)
**使用的API接口:**
- `POST /auth/login` - 用户登录认证

**使用场景:**
```typescript
// 用户登录
const response = await authService.login({
  phone: "13800138000",
  password: "password123"
});
```

### 注册页面 (Register.tsx)
**使用的API接口:**
- `POST /auth/register` - 用户注册

**使用场景:**
```typescript
// 用户注册
const response = await authService.register({
  username: "张三",
  phone: "13800138000", 
  password: "password123"
});
```

### 认证状态管理 (store/auth.ts)
**使用的API接口:**
- `GET /auth/profile` - 获取用户信息
- Token管理和认证检查

**使用场景:**
```typescript
// 应用启动时检查认证状态
// 自动获取用户信息
const response = await authService.getProfile();
```

---

## 🏆 积分系统核心 (Points Service)

### 积分主页 (Points.tsx)
**使用的API接口:**
- `GET /points/account` - 获取积分账户信息
- `GET /signin/config` - 获取本周签到配置
- `GET /signin/status` - 获取签到状态
- `POST /signin` - 每日签到
- `POST /signin/makeup` - 补签

**使用场景:**
```typescript
// 页面加载时获取数据
Promise.all([
  pointsService.getPointsAccount(),      // 积分余额等
  pointsService.getWeeklyConfig(),       // 签到规则配置
  pointsService.getSignInStatus(),       // 本周签到记录
]);

// 用户签到
const response = await pointsService.signIn();

// 补签操作
const response = await pointsService.makeUpSignIn({
  date: "2025-09-23",
  method: "points"
});
```

**数据需求:**
- 用户当前积分余额、累计获得、累计使用
- 每日签到积分倍数配置
- 签到记录和连续签到状态

---

## 📊 记录查询 (Records.tsx)

**使用的API接口:**
- `GET /records/points` - 积分流水记录
- `GET /teams/my` - 我的团队记录  
- `GET /records/exchange` - 兑换记录

**使用场景:**
```typescript
// 积分记录
const pointsRes = await pointsService.getPointsTransactions({
  page: 1,
  limit: 20,
  type: 'earn' // 'earn' | 'use' | 'expire'
});

// 团队记录
const teamRes = await teamService.getMyTeams({
  page: 1,
  limit: 20,
  status: 'active' // 'active' | 'completed' | 'expired'
});

// 兑换记录
const exchangeRes = await rewardService.getExchangeRecords({
  page: 1,
  limit: 20,
  status: 'completed'
});
```

---

## 👥 团队功能 (Team Service)

### 在积分主页中使用
**使用的API接口:**
- `POST /teams` - 创建团队

**使用场景:**
```typescript
// 创建团队瓜分
const response = await teamService.createTeam({ 
  name: "每日签到团队" 
});
```

### 完整团队功能 (可选实现)
**其他团队API:**
- `POST /teams/{teamId}/join` - 加入团队
- `GET /teams/{teamId}` - 获取团队详情
- `GET /teams/available` - 获取可加入团队

---

## 🎁 兑换系统 (Reward Service)

### 在积分主页中使用 (优惠券兑换)
**预期API接口:**
- `GET /rewards` - 获取可兑换商品
- `POST /rewards/exchange` - 兑换商品

**当前实现:**
```typescript
// 优惠券硬编码数据，需要后端支持
const coupons = [
  { id: 1, name: "¥4优惠券", condition: "满29元可用", points: 5 },
  { id: 2, name: "¥6优惠券", condition: "满39元可用", points: 10 },
  // ... 更多优惠券
];
```

---

## 🏠 个人中心 (Profile.tsx)

**使用的API接口:**
- 主要通过 `auth store` 获取用户信息
- 主要通过 `points store` 获取积分统计

**数据来源:**
```typescript
// 用户基本信息
user.username, user.phone, user.createdAt

// 积分统计  
pointsAccount.balance        // 当前积分
pointsAccount.totalEarned   // 累计获得
pointsAccount.totalUsed     // 累计使用
```

---

## 📋 规则页面 (Rules.tsx)

**API需求:** 无
- 纯静态内容展示
- 显示积分规则、兑换规则等

---

## 📱 移动端演示 (MobileDemo.tsx)

**API需求:** 无
- 移动端功能测试页面
- 演示触摸、振动、分享等H5功能

---

## 🔒 路由保护 (ProtectedRoute.tsx)

**使用的API接口:**
- 依赖 `auth store` 的认证状态
- 开发模式下有自动登录功能

---

## 🚀 API实现优先级建议

### 第一阶段 (核心功能)
1. **认证系统** ⭐⭐⭐
   - `POST /auth/register` - 用户注册
   - `POST /auth/login` - 用户登录  
   - `GET /auth/profile` - 获取用户信息

2. **积分系统** ⭐⭐⭐
   - `GET /points/account` - 积分账户
   - `GET /signin/config` - 签到配置
   - `GET /signin/status` - 签到状态
   - `POST /signin` - 每日签到

### 第二阶段 (扩展功能)
3. **记录系统** ⭐⭐
   - `GET /records/points` - 积分记录

4. **补签功能** ⭐⭐
   - `POST /signin/makeup` - 补签

### 第三阶段 (高级功能)  
5. **团队功能** ⭐
   - `POST /teams` - 创建团队
   - `GET /teams/my` - 团队记录

6. **兑换系统** ⭐
   - `GET /rewards` - 兑换商品
   - `POST /rewards/exchange` - 兑换操作
   - `GET /records/exchange` - 兑换记录

---

## 📋 数据模型对应关系

### User (用户表)
```json
{
  "id": "uuid",
  "username": "用户昵称", 
  "phone": "手机号",
  "password": "加密密码",
  "isNewUser": "boolean",
  "createdAt": "创建时间",
  "updatedAt": "更新时间"
}
```

### PointsAccount (积分账户)
```json
{
  "id": "uuid",
  "userId": "用户ID",
  "balance": "当前积分",
  "totalEarned": "累计获得", 
  "totalUsed": "累计使用",
  "createdAt": "创建时间",
  "updatedAt": "更新时间"
}
```

### SignInConfig (签到配置)
```json
{
  "id": "uuid",
  "weekStartDate": "周开始日期",
  "basePoints": "基础积分",
  "day1Multiplier": "周一倍数",
  "day2Multiplier": "周二倍数",
  // ... 其他天倍数
  "bonusDay": "奖励日",
  "bonusCoupon": "奖励优惠券"
}
```

### SignInRecord (签到记录)  
```json
{
  "id": "uuid",
  "userId": "用户ID",
  "configId": "配置ID", 
  "signInDate": "签到日期",
  "pointsEarned": "获得积分",
  "isMakeUp": "是否补签",
  "makeUpCost": "补签成本"
}
```