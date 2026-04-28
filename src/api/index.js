import axios from 'axios'

// 创建 axios 实例
const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || 'http://localhost:8081/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    // 统一错误处理
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，清除 token 并跳转到登录页
          localStorage.removeItem('token')
          window.location.href = '#/login'
          break
        case 403:
          console.error('没有权限访问')
          break
        case 404:
          console.error('请求的资源不存在')
          break
        case 500:
          console.error('服务器错误')
          break
        default:
          console.error('请求失败')
      }
    }
    return Promise.reject(error)
  }
)

// 用户相关 API
export const userApi = {
  // 登录
  login: (data) => api.post('/auth/login', data),

  // 注册
  register: (data) => api.post('/auth/register', data),

  // 获取安全问题
  getSecurityQuestion: (username) => api.get('/auth/security-question', { params: { username } }),

  // 验证安全问题
  verifySecurityQuestion: (data) => api.post('/auth/verify-security-question', data),

  // 重置密码
  resetPassword: (data) => api.post('/auth/reset-password', data),

  // 获取用户信息
  getUserInfo: () => api.get('/auth/user'),

  // 退出登录
  logout: () => api.post('/auth/logout')
}

// 专利相关 API
export const patentApi = {
  // 专利分类预测
  classify: (data) => api.post('/patent/classify', data),

  // 专利检索
  // 真实后端请求代码：
  // search: (params) => api.get('/patent/search', { params })
  search: (params) => {
    // 当前使用假数据，后续取消注释上面的代码，删除此函数
    return new Promise((resolve) => {
      setTimeout(() => {
        // 模拟检索结果
        const mockData = []
        const keywords = ['人工智能', '机器学习', '深度学习', '神经网络', '自然语言处理']
        const categories = ['A部', 'B部', 'C部', 'D部', 'E部']
        const titles = [
          '一种基于深度学习的图像识别方法',
          '智能语音识别系统及其应用',
          '机器学习算法优化研究',
          '神经网络模型训练方法',
          '自然语言处理技术应用'
        ]

        for (let i = 0; i < 10; i++) {
          mockData.push({
            id: i + 1,
            title: titles[i % titles.length] + ` (${i + 1})`,
            abstract: `这是第${i + 1}个专利的摘要内容，涉及${keywords[i % keywords.length]}相关技术。`,
            category: categories[i % categories.length],
            applicant: `申请人${i + 1}`,
            applicationDate: new Date(2020 + (i % 4), i % 12, (i % 28) + 1).toISOString().split('T')[0],
            patentNumber: `CN2020${String(i + 1).padStart(6, '0')}A`
          })
        }

        // 根据关键词过滤
        let filteredData = mockData
        if (params.keyword) {
          filteredData = mockData.filter(item =>
            item.title.includes(params.keyword) ||
            item.abstract.includes(params.keyword)
          )
        }

        // 根据分类过滤
        if (params.category) {
          filteredData = filteredData.filter(item =>
            item.category.includes(params.category)
          )
        }

        resolve({
          code: 200,
          message: '检索成功',
          data: {
            list: filteredData,
            total: filteredData.length,
            page: params.page || 1,
            pageSize: params.pageSize || 10
          }
        })
      }, 500)
    })
  },

  // 获取专利详情
  // 真实后端请求代码：
  // getDetail: (id) => api.get(`/patent/${id}`)
  getDetail: (id) => {
    // 当前使用假数据，后续取消注释上面的代码，删除此函数
    return Promise.resolve({
      code: 200,
      data: {
        id: id,
        title: '专利标题',
        abstract: '专利摘要',
        category: 'A部',
        applicant: '申请人',
        applicationDate: '2020-01-01',
        patentNumber: 'CN2020000001A'
      }
    })
  }
}

export default api