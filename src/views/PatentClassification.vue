<template>
  <div class="patent-classification">
    <el-card>
      <!-- <div slot="header">
        <h2>专利分类预测</h2>
      </div> -->
      <el-row :gutter="20">
        <!-- 左侧输入区域 -->
        <el-col :span="10">
          <el-form :model="form" label-position="top">
            <el-form-item label="专利摘要">
              <el-input
                v-model="form.summary"
                type="textarea"
                :rows="12"
                placeholder="请输入专利摘要内容..."
                maxlength="2000"
                show-word-limit
                resize="none"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                :loading="loading"
                @click="handleClassify"
                style="width: 100%; margin-bottom: 10px;"
              >
                开始预测
              </el-button>
              <el-button @click="handleReset" style="width: 100%; margin-left: 0;">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>

        <!-- 右侧结果区域 -->
        <el-col :span="14">
          <div v-if="result" class="result-section">
            <h3 class="result-title">预测结果</h3>
            <ChartVisualization
              ref="chartVisualization"
              :categories="result.categories"
              height="500px"
            />
          </div>
          <div v-else class="empty-state">
            <el-empty description="请在左侧输入摘要后点击预测查看结果"></el-empty>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { patentApi } from '../api'
import ChartVisualization from '../components/ChartVisualization.vue'

export default {
  name: 'PatentClassification',
  components: {
    ChartVisualization
  },
  data () {
    return {
      form: {
        summary: ''
      },
      loading: false,
      result: null
    }
  },
  methods: {
    handleClassify () {
      if (!this.form.summary.trim()) {
        this.$message.warning({ message: '请输入专利摘要', duration: 1000 })
        return
      }
      this.loading = true
      patentApi.classify({ summary: this.form.summary })
        .then(res => {
          if (res.code === 200) {
            this.result = res.data
            this.$message.success({ message: res.message, duration: 1000 })
          } else {
            this.$message.error({ message: res.message, duration: 1000 })
          }
        })
        .catch(err => {
          this.$message.error({ message: '预测失败，请稍后重试', duration: 1000 })
          console.error(err)
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleReset () {
      this.form.summary = ''
      this.result = null
      if (this.$refs.chartVisualization) {
        this.$refs.chartVisualization.clear()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.patent-classification {
  padding: 0;
  .result-section {
    height: 100%;
    .result-title {
      margin: 0 0 15px 0;
      font-size: 18px;
      font-weight: bold;
      color: #303133;
      text-align: center;
    }
  }
  .empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 500px;
    background-color: #f5f7fa;
    border-radius: 4px;
  }
}
</style>
