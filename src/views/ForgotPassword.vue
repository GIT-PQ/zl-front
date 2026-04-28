<template>
  <div class="forgot-password-container">
    <el-card class="forgot-password-card">
      <div slot="header" class="card-header">
        <h2>找回密码</h2>
      </div>
      <el-steps :active="currentStep" finish-status="success" align-center>
        <el-step title="输入用户名" />
        <el-step title="验证安全问题" />
        <el-step title="重置密码" />
      </el-steps>

      <!-- 第一步：输入用户名 -->
      <el-form
        v-if="currentStep === 0"
        ref="usernameForm"
        :model="usernameForm"
        :rules="usernameRules"
        label-width="100px"
        style="margin-top: 30px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="usernameForm.username"
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
            @keyup.enter.native="handleGetSecurityQuestion"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            style="width: 100%"
            @click="handleGetSecurityQuestion"
          >
            下一步
          </el-button>
          <div class="login-link">
            <el-link type="primary" @click="$router.push('/login')">
              返回登录
            </el-link>
          </div>
        </el-form-item>
      </el-form>

      <!-- 第二步：验证安全问题 -->
      <el-form
        v-if="currentStep === 1"
        ref="securityForm"
        :model="securityForm"
        :rules="securityRules"
        label-width="100px"
        style="margin-top: 30px"
      >
        <el-form-item label="安全问题">
          <el-input
            :value="securityQuestion"
            disabled
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="问题答案" prop="answer">
          <el-input
            v-model="securityForm.answer"
            placeholder="请输入安全问题答案"
            prefix-icon="el-icon-question"
            @keyup.enter.native="handleVerifySecurityQuestion"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            style="width: 100%"
            @click="handleVerifySecurityQuestion"
          >
            下一步
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            style="width: 100%"
            @click="currentStep = 0"
          >
            返回上一步
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 第三步：重置密码 -->
      <el-form
        v-if="currentStep === 2"
        ref="passwordForm"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="100px"
        style="margin-top: 30px"
      >
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            placeholder="请输入新密码"
            prefix-icon="el-icon-lock"
            autocomplete="new-password"
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            prefix-icon="el-icon-lock"
            autocomplete="new-password"
            @keyup.enter.native="handleResetPassword"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            style="width: 100%"
            @click="handleResetPassword"
          >
            完成
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            style="width: 100%"
            @click="currentStep = 1"
          >
            返回上一步
          </el-button>
        </el-form-item>
      </el-form>

      <el-form-item style="margin-top: 20px">
        <el-button
          type="text"
          icon="el-icon-back"
          @click="$router.push('/login')"
          class="back-login-btn"
        >
          返回登录
        </el-button>
      </el-form-item>
      <el-form-item>
        <div class="login-link">
          <span>想起密码了？</span>
          <el-link type="primary" @click="$router.push('/login')">
            返回登录
          </el-link>
        </div>
      </el-form-item>
    </el-card>
  </div>
</template>

<script>
import { userApi } from '../api'

export default {
  name: 'ForgotPasswordView',
  data () {
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      currentStep: 0,
      usernameForm: {
        username: ''
      },
      usernameRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ]
      },
      securityQuestion: '',
      securityForm: {
        answer: ''
      },
      securityRules: {
        answer: [
          { required: true, message: '请输入安全问题答案', trigger: 'blur' }
        ]
      },
      passwordForm: {
        newPassword: '',
        confirmPassword: ''
      },
      passwordRules: {
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  methods: {
    // 获取安全问题
    handleGetSecurityQuestion () {
      this.$refs.usernameForm.validate((valid) => {
        if (valid) {
          this.loading = true
          userApi.getSecurityQuestion(this.usernameForm.username)
            .then(res => {
              if (res.code === 200) {
                this.securityQuestion = res.data
                this.currentStep = 1
                this.$message.success({ message: '获取安全问题成功', duration: 1000 })
              } else {
                this.$message.error({ message: res.message, duration: 1000 })
              }
            })
            .catch(err => {
              this.$message.error({ message: '获取安全问题失败，请稍后重试', duration: 1000 })
              console.error(err)
            })
            .finally(() => {
              this.loading = false
            })
        }
      })
    },
    // 验证安全问题
    handleVerifySecurityQuestion () {
      this.$refs.securityForm.validate((valid) => {
        if (valid) {
          this.loading = true
          userApi.verifySecurityQuestion({
            username: this.usernameForm.username,
            question: this.securityQuestion,
            answer: this.securityForm.answer
          })
            .then(res => {
              if (res.code === 200) {
                this.currentStep = 2
                this.$message.success({ message: '验证成功', duration: 1000 })
              } else {
                this.$message.error({ message: res.message, duration: 1000 })
              }
            })
            .catch(err => {
              this.$message.error({ message: '验证失败，请稍后重试', duration: 1000 })
              console.error(err)
            })
            .finally(() => {
              this.loading = false
            })
        }
      })
    },
    // 重置密码
    handleResetPassword () {
      this.$refs.passwordForm.validate((valid) => {
        if (valid) {
          this.loading = true
          userApi.resetPassword({
            username: this.usernameForm.username,
            question: this.securityQuestion,
            answer: this.securityForm.answer,
            newPassword: this.passwordForm.newPassword
          })
            .then(res => {
              if (res.code === 200) {
                this.$message.success({ message: '密码重置成功，请使用新密码登录', duration: 1000 })
                setTimeout(() => {
                  this.$router.push('/login')
                }, 1000)
              } else {
                this.$message.error({ message: res.message, duration: 1000 })
              }
            })
            .catch(err => {
              this.$message.error({ message: '密码重置失败，请稍后重试', duration: 1000 })
              console.error(err)
            })
            .finally(() => {
              this.loading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.forgot-password-container {
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

.forgot-password-card {
  width: 550px;
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

  ::v-deep .el-steps {
    margin-bottom: 30px;
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

