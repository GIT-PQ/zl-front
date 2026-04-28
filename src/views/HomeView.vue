<!--
 * @Author: pang-q pang-q@neusoft.com
 * @Date: 2025-11-12 10:41:45
 * @LastEditors: pang-q pang-q@neusoft.com
 * @LastEditTime: 2025-11-15 19:47:46
 * @FilePath: \zlv2\zlv2\src\views\HomeView.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="home">
    <el-card>
      <div slot="header">
        <h2>欢迎使用{{ shortName }}</h2>
      </div>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="12">
          <el-card shadow="hover" class="feature-card" @click.native="$router.push('/patent-classification')">
            <div class="feature-content">
              <i class="el-icon-data-analysis" style="font-size: 48px; color: #409EFF;"></i>
              <h3>专利分类预测</h3>
              <p>输入专利摘要，系统将自动预测专利所属分类及各类别的概率</p>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12">
          <el-card shadow="hover" class="feature-card" @click.native="$router.push('/classification-history')">
            <div class="feature-content">
              <i class="el-icon-time" style="font-size: 48px; color: #67C23A;"></i>
              <h3>分类历史</h3>
              <p>查看历史分类记录，支持按类别、时间、来源等条件筛选</p>
            </div>
          </el-card>
        </el-col>
<!--        <el-col :xs="24" :sm="12" :md="12">-->
<!--          <el-card shadow="hover" class="feature-card" @click.native="$router.push('/patent-search')">-->
<!--            <div class="feature-content">-->
<!--              <i class="el-icon-search" style="font-size: 48px; color: #67C23A;"></i>-->
<!--              <h3>专利检索</h3>-->
<!--              <p>通过关键词、分类、日期等条件检索专利信息</p>-->
<!--            </div>-->
<!--          </el-card>-->
<!--        </el-col>-->
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { SYSTEM_CONFIG } from '../utils/config'
export default {
  data () {
    return {
      shortName: SYSTEM_CONFIG.shortName
    }
  },
  name: 'HomeView'
}
</script>

<style lang="less" scoped>
.home {
  padding: 20px;
  .feature-card {
    cursor: pointer;
    transition: all 0.3s;
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    .feature-content {
      text-align: center;
      padding: 20px;
      h3 {
        margin: 20px 0 10px;
        color: #303133;
      }
      p {
        color: #606266;
        line-height: 1.6;
      }
    }
  }
}
</style>
