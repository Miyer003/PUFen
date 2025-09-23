---
title: 默认模块
language_tabs:
  - shell: Shell
  - http: HTTP
  - javascript: JavaScript
  - ruby: Ruby
  - python: Python
  - php: PHP
  - java: Java
  - go: Go
toc_footers: []
includes: []
search: true
code_clipboard: true
highlight_theme: darkula
headingLevel: 2
generator: "@tarslib/widdershins v4.0.30"

---

# 默认模块

基于 React + Fastify + SQLite 的积分签到系统

Base URLs:

# Authentication

- HTTP Authentication, scheme: bearer

- HTTP Authentication, scheme: bearer

# 认证

## POST 用户注册

POST /auth/register

新用户注册账号

> Body 请求参数

```json
{}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 是 |none|

> 返回示例

> 201 Response

```json
{
  "success": true,
  "message": "注册成功",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "张三",
    "phone": "13800138000",
    "isNewUser": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

> 400 Response

```json
{
  "success": false,
  "message": "参数验证失败",
  "code": 400,
  "details": [
    {
      "field": "phone",
      "message": "手机号格式不正确"
    }
  ]
}
```

> 409 Response

```json
{
  "success": false,
  "message": "手机号已存在",
  "code": 409
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|注册成功|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|参数验证失败|Inline|
|409|[Conflict](https://tools.ietf.org/html/rfc7231#section-6.5.8)|手机号已存在|Inline|

### 返回数据结构

## POST 用户登录

POST /auth/login

用户登录系统

> Body 请求参数

```json
{}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 是 |none|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "张三",
    "phone": "13800138000",
    "isNewUser": true
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

> 401 Response

```json
{
  "success": false,
  "message": "用户名或密码错误",
  "code": 401
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|登录成功|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|用户名或密码错误|Inline|

### 返回数据结构

## GET 获取用户信息

GET /auth/profile

获取当前登录用户信息

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "获取成功",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "张三",
    "phone": "13800138000",
    "isNewUser": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

> 401 Response

```json
{
  "success": false,
  "message": "Token已失效或未提供",
  "code": 401
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|获取成功|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未授权或Token失效|Inline|

### 返回数据结构

# 积分

## GET 获取积分账户信息

GET /points/account

获取当前用户的积分账户详情

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "获取成功",
  "data": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "balance": 150,
    "totalEarned": 300,
    "totalUsed": 150
  }
}
```

> 401 Response

```json
{
  "success": false,
  "message": "Token已失效或未提供",
  "code": 401
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|获取成功|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未授权或Token失效|Inline|

### 返回数据结构

# 签到

## GET 获取签到状态

GET /signin

获取当前用户的签到状态和本周签到日历

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "获取成功",
  "data": {
    "todaySigned": false,
    "continuousDays": 3,
    "weekSignInStatus": [
      {
        "date": "2024-01-15",
        "signed": true,
        "points": 10,
        "isToday": false
      },
      {
        "date": "2024-01-16",
        "signed": true,
        "points": 15,
        "isToday": false
      },
      {
        "date": "2024-01-17",
        "signed": true,
        "points": 10,
        "isToday": false
      },
      {
        "date": "2024-01-18",
        "signed": false,
        "points": 0,
        "isToday": true
      }
    ]
  }
}
```

> 401 Response

```json
{
  "success": false,
  "message": "Token已失效或未提供",
  "code": 401
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|获取成功|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未授权或Token失效|Inline|

### 返回数据结构

## POST 每日签到

POST /signin

用户进行每日签到操作

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "签到成功",
  "data": {
    "pointsEarned": 10,
    "continuousDays": 4,
    "hasBonus": false,
    "bonusCoupon": null
  }
}
```

> 400 Response

```json
{
  "success": false,
  "message": "今日已签到",
  "code": 400
}
```

> 401 Response

```json
{
  "success": false,
  "message": "Token已失效或未提供",
  "code": 401
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|签到成功|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|今日已签到|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未授权或Token失效|Inline|

### 返回数据结构

## POST 补签

POST /signin/makeup

用户对漏签日期进行补签

> Body 请求参数

```json
{}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 是 |none|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "补签成功",
  "data": {
    "pointsEarned": 10,
    "pointsCost": 5
  }
}
```

> 补签失败

```json
{
  "success": false,
  "message": "该日期已补签",
  "code": 400
}
```

```json
{
  "success": false,
  "message": "积分不足",
  "code": 400
}
```

```json
{
  "success": false,
  "message": "只能补签过去7天内的日期",
  "code": 400
}
```

> 401 Response

```json
{
  "success": false,
  "message": "Token已失效或未提供",
  "code": 401
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|补签成功|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|补签失败|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未授权或Token失效|Inline|

### 返回数据结构

# 团队

## GET 获取团队列表

GET /teams

获取可加入的团队列表，支持按状态筛选

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|status|query|string| 否 |团队状态筛选|
|page|query|integer| 否 |页码|
|limit|query|integer| 否 |每页数量|

#### 枚举值

|属性|值|
|---|---|
|status|active|
|status|completed|
|status|expired|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "获取成功",
  "data": {
    "teams": [
      {
        "id": "a4ede8ba-7c0a-4485-8763-cbd9b282fbec",
        "captainId": "550e8400-e29b-41d4-a716-446655440000",
        "name": "优秀团队",
        "startTime": "2024-01-15T10:30:00.000Z",
        "endTime": "2024-01-15T13:30:00.000Z",
        "totalPoints": 100,
        "status": "active",
        "memberCount": 3,
        "remainingTime": 7200
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3
    }
  }
}
```

> 401 Response

```json
{
  "success": false,
  "message": "Token已失效或未提供",
  "code": 401
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|获取成功|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未授权或Token失效|Inline|

### 返回数据结构

## POST 创建团队

POST /teams

用户创建新的团队

> Body 请求参数

```json
{}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 是 |none|

> 返回示例

> 201 Response

```json
{
  "success": true,
  "message": "团队创建成功",
  "data": {
    "id": "a4ede8ba-7c0a-4485-8763-cbd9b282fbec",
    "captainId": "550e8400-e29b-41d4-a716-446655440000",
    "name": "优秀团队",
    "startTime": "2024-01-15T10:30:00.000Z",
    "endTime": "2024-01-15T13:30:00.000Z",
    "status": "active",
    "memberCount": 1,
    "remainingTime": 10800,
    "captainInfo": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "张三",
      "phone": "13800138000",
      "isNewUser": true
    },
    "members": [
      {
        "userInfo": {
          "id": "550e8400-e29b-41d4-a716-446655440000",
          "username": "张三",
          "phone": "13800138000",
          "isNewUser": true
        },
        "role": "captain",
        "pointsEarned": 50,
        "joinedAt": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

> 400 Response

```json
{
  "success": false,
  "message": "已有活跃团队，不能重复创建",
  "code": 400
}
```

> 401 Response

```json
{
  "success": false,
  "message": "Token已失效或未提供",
  "code": 401
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|创建成功|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|创建失败|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未授权或Token失效|Inline|

### 返回数据结构

## GET 获取团队详情

GET /teams/{teamId}

获取指定团队的详细信息

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|teamId|path|string(uuid)| 是 |none|

> 返回示例

> 200 Response

```json
{
  "data": {}
}
```

> 401 Response

```json
{
  "success": false,
  "message": "Token已失效或未提供",
  "code": 401
}
```

> 404 Response

```json
{
  "success": false,
  "message": "资源不存在",
  "code": 404
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|获取成功|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未授权或Token失效|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|资源不存在|Inline|

### 返回数据结构

## POST 加入团队

POST /teams/{teamId}/join

用户加入指定团队

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|teamId|path|string(uuid)| 是 |none|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "加入团队成功",
  "data": {
    "pointsEarned": 50,
    "teamInfo": {
      "id": "a4ede8ba-7c0a-4485-8763-cbd9b282fbec",
      "captainId": "550e8400-e29b-41d4-a716-446655440000",
      "name": "优秀团队",
      "startTime": "2024-01-15T10:30:00.000Z",
      "endTime": "2024-01-15T13:30:00.000Z",
      "status": "active",
      "memberCount": 4,
      "remainingTime": 5400
    }
  }
}
```

> 加入失败

```json
{
  "success": false,
  "message": "团队已满",
  "code": 400
}
```

```json
{
  "success": false,
  "message": "团队已过期",
  "code": 400
}
```

```json
{
  "success": false,
  "message": "已在团队中",
  "code": 400
}
```

> 401 Response

```json
{
  "success": false,
  "message": "Token已失效或未提供",
  "code": 401
}
```

> 404 Response

```json
{
  "success": false,
  "message": "资源不存在",
  "code": 404
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|加入成功|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|加入失败|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未授权或Token失效|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|资源不存在|Inline|

### 返回数据结构

# 兑换

## GET 获取可兑换商品

GET /rewards

获取当前可兑换的商品列表和阶段信息

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "获取成功",
  "data": {
    "items": [
      {
        "id": "0e4a4644-7d75-4d9d-8c9c-d029d4d9b698",
        "name": "满29减4优惠券",
        "description": "满29元减4元，有效期7天",
        "pointsCost": 20,
        "couponType": "满29减4",
        "couponValue": 4,
        "conditionAmount": 29,
        "stock": 100,
        "stage": 1,
        "isLimited": true
      }
    ],
    "currentStage": 1
  }
}
```

> 401 Response

```json
{
  "success": false,
  "message": "Token已失效或未提供",
  "code": 401
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|获取成功|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未授权或Token失效|Inline|

### 返回数据结构

## POST 兑换商品

POST /rewards/exchange

使用积分兑换指定商品

> Body 请求参数

```json
{}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 是 |none|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "兑换成功",
  "data": {
    "couponCode": "CODE123456",
    "pointsCost": 20,
    "newBalance": 130
  }
}
```

> 兑换失败

```json
{
  "success": false,
  "message": "积分不足",
  "code": 400
}
```

```json
{
  "success": false,
  "message": "库存不足",
  "code": 400
}
```

```json
{
  "success": false,
  "message": "当前阶段商品未解锁",
  "code": 400
}
```

> 401 Response

```json
{
  "success": false,
  "message": "Token已失效或未提供",
  "code": 401
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|兑换成功|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|兑换失败|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未授权或Token失效|Inline|

### 返回数据结构

## GET 获取兑换记录

GET /rewards/records

获取当前用户的兑换记录

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|page|query|integer| 否 |页码|
|limit|query|integer| 否 |每页数量|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "获取成功",
  "data": {
    "records": [
      {
        "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
        "userId": "550e8400-e29b-41d4-a716-446655440000",
        "rewardItemId": "0e4a4644-7d75-4d9d-8c9c-d029d4d9b698",
        "rewardItemInfo": {
          "name": "满29减4优惠券",
          "pointsCost": 20
        },
        "pointsCost": 20,
        "couponCode": "CODE123456",
        "status": "completed",
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

> 401 Response

```json
{
  "success": false,
  "message": "Token已失效或未提供",
  "code": 401
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|获取成功|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未授权或Token失效|Inline|

### 返回数据结构

# 记录

## GET 获取积分流水

GET /records/points

获取用户的积分获取和消耗记录

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|type|query|string| 否 |流水类型筛选|
|page|query|integer| 否 |页码|
|limit|query|integer| 否 |每页数量|

#### 枚举值

|属性|值|
|---|---|
|type|earn|
|type|use|
|type|expire|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "获取成功",
  "data": {
    "records": [
      {
        "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
        "amount": 10,
        "type": "earn",
        "source": "signin",
        "description": "周一签到",
        "balanceBefore": 140,
        "balanceAfter": 150,
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

> 401 Response

```json
{
  "success": false,
  "message": "Token已失效或未提供",
  "code": 401
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|获取成功|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未授权或Token失效|Inline|

### 返回数据结构

## GET 获取团队记录

GET /records/teams

获取用户参与的团队记录

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|page|query|integer| 否 |页码|
|limit|query|integer| 否 |每页数量|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "message": "获取成功",
  "data": {
    "records": [
      {
        "teamId": "a4ede8ba-7c0a-4485-8763-cbd9b282fbec",
        "teamName": "优秀团队",
        "role": "member",
        "pointsEarned": 50,
        "joinedAt": "2024-01-15T10:30:00.000Z",
        "status": "completed"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 3,
      "totalPages": 1
    }
  }
}
```

> 401 Response

```json
{
  "success": false,
  "message": "Token已失效或未提供",
  "code": 401
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|获取成功|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未授权或Token失效|Inline|

### 返回数据结构

# 数据模型

<h2 id="tocS_UnauthorizedError">UnauthorizedError</h2>

<a id="schemaunauthorizederror"></a>
<a id="schema_UnauthorizedError"></a>
<a id="tocSunauthorizederror"></a>
<a id="tocsunauthorizederror"></a>

```json
{}

```

### 属性

*None*

<h2 id="tocS_ForbiddenError">ForbiddenError</h2>

<a id="schemaforbiddenerror"></a>
<a id="schema_ForbiddenError"></a>
<a id="tocSforbiddenerror"></a>
<a id="tocsforbiddenerror"></a>

```json
{}

```

### 属性

*None*

<h2 id="tocS_NotFoundError">NotFoundError</h2>

<a id="schemanotfounderror"></a>
<a id="schema_NotFoundError"></a>
<a id="tocSnotfounderror"></a>
<a id="tocsnotfounderror"></a>

```json
{}

```

### 属性

*None*

<h2 id="tocS_ValidationError">ValidationError</h2>

<a id="schemavalidationerror"></a>
<a id="schema_ValidationError"></a>
<a id="tocSvalidationerror"></a>
<a id="tocsvalidationerror"></a>

```json
{}

```

### 属性

*None*

<h2 id="tocS_User">User</h2>

<a id="schemauser"></a>
<a id="schema_User"></a>
<a id="tocSuser"></a>
<a id="tocsuser"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "username": "string",
  "phone": "string",
  "password": "string",
  "isNewUser": true,
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z"
}

```

User

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|string(uuid)|false|none||主键，使用UUID自动生成，确保全局唯一性|
|username|string|true|none||用户昵称，限制最大长度50字符，用于显示|
|phone|string|true|none||用户手机号，限制长度20字符，唯一索引用于登录|
|password|string|true|none||加密后的密码，存储使用bcrypt加密后的哈希值|
|isNewUser|boolean|false|none||新用户标识，true表示新用户，享受新用户权益|
|createdAt|string(date-time)|false|none||记录创建时间，自动设置为记录插入时间|
|updatedAt|string(date-time)|false|none||记录更新时间，自动在记录变更时更新|

<h2 id="tocS_PointsAccount">PointsAccount</h2>

<a id="schemapointsaccount"></a>
<a id="schema_PointsAccount"></a>
<a id="tocSpointsaccount"></a>
<a id="tocspointsaccount"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "userId": "2c4a230c-5085-4924-a3e1-25fb4fc5965b",
  "balance": 0,
  "totalEarned": 0,
  "totalUsed": 0,
  "createdAt": "2019-08-24T14:15:22Z",
  "updatedAt": "2019-08-24T14:15:22Z"
}

```

PointsAccount

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|string(uuid)|false|none||主键，使用UUID自动生成|
|userId|string(uuid)|true|none||关联的用户ID，与User表一对一关系|
|balance|integer|false|none||当前可用积分余额，默认0|
|totalEarned|integer|false|none||累计获得积分总额，统计用|
|totalUsed|integer|false|none||累计使用积分总额，统计用|
|createdAt|string(date-time)|false|none||账户创建时间|
|updatedAt|string(date-time)|false|none||账户最后更新时间|

<h2 id="tocS_SignInConfig">SignInConfig</h2>

<a id="schemasigninconfig"></a>
<a id="schema_SignInConfig"></a>
<a id="tocSsigninconfig"></a>
<a id="tocssigninconfig"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "weekStartDate": "2019-08-24",
  "basePoints": 10,
  "day1Multiplier": 1,
  "day2Multiplier": 0,
  "day3Multiplier": 0,
  "day4Multiplier": 0,
  "day5Multiplier": 0,
  "day6Multiplier": 0.6,
  "day7Multiplier": 2,
  "bonusDay": 3,
  "bonusCoupon": "string",
  "createdAt": "2019-08-24T14:15:22Z"
}

```

SignInConfig

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|string(uuid)|false|none||配置ID，主键|
|weekStartDate|string(date)|true|none||本周开始日期（每周一）|
|basePoints|integer|false|none||基础积分值，固定10分|
|day1Multiplier|number|false|none||周一积分倍数，默认1.0（10分）|
|day2Multiplier|number|false|none||周二积分倍数，随机1.0或1.5|
|day3Multiplier|number|false|none||周三积分倍数，随机1.0或1.5|
|day4Multiplier|number|false|none||周四积分倍数，随机1.0或1.5|
|day5Multiplier|number|false|none||周五积分倍数，随机1.0或1.5|
|day6Multiplier|number|false|none||周六积分倍数，固定0.6（6分）|
|day7Multiplier|number|false|none||周日积分倍数，固定2.0（20分）|
|bonusDay|integer|true|none||连续签到奖励日（3-5中随机一天）|
|bonusCoupon|string|true|none||连续签到奖励的优惠券类型|
|createdAt|string(date-time)|false|none||配置创建时间|

<h2 id="tocS_SignInRecord">SignInRecord</h2>

<a id="schemasigninrecord"></a>
<a id="schema_SignInRecord"></a>
<a id="tocSsigninrecord"></a>
<a id="tocssigninrecord"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "userId": "2c4a230c-5085-4924-a3e1-25fb4fc5965b",
  "configId": "46ff6d11-d8b2-40d8-9197-dfa33c61cd6c",
  "signInDate": "2019-08-24",
  "pointsEarned": 0,
  "isMakeUp": false,
  "makeUpCost": 0,
  "createdAt": "2019-08-24T14:15:22Z"
}

```

SignInRecord

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|string(uuid)|false|none||记录ID，主键|
|userId|string(uuid)|true|none||关联的用户ID|
|configId|string(uuid)|true|none||关联的签到配置ID|
|signInDate|string(date)|true|none||签到日期（实际签到或补签的日期）|
|pointsEarned|integer|true|none||本次签到获得的积分数|
|isMakeUp|boolean|false|none||是否为补签记录|
|makeUpCost|any|false|none||补签消耗的积分数（5分）或标记为'order'表示通过下单补签|

oneOf

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» *anonymous*|integer|false|none||补签消耗的积分数（5分）|

xor

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» *anonymous*|string|false|none||标记为通过下单补签|

continued

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|createdAt|string(date-time)|false|none||记录创建时间|

<h2 id="tocS_Team">Team</h2>

<a id="schemateam"></a>
<a id="schema_Team"></a>
<a id="tocSteam"></a>
<a id="tocsteam"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "captainId": "d51ca372-714e-4331-a899-f985372f740f",
  "name": "string",
  "startTime": "2019-08-24T14:15:22Z",
  "endTime": "2019-08-24T14:15:22Z",
  "totalPoints": 100,
  "status": "active",
  "createdAt": "2019-08-24T14:15:22Z"
}

```

Team

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|string(uuid)|false|none||团队ID，主键|
|captainId|string(uuid)|true|none||队长用户ID|
|name|string|true|none||团队名称，最大长度50字符|
|startTime|string(date-time)|true|none||团队创建/开始时间|
|endTime|string(date-time)|true|none||团队结束时间（开始时间+3小时）|
|totalPoints|integer|false|none||团队总积分池，固定100分|
|status|string|false|none||团队状态|
|createdAt|string(date-time)|false|none||记录创建时间|

#### 枚举值

|属性|值|
|---|---|
|status|active|
|status|completed|
|status|expired|

<h2 id="tocS_TeamMember">TeamMember</h2>

<a id="schemateammember"></a>
<a id="schema_TeamMember"></a>
<a id="tocSteammember"></a>
<a id="tocsteammember"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "teamId": "a4ede8ba-7c0a-4485-8763-cbd9b282fbec",
  "userId": "2c4a230c-5085-4924-a3e1-25fb4fc5965b",
  "role": "captain",
  "isNewUser": true,
  "pointsEarned": 0,
  "joinedAt": "2019-08-24T14:15:22Z"
}

```

TeamMember

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|string(uuid)|false|none||记录ID，主键|
|teamId|string(uuid)|true|none||关联的团队ID|
|userId|string(uuid)|true|none||关联的用户ID|
|role|string|true|none||成员角色：队长或队员|
|isNewUser|boolean|true|none||加入时是否为新用户|
|pointsEarned|integer|true|none||该成员获得的积分数|
|joinedAt|string(date-time)|true|none||加入团队的时间|

#### 枚举值

|属性|值|
|---|---|
|role|captain|
|role|member|

<h2 id="tocS_RewardItem">RewardItem</h2>

<a id="schemarewarditem"></a>
<a id="schema_RewardItem"></a>
<a id="tocSrewarditem"></a>
<a id="tocsrewarditem"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "name": "string",
  "description": "string",
  "pointsCost": 5,
  "couponType": "string",
  "couponValue": 0,
  "conditionAmount": 0,
  "stock": 0,
  "stage": 1,
  "isLimited": true,
  "createdAt": "2019-08-24T14:15:22Z"
}

```

RewardItem

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|string(uuid)|false|none||商品ID，主键|
|name|string|true|none||商品名称，如'满29减4优惠券'|
|description|string|true|none||商品详细描述|
|pointsCost|integer|true|none||兑换所需积分（5/10/15/20/25/30）|
|couponType|string|true|none||优惠券类型，如'满29减4'|
|couponValue|number|true|none||优惠券实际优惠金额|
|conditionAmount|number|true|none||满减条件金额（如29元）|
|stock|integer|true|none||库存数量|
|stage|integer|true|none||所属阶段（1/2）|
|isLimited|boolean|true|none||是否限量兑换|
|createdAt|string(date-time)|false|none||商品创建时间|

#### 枚举值

|属性|值|
|---|---|
|pointsCost|5|
|pointsCost|10|
|pointsCost|15|
|pointsCost|20|
|pointsCost|25|
|pointsCost|30|
|stage|1|
|stage|2|

<h2 id="tocS_RewardRecord">RewardRecord</h2>

<a id="schemarewardrecord"></a>
<a id="schema_RewardRecord"></a>
<a id="tocSrewardrecord"></a>
<a id="tocsrewardrecord"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "userId": "2c4a230c-5085-4924-a3e1-25fb4fc5965b",
  "rewardItemId": "0e4a4644-7d75-4d9d-8c9c-d029d4d9b698",
  "pointsCost": 0,
  "couponCode": "string",
  "status": "pending",
  "createdAt": "2019-08-24T14:15:22Z"
}

```

RewardRecord

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|string(uuid)|false|none||记录ID，主键|
|userId|string(uuid)|true|none||兑换用户ID|
|rewardItemId|string(uuid)|true|none||兑换的商品ID|
|pointsCost|integer|true|none||消耗的积分数|
|couponCode|string|true|none||生成的优惠券兑换码|
|status|string|false|none||兑换状态|
|createdAt|string(date-time)|false|none||记录创建时间|

#### 枚举值

|属性|值|
|---|---|
|status|pending|
|status|completed|
|status|cancelled|

