<template>
  <div class="chart-visualization">
    <div ref="chart" :style="{ width: '100%', height: height }"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'ChartVisualization',
  props: {
    categories: {
      type: Array,
      default: () => []
    },
    height: {
      type: String,
      default: '500px'
    },
    title: {
      type: String,
      default: '专利分类概率分布（Top 10）'
    }
  },
  data () {
    return {
      chart: null
    }
  },
  watch: {
    categories: {
      handler (newVal) {
        if (newVal && newVal.length > 0) {
          this.$nextTick(() => {
            this.renderChart()
          })
        } else {
          if (this.chart) {
            this.chart.clear()
          }
        }
      },
      immediate: true
    }
  },
  mounted () {
    this.initChart()
  },
  beforeDestroy () {
    if (this.chart) {
      this.chart.dispose()
    }
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    initChart () {
      this.$nextTick(() => {
        if (this.$refs.chart) {
          this.chart = echarts.init(this.$refs.chart)
          window.addEventListener('resize', this.handleResize)
        }
      })
    },
    handleResize () {
      if (this.chart) {
        this.chart.resize()
      }
    },
    renderChart () {
      if (!this.chart || !this.categories || this.categories.length === 0) return

      const sortedCategories = [...this.categories]
        .sort((a, b) => b.probability - a.probability)
        .slice(0, 10)

      if (sortedCategories.length === 0) return

      const categoryNames = sortedCategories.map(item => item.name)
      const probabilities = sortedCategories.map(item => (item.probability * 100).toFixed(2))

      const option = {
        title: {
          text: this.title,
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
          inverse: true,
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
              let color = '#409EFF'
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
    clear () {
      if (this.chart) {
        this.chart.clear()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.chart-visualization {
  background: #fff;
  border-radius: 4px;
  padding: 10px;
}
</style>