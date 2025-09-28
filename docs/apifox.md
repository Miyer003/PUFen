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
{
  "username": "hlk",
  "phone": "13950261469",
  "password": "333777"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|

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
{
  "phone": "15617612681",
  "password": "333777"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|

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

## GET 1. 获取本周签到配置

GET /signin/config

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": {
    "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
    "weekStartDate": "2019-08-24",
    "basePoints": 10,
    "day1Multiplier": 1,
    "day2Multiplier": 1.5,
    "day3Multiplier": 1,
    "day4Multiplier": 1.5,
    "day5Multiplier": 1,
    "day6Multiplier": 0.6,
    "day7Multiplier": 2,
    "bonusDay": 4,
    "bonusCoupon": "满29减4",
    "createdAt": "2019-08-24T14:15:22Z"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未认证|[Error](#schemaerror)|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|false|none||none|
|» data|[SignInConfig](#schemasigninconfig)|false|none||none|
|»» id|string(uuid)|false|none||none|
|»» weekStartDate|string(date)|false|none||none|
|»» basePoints|integer|false|none||none|
|»» day1Multiplier|number|false|none||none|
|»» day2Multiplier|number|false|none||none|
|»» day3Multiplier|number|false|none||none|
|»» day4Multiplier|number|false|none||none|
|»» day5Multiplier|number|false|none||none|
|»» day6Multiplier|number|false|none||none|
|»» day7Multiplier|number|false|none||none|
|»» bonusDay|integer|false|none||none|
|»» bonusCoupon|string|false|none||none|
|»» createdAt|string(date-time)|false|none||none|

状态码 **401**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|false|none||none|
|» message|string|false|none||none|

## GET 2. 获取签到状态

GET /signin/status

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": {
    "todaySigned": true,
    "continuousDays": 0,
    "weekStatus": [
      {
        "date": "2019-08-24",
        "signed": true,
        "points": 0,
        "isToday": true
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未认证|[Error](#schemaerror)|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|false|none||none|
|» data|[SignInStatus](#schemasigninstatus)|false|none||none|
|»» todaySigned|boolean|false|none||none|
|»» continuousDays|integer|false|none||none|
|»» weekStatus|[object]|false|none||none|
|»»» date|string(date)|false|none||none|
|»»» signed|boolean|false|none||none|
|»»» points|integer|false|none||none|
|»»» isToday|boolean|false|none||none|

状态码 **401**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|false|none||none|
|» message|string|false|none||none|

## POST 3. 每日签到

POST /signin

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": {
    "pointsEarned": 0,
    "continuousDays": 0,
    "hasBonus": true,
    "bonusCoupon": "string"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|签到成功|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|今日已签到|[Error](#schemaerror)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未认证|[Error](#schemaerror)|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|false|none||none|
|» data|[SignInResponse](#schemasigninresponse)|false|none||none|
|»» pointsEarned|integer|false|none||none|
|»» continuousDays|integer|false|none||none|
|»» hasBonus|boolean|false|none||none|
|»» bonusCoupon|string¦null|false|none||none|

状态码 **400**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|false|none||none|
|» message|string|false|none||none|

状态码 **401**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|false|none||none|
|» message|string|false|none||none|

## POST 4. 补签

POST /signin/makeup

> Body 请求参数

```json
{
  "date": "2025-09-23",
  "method": "points"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[MakeUpRequest](#schemamakeuprequest)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": {
    "pointsEarned": 0,
    "pointsCost": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|补签成功|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|已补签或积分不足|[Error](#schemaerror)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未认证|[Error](#schemaerror)|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|false|none||none|
|» data|object|false|none||none|
|»» pointsEarned|integer|false|none||none|
|»» pointsCost|integer|false|none||实际消耗积分，方法为 points 时返回|

状态码 **400**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|false|none||none|
|» message|string|false|none||none|

状态码 **401**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|false|none||none|
|» message|string|false|none||none|

# 团队

## POST 1. 创建团队

POST /teams

> Body 请求参数

```json
{
  "name": "三无学习机"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|object| 否 |none|
|» name|body|string| 是 |none|

> 返回示例

> 201 Response

```json
{
  "success": true,
  "data": {
    "team": {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "captainId": "d51ca372-714e-4331-a899-f985372f740f",
      "name": "string",
      "startTime": "2019-08-24T14:15:22Z",
      "endTime": "2019-08-24T14:15:22Z",
      "totalPoints": 100,
      "status": "active",
      "memberCount": 0,
      "remainingTime": 0
    },
    "member": {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "teamId": "a4ede8ba-7c0a-4485-8763-cbd9b282fbec",
      "userId": "2c4a230c-5085-4924-a3e1-25fb4fc5965b",
      "role": "captain",
      "isNewUser": true,
      "pointsEarned": 0,
      "joinedAt": "2019-08-24T14:15:22Z"
    },
    "pointsEarned": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|201|[Created](https://tools.ietf.org/html/rfc7231#section-6.3.2)|创建成功|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|已有活跃团队|[Error](#schemaerror)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未认证|[Error](#schemaerror)|

### 返回数据结构

状态码 **201**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|false|none||none|
|» data|object|false|none||none|
|»» team|[Team](#schemateam)|false|none||none|
|»»» id|string(uuid)|false|none||none|
|»»» captainId|string(uuid)|false|none||none|
|»»» name|string|false|none||none|
|»»» startTime|string(date-time)|false|none||none|
|»»» endTime|string(date-time)|false|none||none|
|»»» totalPoints|integer|false|none||none|
|»»» status|string|false|none||none|
|»»» memberCount|integer|false|none||none|
|»»» remainingTime|integer|false|none||剩余秒数|
|»» member|[TeamMember](#schemateammember)|false|none||none|
|»»» id|string(uuid)|false|none||none|
|»»» teamId|string(uuid)|false|none||none|
|»»» userId|string(uuid)|false|none||none|
|»»» role|string|false|none||none|
|»»» isNewUser|boolean|false|none||none|
|»»» pointsEarned|integer|false|none||none|
|»»» joinedAt|string(date-time)|false|none||none|
|»» pointsEarned|integer|false|none||队长首次获得积分|

#### 枚举值

|属性|值|
|---|---|
|status|active|
|status|completed|
|status|expired|
|role|captain|
|role|member|

状态码 **400**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|false|none||none|
|» message|string|false|none||none|

状态码 **401**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|false|none||none|
|» message|string|false|none||none|

## POST 2. 加入团队

POST /teams/{teamId}/join

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|teamId|path|string(uuid)| 是 |none|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": {
    "pointsEarned": 0,
    "teamInfo": {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "captainId": "d51ca372-714e-4331-a899-f985372f740f",
      "name": "string",
      "startTime": "2019-08-24T14:15:22Z",
      "endTime": "2019-08-24T14:15:22Z",
      "totalPoints": 100,
      "status": "active",
      "memberCount": 0,
      "remainingTime": 0
    }
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|加入成功|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|团队已满/已过期/已在团队中|[Error](#schemaerror)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未认证|[Error](#schemaerror)|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|false|none||none|
|» data|object|false|none||none|
|»» pointsEarned|integer|false|none||none|
|»» teamInfo|[Team](#schemateam)|false|none||none|
|»»» id|string(uuid)|false|none||none|
|»»» captainId|string(uuid)|false|none||none|
|»»» name|string|false|none||none|
|»»» startTime|string(date-time)|false|none||none|
|»»» endTime|string(date-time)|false|none||none|
|»»» totalPoints|integer|false|none||none|
|»»» status|string|false|none||none|
|»»» memberCount|integer|false|none||none|
|»»» remainingTime|integer|false|none||剩余秒数|

#### 枚举值

|属性|值|
|---|---|
|status|active|
|status|completed|
|status|expired|

状态码 **400**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|false|none||none|
|» message|string|false|none||none|

状态码 **401**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|false|none||none|
|» message|string|false|none||none|

## GET 3. 我的团队记录

GET /teams/my

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|page|query|integer| 否 |none|
|limit|query|integer| 否 |none|
|status|query|string| 否 |none|

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
  "data": {
    "records": [
      {
        "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
        "teamId": "a4ede8ba-7c0a-4485-8763-cbd9b282fbec",
        "userId": "2c4a230c-5085-4924-a3e1-25fb4fc5965b",
        "role": "[",
        "isNewUser": true,
        "pointsEarned": 0,
        "joinedAt": "2019-08-24T14:15:22Z",
        "team": {}
      }
    ],
    "pagination": {}
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未认证|[Error](#schemaerror)|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|false|none||none|
|» data|object|false|none||none|
|»» records|[allOf]|false|none||none|

*allOf*

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|»»» *anonymous*|[TeamMember](#schemateammember)|false|none||none|
|»»»» id|string(uuid)|false|none||none|
|»»»» teamId|string(uuid)|false|none||none|
|»»»» userId|string(uuid)|false|none||none|
|»»»» role|string|false|none||none|
|»»»» isNewUser|boolean|false|none||none|
|»»»» pointsEarned|integer|false|none||none|
|»»»» joinedAt|string(date-time)|false|none||none|

*and*

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|»»» *anonymous*|object|false|none||none|
|»»»» team|[Team](#schemateam)|false|none||none|
|»»»»» id|string(uuid)|false|none||none|
|»»»»» captainId|string(uuid)|false|none||none|
|»»»»» name|string|false|none||none|
|»»»»» startTime|string(date-time)|false|none||none|
|»»»»» endTime|string(date-time)|false|none||none|
|»»»»» totalPoints|integer|false|none||none|
|»»»»» status|string|false|none||none|
|»»»»» memberCount|integer|false|none||none|
|»»»»» remainingTime|integer|false|none||剩余秒数|

*continued*

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|»» pagination|object|false|none||none|

#### 枚举值

|属性|值|
|---|---|
|role|captain|
|role|member|
|status|active|
|status|completed|
|status|expired|

状态码 **401**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|false|none||none|
|» message|string|false|none||none|

## GET 4. 团队详情

GET /teams/{teamId}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|teamId|path|string(uuid)| 是 |none|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": {
    "team": {
      "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
      "captainId": "d51ca372-714e-4331-a899-f985372f740f",
      "name": "string",
      "startTime": "2019-08-24T14:15:22Z",
      "endTime": "2019-08-24T14:15:22Z",
      "totalPoints": 100,
      "status": "active",
      "memberCount": 0,
      "remainingTime": 0
    },
    "members": [
      {
        "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
        "teamId": "a4ede8ba-7c0a-4485-8763-cbd9b282fbec",
        "userId": "2c4a230c-5085-4924-a3e1-25fb4fc5965b",
        "role": "captain",
        "isNewUser": true,
        "pointsEarned": 0,
        "joinedAt": "2019-08-24T14:15:22Z"
      }
    ]
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未认证|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|团队不存在|[Error](#schemaerror)|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|false|none||none|
|» data|object|false|none||none|
|»» team|[Team](#schemateam)|false|none||none|
|»»» id|string(uuid)|false|none||none|
|»»» captainId|string(uuid)|false|none||none|
|»»» name|string|false|none||none|
|»»» startTime|string(date-time)|false|none||none|
|»»» endTime|string(date-time)|false|none||none|
|»»» totalPoints|integer|false|none||none|
|»»» status|string|false|none||none|
|»»» memberCount|integer|false|none||none|
|»»» remainingTime|integer|false|none||剩余秒数|
|»» members|[[TeamMember](#schemateammember)]|false|none||none|
|»»» id|string(uuid)|false|none||none|
|»»» teamId|string(uuid)|false|none||none|
|»»» userId|string(uuid)|false|none||none|
|»»» role|string|false|none||none|
|»»» isNewUser|boolean|false|none||none|
|»»» pointsEarned|integer|false|none||none|
|»»» joinedAt|string(date-time)|false|none||none|

#### 枚举值

|属性|值|
|---|---|
|status|active|
|status|completed|
|status|expired|
|role|captain|
|role|member|

状态码 **401**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|false|none||none|
|» message|string|false|none||none|

状态码 **404**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|false|none||none|
|» message|string|false|none||none|

## GET 5. 可加入团队列表

GET /teams/available

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|page|query|integer| 否 |none|
|limit|query|integer| 否 |none|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": {
    "teams": [
      {
        "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
        "captainId": "d51ca372-714e-4331-a899-f985372f740f",
        "name": "string",
        "startTime": "2019-08-24T14:15:22Z",
        "endTime": "2019-08-24T14:15:22Z",
        "totalPoints": 100,
        "status": "[",
        "memberCount": 0,
        "remainingTime": 0,
        "captainName": "string"
      }
    ],
    "pagination": {}
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未认证|[Error](#schemaerror)|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|false|none||none|
|» data|object|false|none||none|
|»» teams|[allOf]|false|none||none|

*allOf*

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|»»» *anonymous*|[Team](#schemateam)|false|none||none|
|»»»» id|string(uuid)|false|none||none|
|»»»» captainId|string(uuid)|false|none||none|
|»»»» name|string|false|none||none|
|»»»» startTime|string(date-time)|false|none||none|
|»»»» endTime|string(date-time)|false|none||none|
|»»»» totalPoints|integer|false|none||none|
|»»»» status|string|false|none||none|
|»»»» memberCount|integer|false|none||none|
|»»»» remainingTime|integer|false|none||剩余秒数|

*and*

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|»»» *anonymous*|object|false|none||none|
|»»»» memberCount|integer|false|none||none|
|»»»» captainName|string|false|none||none|

*continued*

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|»» pagination|object|false|none||none|

#### 枚举值

|属性|值|
|---|---|
|status|active|
|status|completed|
|status|expired|

状态码 **401**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|false|none||none|
|» message|string|false|none||none|

# 兑换

## GET 1. 可兑换商品列表

GET /rewards

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|stage|query|integer| 否 |阶段筛选|
|isLimited|query|boolean| 否 |none|
|page|query|integer| 否 |none|
|limit|query|integer| 否 |none|

#### 枚举值

|属性|值|
|---|---|
|stage|1|
|stage|2|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
        "name": "满29减4优惠券",
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
    ],
    "currentStage": 1,
    "stage2Unlocked": false
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未认证|[Error](#schemaerror)|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|false|none||none|
|» data|object|false|none||none|
|»» items|[[RewardItem](#schemarewarditem)]|false|none||none|
|»»» id|string(uuid)|false|none||none|
|»»» name|string|false|none||none|
|»»» description|string|false|none||none|
|»»» pointsCost|integer|false|none||none|
|»»» couponType|string|false|none||none|
|»»» couponValue|number|false|none||none|
|»»» conditionAmount|number|false|none||none|
|»»» stock|integer|false|none||none|
|»»» stage|integer|false|none||none|
|»»» isLimited|boolean|false|none||none|
|»»» createdAt|string(date-time)|false|none||none|
|»» currentStage|integer|false|none||none|
|»» stage2Unlocked|boolean|false|none||none|

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

状态码 **401**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|false|none||none|
|» message|string|false|none||none|

## POST 2. 兑换商品

POST /rewards/exchange

> Body 请求参数

```json
{
  "rewardItemId": "ab78a487-ee11-4779-a0eb-51d43f905e3f"
}
```

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|body|body|[ExchangeRequest](#schemaexchangerequest)| 否 |none|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": {
    "couponCode": "CODE123456",
    "pointsCost": 0,
    "newBalance": 0
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|兑换成功|[ExchangeResponse](#schemaexchangeresponse)|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|积分不足/库存不足/未解锁|[Error](#schemaerror)|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未认证|[Error](#schemaerror)|

## GET 3. 优惠券详情

GET /coupons/{couponCode}

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|couponCode|path|string| 是 |none|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": {
    "couponCode": "string",
    "couponType": "string",
    "couponValue": 0,
    "conditionAmount": 0,
    "status": "active",
    "expiryDate": "2019-08-24T14:15:22Z"
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未认证|[Error](#schemaerror)|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|优惠券不存在|[Error](#schemaerror)|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|false|none||none|
|» data|object|false|none||none|
|»» couponCode|string|false|none||none|
|»» couponType|string|false|none||none|
|»» couponValue|number|false|none||none|
|»» conditionAmount|number|false|none||none|
|»» status|string|false|none||none|
|»» expiryDate|string(date-time)|false|none||none|

#### 枚举值

|属性|值|
|---|---|
|status|active|
|status|used|
|status|expired|

状态码 **401**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|false|none||none|
|» message|string|false|none||none|

状态码 **404**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|false|none||none|
|» message|string|false|none||none|

# 记录

## GET 1. 积分流水记录

GET /records/points

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|type|query|string| 否 |筛选类型|
|page|query|integer| 否 |none|
|limit|query|integer| 否 |none|

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
  "data": {
    "records": [
      {
        "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
        "amount": 0,
        "type": "earn",
        "source": "signin",
        "description": "周一签到",
        "balanceBefore": 0,
        "balanceAfter": 0,
        "createdAt": "2019-08-24T14:15:22Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 1,
      "total": 0,
      "totalPages": 0
    }
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未认证|[Error](#schemaerror)|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|false|none||none|
|» data|object|false|none||none|
|»» records|[[PointsTransaction](#schemapointstransaction)]|false|none||none|
|»»» id|string(uuid)|false|none||none|
|»»» amount|integer|false|none||正数收入，负数支出|
|»»» type|string|false|none||none|
|»»» source|string|false|none||none|
|»»» description|string|false|none||none|
|»»» balanceBefore|integer|false|none||none|
|»»» balanceAfter|integer|false|none||none|
|»»» createdAt|string(date-time)|false|none||none|
|»» pagination|[Pagination](#schemapagination)|false|none||none|
|»»» page|integer|false|none||none|
|»»» limit|integer|false|none||none|
|»»» total|integer|false|none||none|
|»»» totalPages|integer|false|none||none|

#### 枚举值

|属性|值|
|---|---|
|type|earn|
|type|use|
|type|expire|
|source|signin|
|source|team|
|source|reward|
|source|makeup|
|source|order|

状态码 **401**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|false|none||none|
|» message|string|false|none||none|

## GET 2. 兑换记录

GET /records/exchange

### 请求参数

|名称|位置|类型|必选|说明|
|---|---|---|---|---|
|status|query|string| 否 |none|
|page|query|integer| 否 |none|
|limit|query|integer| 否 |none|

#### 枚举值

|属性|值|
|---|---|
|status|pending|
|status|completed|
|status|cancelled|

> 返回示例

> 200 Response

```json
{
  "success": true,
  "data": {
    "records": [
      {
        "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
        "userId": "2c4a230c-5085-4924-a3e1-25fb4fc5965b",
        "rewardItemId": "0e4a4644-7d75-4d9d-8c9c-d029d4d9b698",
        "rewardItemInfo": {
          "name": "string",
          "pointsCost": 0
        },
        "pointsCost": 0,
        "couponCode": "string",
        "status": "pending",
        "createdAt": "2019-08-24T14:15:22Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 1,
      "total": 0,
      "totalPages": 0
    }
  }
}
```

### 返回结果

|状态码|状态码含义|说明|数据模型|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|成功|Inline|
|401|[Unauthorized](https://tools.ietf.org/html/rfc7235#section-3.1)|未认证|[Error](#schemaerror)|

### 返回数据结构

状态码 **200**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|false|none||none|
|» data|object|false|none||none|
|»» records|[[RewardRecord](#schemarewardrecord)]|false|none||none|
|»»» id|string(uuid)|false|none||none|
|»»» userId|string(uuid)|false|none||none|
|»»» rewardItemId|string(uuid)|false|none||none|
|»»» rewardItemInfo|object|false|none||none|
|»»»» name|string|false|none||none|
|»»»» pointsCost|integer|false|none||none|
|»»» pointsCost|integer|false|none||none|
|»»» couponCode|string|false|none||none|
|»»» status|string|false|none||none|
|»»» createdAt|string(date-time)|false|none||none|
|»» pagination|[Pagination](#schemapagination)|false|none||none|
|»»» page|integer|false|none||none|
|»»» limit|integer|false|none||none|
|»»» total|integer|false|none||none|
|»»» totalPages|integer|false|none||none|

#### 枚举值

|属性|值|
|---|---|
|status|pending|
|status|completed|
|status|cancelled|

状态码 **401**

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|» success|boolean|false|none||none|
|» message|string|false|none||none|

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
  "day2Multiplier": 1.5,
  "day3Multiplier": 1,
  "day4Multiplier": 1.5,
  "day5Multiplier": 1,
  "day6Multiplier": 0.6,
  "day7Multiplier": 2,
  "bonusDay": 4,
  "bonusCoupon": "满29减4",
  "createdAt": "2019-08-24T14:15:22Z"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|string(uuid)|false|none||none|
|weekStartDate|string(date)|false|none||none|
|basePoints|integer|false|none||none|
|day1Multiplier|number|false|none||none|
|day2Multiplier|number|false|none||none|
|day3Multiplier|number|false|none||none|
|day4Multiplier|number|false|none||none|
|day5Multiplier|number|false|none||none|
|day6Multiplier|number|false|none||none|
|day7Multiplier|number|false|none||none|
|bonusDay|integer|false|none||none|
|bonusCoupon|string|false|none||none|
|createdAt|string(date-time)|false|none||none|

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
  "memberCount": 0,
  "remainingTime": 0
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|string(uuid)|false|none||none|
|captainId|string(uuid)|false|none||none|
|name|string|false|none||none|
|startTime|string(date-time)|false|none||none|
|endTime|string(date-time)|false|none||none|
|totalPoints|integer|false|none||none|
|status|string|false|none||none|
|memberCount|integer|false|none||none|
|remainingTime|integer|false|none||剩余秒数|

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

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|string(uuid)|false|none||none|
|teamId|string(uuid)|false|none||none|
|userId|string(uuid)|false|none||none|
|role|string|false|none||none|
|isNewUser|boolean|false|none||none|
|pointsEarned|integer|false|none||none|
|joinedAt|string(date-time)|false|none||none|

#### 枚举值

|属性|值|
|---|---|
|role|captain|
|role|member|

<h2 id="tocS_SignInStatus">SignInStatus</h2>

<a id="schemasigninstatus"></a>
<a id="schema_SignInStatus"></a>
<a id="tocSsigninstatus"></a>
<a id="tocssigninstatus"></a>

```json
{
  "todaySigned": true,
  "continuousDays": 0,
  "weekStatus": [
    {
      "date": "2019-08-24",
      "signed": true,
      "points": 0,
      "isToday": true
    }
  ]
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|todaySigned|boolean|false|none||none|
|continuousDays|integer|false|none||none|
|weekStatus|[object]|false|none||none|
|» date|string(date)|false|none||none|
|» signed|boolean|false|none||none|
|» points|integer|false|none||none|
|» isToday|boolean|false|none||none|

<h2 id="tocS_SignInResponse">SignInResponse</h2>

<a id="schemasigninresponse"></a>
<a id="schema_SignInResponse"></a>
<a id="tocSsigninresponse"></a>
<a id="tocssigninresponse"></a>

```json
{
  "pointsEarned": 0,
  "continuousDays": 0,
  "hasBonus": true,
  "bonusCoupon": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|pointsEarned|integer|false|none||none|
|continuousDays|integer|false|none||none|
|hasBonus|boolean|false|none||none|
|bonusCoupon|string¦null|false|none||none|

<h2 id="tocS_MakeUpRequest">MakeUpRequest</h2>

<a id="schemamakeuprequest"></a>
<a id="schema_MakeUpRequest"></a>
<a id="tocSmakeuprequest"></a>
<a id="tocsmakeuprequest"></a>

```json
{
  "date": "2019-08-24",
  "method": "points"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|date|string(date)|true|none||补签日期|
|method|string|true|none||补签方式|

#### 枚举值

|属性|值|
|---|---|
|method|points|
|method|order|

<h2 id="tocS_Error">Error</h2>

<a id="schemaerror"></a>
<a id="schema_Error"></a>
<a id="tocSerror"></a>
<a id="tocserror"></a>

```json
{
  "success": false,
  "message": "string"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|success|boolean|false|none||none|
|message|string|false|none||none|

<h2 id="tocS_RewardItem">RewardItem</h2>

<a id="schemarewarditem"></a>
<a id="schema_RewardItem"></a>
<a id="tocSrewarditem"></a>
<a id="tocsrewarditem"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "name": "满29减4优惠券",
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

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|string(uuid)|false|none||none|
|name|string|false|none||none|
|description|string|false|none||none|
|pointsCost|integer|false|none||none|
|couponType|string|false|none||none|
|couponValue|number|false|none||none|
|conditionAmount|number|false|none||none|
|stock|integer|false|none||none|
|stage|integer|false|none||none|
|isLimited|boolean|false|none||none|
|createdAt|string(date-time)|false|none||none|

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

<h2 id="tocS_ExchangeRequest">ExchangeRequest</h2>

<a id="schemaexchangerequest"></a>
<a id="schema_ExchangeRequest"></a>
<a id="tocSexchangerequest"></a>
<a id="tocsexchangerequest"></a>

```json
{
  "rewardItemId": "0e4a4644-7d75-4d9d-8c9c-d029d4d9b698"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|rewardItemId|string(uuid)|true|none||商品ID|

<h2 id="tocS_ExchangeResponse">ExchangeResponse</h2>

<a id="schemaexchangeresponse"></a>
<a id="schema_ExchangeResponse"></a>
<a id="tocSexchangeresponse"></a>
<a id="tocsexchangeresponse"></a>

```json
{
  "success": true,
  "data": {
    "couponCode": "CODE123456",
    "pointsCost": 0,
    "newBalance": 0
  }
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|success|boolean|false|none||none|
|data|object|false|none||none|
|» couponCode|string|false|none||none|
|» pointsCost|integer|false|none||none|
|» newBalance|integer|false|none||兑换后积分余额|

<h2 id="tocS_PointsTransaction">PointsTransaction</h2>

<a id="schemapointstransaction"></a>
<a id="schema_PointsTransaction"></a>
<a id="tocSpointstransaction"></a>
<a id="tocspointstransaction"></a>

```json
{
  "id": "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  "amount": 0,
  "type": "earn",
  "source": "signin",
  "description": "周一签到",
  "balanceBefore": 0,
  "balanceAfter": 0,
  "createdAt": "2019-08-24T14:15:22Z"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|string(uuid)|false|none||none|
|amount|integer|false|none||正数收入，负数支出|
|type|string|false|none||none|
|source|string|false|none||none|
|description|string|false|none||none|
|balanceBefore|integer|false|none||none|
|balanceAfter|integer|false|none||none|
|createdAt|string(date-time)|false|none||none|

#### 枚举值

|属性|值|
|---|---|
|type|earn|
|type|use|
|type|expire|
|source|signin|
|source|team|
|source|reward|
|source|makeup|
|source|order|

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
  "rewardItemInfo": {
    "name": "string",
    "pointsCost": 0
  },
  "pointsCost": 0,
  "couponCode": "string",
  "status": "pending",
  "createdAt": "2019-08-24T14:15:22Z"
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|id|string(uuid)|false|none||none|
|userId|string(uuid)|false|none||none|
|rewardItemId|string(uuid)|false|none||none|
|rewardItemInfo|object|false|none||none|
|» name|string|false|none||none|
|» pointsCost|integer|false|none||none|
|pointsCost|integer|false|none||none|
|couponCode|string|false|none||none|
|status|string|false|none||none|
|createdAt|string(date-time)|false|none||none|

#### 枚举值

|属性|值|
|---|---|
|status|pending|
|status|completed|
|status|cancelled|

<h2 id="tocS_Pagination">Pagination</h2>

<a id="schemapagination"></a>
<a id="schema_Pagination"></a>
<a id="tocSpagination"></a>
<a id="tocspagination"></a>

```json
{
  "page": 1,
  "limit": 1,
  "total": 0,
  "totalPages": 0
}

```

### 属性

|名称|类型|必选|约束|中文名|说明|
|---|---|---|---|---|---|
|page|integer|false|none||none|
|limit|integer|false|none||none|
|total|integer|false|none||none|
|totalPages|integer|false|none||none|

