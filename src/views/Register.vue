<template>
  <div class="register-container">
    <el-card class="register-card">
      <div slot="header" class="card-header">
        <h2>用户注册</h2>
      </div>
      <el-form
        ref="registerForm"
        :model="registerForm"
        :rules="registerRules"
        label-width="80px"
      >
<!--        <el-form-item label="用户名" prop="username">-->
          <el-input
            class="register-input"
            v-model="registerForm.username"
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
          />
<!--        </el-form-item>-->
<!--        <el-form-item label="密码" prop="password">-->
          <el-input
            class="register-input"
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            autocomplete="new-password"
          />
<!--        </el-form-item>-->
<!--        <el-form-item label="确认密码" prop="confirmPassword">-->
          <el-input
            class="register-input"
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            prefix-icon="el-icon-lock"
            autocomplete="new-password"
          />
<!--        </el-form-item>-->
<!--        <el-form-item label="安全问题" prop="question">-->
          <el-select
            class="register-input"
            v-model="registerForm.question"
            placeholder="请选择安全问题"
          >
            <el-option label="您的小学名称是什么？" value="您的小学名称是什么？" />
            <el-option label="您的出生地是哪里？" value="您的出生地是哪里？" />
            <el-option label="您最喜欢的颜色是什么？" value="您最喜欢的颜色是什么？" />
            <el-option label="您母亲的姓名是什么？" value="您母亲的姓名是什么？" />
            <el-option label="您最喜欢的食物是什么？" value="您最喜欢的食物是什么？" />
          </el-select>
<!--        </el-form-item>-->
<!--        <el-form-item label="安全问题答案" prop="answer">-->
          <el-input
            class="register-input"
            v-model="registerForm.answer"
            placeholder="请输入安全问题答案"
            prefix-icon="el-icon-question"
            @keyup.enter.native="handleRegister"
          />
<!--        </el-form-item>-->
<!--        <el-form-item>-->
          <el-button
            class="register-input"
            type="primary"
            :loading="loading"
            @click="handleRegister"
          >
            注册
          </el-button>
<!--        </el-form-item>-->
<!--        <el-form-item>-->
<!--          <el-button-->
<!--            type="text"-->
<!--            icon="el-icon-back"-->
<!--            @click="$router.push('/login')"-->
<!--            class="back-login-btn"-->
<!--          >-->
<!--            返回登录-->
<!--          </el-button>-->
<!--        </el-form-item>-->
<!--        <el-form-item>-->
          <div class="login-link" style="padding-top: 20px">
            <span>已有账号？</span>
            <el-link type="primary" @click="$router.push('/login')">
              立即登录
            </el-link>
          </div>
<!--        </el-form-item>-->
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { userApi } from '../api'
import { setToken } from '../utils/auth'

export default {
  name: 'RegisterView',
  data () {
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      registerForm: {
        username: '',
        password: '',
        confirmPassword: '',
        question: '',
        answer: ''
      },
      registerRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ],
        question: [
          { required: true, message: '请选择安全问题', trigger: 'change' }
        ],
        answer: [
          { required: true, message: '请输入安全问题答案', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  methods: {
    handleRegister () {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          this.loading = true
          const { confirmPassword, ...registerData } = this.registerForm
          // 移除confirmPassword字段，保留username, password, question, answer
          userApi.register(registerData)
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
              const errorMsg = err.response?.data?.message || '注册失败，请稍后重试'
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
.register-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 30px);
  //background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-image: url('../resource/img/login-bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.register-input{
  width: 80%;
  margin-left: 10%;
  padding-bottom: 10px;
}

.register-card {
  width: 480px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);

  .card-header {
    text-align: center;
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
    margin-bottom: 20px;
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

  .back-login-btn {
    width: 100%;
    color: #409EFF;
    font-size: 14px;
    padding: 10px 0;
    transition: all 0.3s ease;

    &:hover {
      color: #66b1ff;
      background-color: rgba(64, 158, 255, 0.1);
    }
  }

  .login-link {
    width: 100%;
    text-align: center;
    span {
      margin-right: 8px;
      color: #606266;
      font-size: 14px;
    }
  }
}
</style>
