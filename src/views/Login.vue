<template>
  <div class="login-container">
    <div class="login-content">
      <!-- 左侧标题区域 -->
      <div class="title-section">
        <h1 class="main-title">{{ systemShortName }}</h1>
        <p class="subtitle">基于AI技术为医疗器械发明专利分类提供支持</p>
      </div>

      <!-- 右侧登录表单 -->
      <el-card class="login-card">
        <div slot="header" class="card-header">
          <h2>用户登录</h2>
        </div>
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          label-width="80px"
        >
<!--          <el-form-item label="" prop="username">-->
            <el-input
              class="login-input"
              v-model="loginForm.username"
              placeholder="请输入用户名"
              prefix-icon="el-icon-user"
            />
<!--          </el-form-item>-->
<!--          <el-form-item label="" prop="password">-->
            <el-input
              class="login-input"
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              prefix-icon="el-icon-lock"
              autocomplete="current-password"
              @keyup.enter.native="handleLogin"
            />
<!--          </el-form-item>-->
<!--          <el-form-item>-->
            <el-button
              class="login-input"
              type="primary"
              :loading="loading"
              @click="handleLogin"
            >
              登录
            </el-button>
<!--          </el-form-item>-->
<!--          <el-form-item>-->
            <div class="register-link login-font">
              <span>还没有账号？</span>
              <el-link type="primary" @click="$router.push('/register')">
                立即注册
              </el-link>
            </div>
<!--          </el-form-item>-->
<!--          <el-form-item>-->
            <div class="forgot-password-link login-font">
              <el-link type="primary" @click="$router.push('/forgot-password')">
                忘记密码？
              </el-link>
            </div>
<!--          </el-form-item>-->
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import { userApi } from '../api'
import { setToken } from '../utils/auth'
import { SYSTEM_CONFIG } from '../utils/config'

export default {
  name: 'LoginView',
  data () {
    return {
      systemShortName: SYSTEM_CONFIG.shortName,
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  methods: {
    handleLogin () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          userApi.login(this.loginForm)
            .then(res => {
              if (res.code === 200) {
                setToken(res.data.token)
                // 保存用户名到localStorage
                if (res.data.username) {
                  localStorage.setItem('username', res.data.username)
                }
                this.$message.success({ message: res.message, duration: 1000 })
                this.$router.push('/')
              } else {
                this.$message.error({ message: res.message, duration: 1000 })
              }
            })
            .catch(err => {
              const errorMsg = err.response?.data?.message || '登录失败，请稍后重试'
              this.$message.error({ message: errorMsg, duration: 1000 })
              console.error(err)
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  flex: 1;
  background-image: url('../resource/img/login-bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;

  // 添加半透明遮罩层，确保文字可读性
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    z-index: 0;
  }
}

.login-input{
  width: 80%;
  margin-left: 10%;
  padding-bottom: 10px;
}

.login-font {
  padding-top: 25px;
}

.login-content {
  position: relative;
  z-index: 1;
  min-height: calc(100vh - 30px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 80px;
  max-width: 1400px;
  margin: 0 auto;
}

.title-section {
  flex: 1;
  color: #fff;
  padding-right: 60px;

  .main-title {
    font-size: 48px;
    font-weight: 700;
    margin: 0 0 20px 0;
    color: #fff;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    line-height: 1.2;
  }

  .subtitle {
    font-size: 20px;
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
    text-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
    line-height: 1.6;
  }
}

.login-card {
  width: 420px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);

  .card-header {
    text-align: center;
    padding: 20px 0;
    h2 {
      margin: 0;
      color: #303133;
      font-size: 24px;
      font-weight: 600;
    }
  }

  ::v-deep .el-card__body {
    padding: 30px;
  }

  ::v-deep .el-form-item {
    margin-bottom: 22px;
  }

  ::v-deep .el-input__inner {
    height: 42px;
    border-radius: 6px;
  }

  ::v-deep .el-button--primary {
    height: 42px;
    border-radius: 6px;
    font-size: 16px;
  }

  .register-link {
    width: 100%;
    text-align: center;
    span {
      margin-right: 8px;
      color: #606266;
      font-size: 14px;
    }
  }

  .forgot-password-link {
    width: 100%;
    text-align: center;
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .login-content {
    padding: 0 40px;
  }

  .title-section {
    padding-right: 40px;

    .main-title {
      font-size: 40px;
    }

    .subtitle {
      font-size: 18px;
    }
  }
}

@media (max-width: 768px) {
  .login-content {
    flex-direction: column;
    justify-content: center;
    padding: 40px 20px;
  }

  .title-section {
    text-align: center;
    padding-right: 0;
    margin-bottom: 40px;

    .main-title {
      font-size: 32px;
    }

    .subtitle {
      font-size: 16px;
    }
  }

  .login-card {
    width: 100%;
    max-width: 400px;
  }
}
</style>
