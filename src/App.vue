<template>
  <div id="app">
    <el-container v-if="showLayout">
      <el-header>
        <div class="header-content">
          <div class="logo">
            <!-- <h2>{{ systemShortName }}</h2> -->
             <img src="./resource/img/logo.png" alt="logo">
          </div>
          <el-menu
            :default-active="activeMenu"
            mode="horizontal"
            router
            class="header-menu"
          >
            <el-menu-item index="/">首页</el-menu-item>
            <el-menu-item index="/patent-classification">专利分类预测</el-menu-item>
            <el-menu-item index="/batch-classification">批量分类</el-menu-item>
            <el-menu-item index="/classification-history">分类历史</el-menu-item>
<!--            <el-menu-item index="/patent-search">专利检索</el-menu-item>-->
          </el-menu>
          <div class="user-info">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                <img src="@/resource/img/default_avatar.png" alt="avatar" class="user-avatar">
                <span class="username-text">{{ username }}</span>
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
      <el-footer>
        <div class="footer-content">
          {{ footerText }}
        </div>
      </el-footer>
    </el-container>
    <div v-else class="no-layout-container">
      <router-view/>
      <el-footer class="standalone-footer">
        <div class="footer-content">
          {{ footerText }}
        </div>
      </el-footer>
    </div>
  </div>
</template>

<script>
import { getToken, removeToken } from './utils/auth'
import { userApi } from './api'
import { SYSTEM_CONFIG, getFooterText } from './utils/config'

export default {
  name: 'App',
  data () {
    return {
      username: localStorage.getItem('username') || '用户',
      systemShortName: SYSTEM_CONFIG.shortName,
      footerText: getFooterText()
    }
  },
  computed: {
    showLayout () {
      // 登录、注册和找回密码页面不显示布局
      return this.$route.path !== '/login' &&
             this.$route.path !== '/register' &&
             this.$route.path !== '/forgot-password'
    },
    activeMenu () {
      return this.$route.path
    }
  },
  watch: {
    // 监听路由变化，当从登录/注册页面跳转过来时，立即更新用户名
    '$route' (to, from) {
      // 如果从登录或注册页面跳转过来，且当前页面需要显示布局，则更新用户名
      if ((from.path === '/login' || from.path === '/register') && this.showLayout) {
        const savedUsername = localStorage.getItem('username')
        if (savedUsername) {
          this.username = savedUsername
        }
        // 调用接口获取最新用户信息
        this.getUserInfo()
      }
    }
  },
  mounted () {
    this.getUserInfo()
  },
  methods: {
    getUserInfo () {
      if (getToken()) {
        // 先从localStorage获取，如果没有再调用接口
        const savedUsername = localStorage.getItem('username')
        if (savedUsername) {
          this.username = savedUsername
        }

        // 调用接口获取最新用户信息
        userApi.getUserInfo()
          .then(res => {
            if (res.code === 200 && res.data) {
              this.username = res.data.username
              // 更新localStorage
              localStorage.setItem('username', res.data.username)
            }
          })
          .catch(err => {
            console.error('获取用户信息失败:', err)
            // 如果接口失败，使用localStorage中的用户名
          })
      }
    },
    handleCommand (command) {
      if (command === 'logout') {
        // 真实后端请求代码：
        // userApi.logout()
        //   .then(() => {
        //     removeToken()
        //     this.$message.success('退出成功')
        //     this.$router.push('/login')
        //   })
        //   .catch(err => {
        //     console.error(err)
        //   })

        userApi.logout()
          .then(() => {
            removeToken()
            localStorage.removeItem('username')
            this.username = '用户'
            this.$message.success({ message: '退出成功', duration: 1000 })
            this.$router.push('/login')
          })
          .catch(err => {
            // 即使接口失败也清除本地数据
            console.error('退出登录失败:', err)
            removeToken()
            localStorage.removeItem('username')
            this.username = '用户'
            this.$message.success({ message: '退出成功', duration: 1000 })
            this.$router.push('/login')
          })
      }
    }
  }
}
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  width: 100%;
  height: 100%;
}

#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100vh;
  overflow-x: hidden;
  overflow: hidden;
}

.el-container {
  width: 100%;
  height: 100vh;
  overflow-x: hidden;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.el-header {
  background-color: #409EFF;
  color: #fff;
  line-height: 60px;
  padding: 0;
  width: 100%;
  height: 60px !important;
  flex-shrink: 0;

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    padding: 0 20px;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;

    .logo {
      h2 {
        margin: 0;
        color: #fff;
        font-size: 20px;
      }
      img {
        height: 60px;
        width: 60px;
      }
      display: flex;              /* 关键：启用 flex */
      justify-content: center;    /* 水平居中 */
      align-items: center;        /* 垂直居中（可选） */
    }

    .header-menu {
      flex: 1;
      background-color: transparent;
      border-bottom: none;
      margin: 0 40px;

      .el-menu-item {
        color: rgba(255, 255, 255, 0.8);
        border-bottom: none;

        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        &.is-active {
          color: #fff;
          border-bottom-color: #fff;
        }
      }
    }

    .user-info {
      display: flex;
      align-items: center;
      justify-content: center;

      .el-dropdown-link {
        color: #fff;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;

        .user-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin-right: 8px;
          object-fit: cover;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .username-text {
          font-size: 20px;
        }

        i {
          margin: 0 5px;
        }
      }
    }
  }
}

.el-main {
  background-color: #f0f2f5;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  flex: 1;
  padding: 20px;
}

.el-footer {
  background-color: #F5F7FA;
  color: #666;
  height: 30px !important;
  line-height: 30px;
  text-align: center;
  border-top: 1px solid #e4e7ed;
  padding: 0;
  width: 100%;
  flex-shrink: 0;

  .footer-content {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
  }
}

.no-layout-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow: hidden;

  .standalone-footer {
    margin-top: auto;
    height: 30px !important;
    line-height: 30px;
    // background-color: rgba(255, 255, 255, 0.9);
    color: #666;
    border-top: 1px solid rgba(228, 231, 237, 0.5);
  }
}
</style>
