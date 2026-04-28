# zl-front - 专利分类系统前端

基于 Vue.js 2 的专利分类系统前端应用，提供用户认证、专利分类预测、批量处理等功能。

## 技术栈

- Vue.js 2.6.14
- Vue Router 3.5.1 (hash 模式)
- Element UI 2.15.14
- Axios 1.13.2
- ECharts 5.6.0
- Less 4.0.0

## 功能模块

| 页面 | 功能 |
|------|------|
| Login | 用户登录 |
| Register | 用户注册 |
| ForgotPassword | 找回密码（安全问题验证） |
| PatentClassification | 单条专利分类预测 |
| BatchClassification | 批量专利分类（Excel 上传） |
| ClassificationHistory | 分类历史记录查看与导出 |
| PatentSearch | 专利检索（模拟数据） |

## 项目结构

```
src/
├── api/index.js          # Axios 实例与 API 封装
├── router/index.js       # 路由配置与守卫
├── utils/
│   ├── auth.js           # Token 管理
│   └── config.js         # 配置常量
├── views/                # 页面组件
│   ├── Login.vue
│   ├── Register.vue
│   ├── ForgotPassword.vue
│   ├── PatentClassification.vue
│   ├── BatchClassification.vue
│   ├── ClassificationHistory.vue
│   └── PatentSearch.vue
└── App.vue
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run serve
```

服务启动于 http://localhost:8080

### 生产构建

```bash
npm run build
```

### 代码检查

```bash
npm run lint
```

## API 接口

前端通过 `src/api/index.js` 统一封装 API 请求：

### 用户认证

| 接口 | 方法 | 说明 |
|------|------|------|
| /api/auth/login | POST | 用户登录 |
| /api/auth/register | POST | 用户注册 |
| /api/auth/security-question | GET | 获取安全问题 |
| /api/auth/verify-security-question | POST | 验证安全问题 |
| /api/auth/reset-password | POST | 重置密码 |

### 专利分类

| 接口 | 方法 | 说明 |
|------|------|------|
| /api/patent/classify | POST | 单条分类预测 |
| /api/patent/upload-preview | POST | Excel 文件预览 |
| /api/patent/batch-classify | POST | 批量分类 |

### 分类记录

| 接口 | 方法 | 说明 |
|------|------|------|
| /api/record/list | GET | 获取历史记录 |
| /api/record/export | GET | 导出 Excel |

## 配置

- API 基础地址: 通过 `VUE_APP_API_BASE_URL` 环境变量配置，默认 `http://localhost:8081/api`
- Token 格式: `Bearer userId_timestamp`

## 开发规范

- Vue 2.x Options API 风格
- Element UI 2.x 组件库
- Less 样式预处理
- ESLint Standard 配置
- 路由使用 hash 模式

## 相关项目

- [zl-back-java](../zl-back-java) - Java 后端服务
- [zl-back-py](../zl-back-py) - Python 模型服务