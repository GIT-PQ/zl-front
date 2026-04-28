// 认证相关工具函数

// 保存 token
export function setToken (token) {
  localStorage.setItem('token', token)
}

// 获取 token
export function getToken () {
  return localStorage.getItem('token')
}

// 移除 token
export function removeToken () {
  localStorage.removeItem('token')
}

// 检查是否已登录
export function isLoggedIn () {
  return !!getToken()
}