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
            <div class="chart-container">
              <div ref="chart" style="width: 100%; height: 500px;"></div>
            </div>
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
import * as echarts from 'echarts'
import { patentApi } from '../api'

export default {
  name: 'PatentClassification',
  data () {
    return {
      form: {
        summary: ''
      },
      loading: false,
      result: null,
      chart: null,
      resultTable: []
    }
  },
  mounted () {
    this.initChart()
  },
  beforeDestroy () {
    if (this.chart) {
      this.chart.dispose()
    }
  },
  methods: {
    initChart () {
      // 使用nextTick确保DOM已渲染
      this.$nextTick(() => {
        if (this.$refs.chart) {
          this.chart = echarts.init(this.$refs.chart)
          // 监听窗口大小变化
          window.addEventListener('resize', () => {
            if (this.chart) {
              this.chart.resize()
            }
          })
        }
      })
    },
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
            // 使用nextTick确保DOM更新后再渲染图表
            this.$nextTick(() => {
              this.updateChart()
            })
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
    updateChart () {
      if (!this.result) return

      // 确保图表已初始化
      if (!this.chart) {
        this.initChart()
        // 等待图表初始化完成
        this.$nextTick(() => {
          this.renderChart()
        })
      } else {
        this.renderChart()
      }
    },
    renderChart () {
      if (!this.chart || !this.result) return

      const categories = this.result.categories || []
      // 按概率降序排序，取前10个显示
      const sortedCategories = [...categories]
        .sort((a, b) => b.probability - a.probability)
        .slice(0, 10)

      const categoryNames = sortedCategories.map(item => item.name)
      const probabilities = sortedCategories.map(item => (item.probability * 100).toFixed(2))

      // 获取最高概率的颜色
      const maxProb = Math.max(...sortedCategories.map(item => item.probability))

      const option = {
        title: {
          text: '专利分类概率分布（Top 10）',
          left: 'center',
          textStyle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#303133'
          },
          subtext: `最可能分类: ${sortedCategories[0].name} (${(sortedCategories[0].probability * 100).toFixed(2)}%)`,
          subtextStyle: {
            fontSize: 14,
            color: '#666'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function (params) {
            const param = params[0]
            return `${param.name}<br/>${param.seriesName}: ${param.value}%`
          }
        },
        grid: {
          left: '14%',
          right: '10%',
          bottom: '10%',
          top: '10%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          name: '概率 (%)',
          nameLocation: 'middle',
          nameGap: 32,
          axisLabel: {
            formatter: '{value}%',
            fontSize: 12
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#e0e0e0'
            }
          }
        },
        yAxis: {
          type: 'category',
          data: categoryNames,
          inverse: true, // 核心：使最高概率排在最上面
          axisLabel: {
            interval: 0,
            fontSize: 13,
            formatter: function (value) {
              return value.length > 12 ? value.substring(0, 12) + '...' : value
            }
          }
        },
        series: [
          {
            name: '分类概率',
            type: 'bar',
            data: probabilities.map((prob, index) => {
              const probValue = sortedCategories[index].probability
              let color = '#409EFF' // 默认蓝色
              if (probValue >= 0.5) color = '#67C23A'
              else if (probValue >= 0.3) color = '#E6A23C'
              else if (probValue >= 0.1) color = '#F56C6C'

              return {
                value: prob,
                itemStyle: {
                  color: color,
                  barBorderRadius: [4, 4, 4, 4]
                }
              }
            }),
            label: {
              show: true,
              position: 'right',
              formatter: '{c}%',
              fontSize: 13
            },
            barWidth: '60%'
          }
        ]
      }


      this.chart.setOption(option, true)
    },
    getProgressColor (probability) {
      if (probability >= 0.3) return '#67c23a'
      if (probability >= 0.2) return '#e6a23c'
      if (probability >= 0.1) return '#f56c6c'
      return '#909399'
    },
    handleReset () {
      this.form.summary = ''
      this.result = null
      if (this.chart) {
        this.chart.clear()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.patent-classification {
  padding: 0;
  .result-section {
    // margin-top: 20px; // 移除顶部间距，因为现在是左右布局
    height: 100%;
    .result-title {
      margin: 0 0 15px 0;
      font-size: 18px;
      font-weight: bold;
      color: #303133;
      text-align: center;
    }
    .chart-container {
      margin: 10px 0;
      background: #fff;
      border-radius: 4px;
      padding: 10px;
    }
  }
  .empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 500px; // 与图表高度保持一致
    background-color: #f5f7fa;
    border-radius: 4px;
  }
}
</style>
