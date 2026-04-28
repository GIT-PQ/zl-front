<template>
  <div class="classification-history">
    <el-card>
      <div slot="header">
        <h2>分类历史</h2>
      </div>

      <!-- 筛选区域 -->
      <el-form :model="filters" inline class="filter-form">
        <el-form-item label="预测类别">
          <el-select v-model="filters.predLabel" placeholder="全部" clearable style="width: 150px;">
            <el-option label="中医器械" value="中医器械" />
            <el-option label="临床检验器械" value="临床检验器械" />
            <el-option label="医用康复器械" value="医用康复器械" />
            <el-option label="医用成像器械" value="医用成像器械" />
            <el-option label="医用诊察和监护器械" value="医用诊察和监护器械" />
            <el-option label="医用软件" value="医用软件" />
            <el-option label="医疗器械消毒灭菌器械" value="医疗器械消毒灭菌器械" />
            <el-option label="口腔科器械" value="口腔科器械" />
            <el-option label="呼吸、麻醉和急救器械" value="呼吸、麻醉和急救器械" />
            <el-option label="妇产科、辅助生殖和避孕器械" value="妇产科、辅助生殖和避孕器械" />
            <el-option label="患者承载器械" value="患者承载器械" />
            <el-option label="放射治疗器械" value="放射治疗器械" />
            <el-option label="无源手术器械" value="无源手术器械" />
            <el-option label="无源植入器械" value="无源植入器械" />
            <el-option label="有源手术器械" value="有源手术器械" />
            <el-option label="有源植入器械" value="有源植入器械" />
            <el-option label="注输、护理和防护器械" value="注输、护理和防护器械" />
            <el-option label="物理治疗器械" value="物理治疗器械" />
            <el-option label="眼科器械" value="眼科器械" />
            <el-option label="神经和心血管手术器械" value="神经和心血管手术器械" />
            <el-option label="输血、透析和体外循环器械" value="输血、透析和体外循环器械" />
            <el-option label="骨科手术器械" value="骨科手术器械" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类时间">
          <el-date-picker
            v-model="filters.startTime"
            type="date"
            placeholder="起始日期"
            value-format="yyyy-MM-dd"
            style="width: 140px;"
          />
          <span style="margin: 0 5px;">-</span>
          <el-date-picker
            v-model="filters.endTime"
            type="date"
            placeholder="截止日期"
            value-format="yyyy-MM-dd"
            style="width: 140px;"
          />
        </el-form-item>
        <el-form-item label="来源类型">
          <el-select v-model="filters.source" placeholder="全部" clearable style="width: 120px;">
            <el-option label="单条输入" value="single" />
            <el-option label="批量导入" value="batch" />
          </el-select>
        </el-form-item>
        <el-form-item label="摘要关键字">
          <el-input v-model="filters.summary" placeholder="输入关键词" style="width: 200px;" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="success" :loading="exportLoading" @click="handleExport">导出Excel</el-button>
        </el-form-item>
      </el-form>

      <!-- 数据表格 -->
      <el-table :data="records" v-loading="loading" border style="width: 100%">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="summary" label="摘要" min-width="300">
          <template slot-scope="scope">
            <span v-html="highlightKeyword(scope.row.summary)"></span>
          </template>
        </el-table-column>
        <el-table-column prop="predLabel" label="预测类别" width="150" />
        <el-table-column prop="predProbability" label="置信度" width="100">
          <template slot-scope="scope">
            {{ (scope.row.predProbability * 100).toFixed(2) }}%
          </template>
        </el-table-column>
        <el-table-column prop="source" label="来源" width="160">
          <template slot-scope="scope">
            {{ formatSource(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="分类时间" width="160">
          <template slot-scope="scope">
            {{ formatDate(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button type="text" @click="showDetail(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 详情弹窗 -->
    <el-dialog title="分类详情" :visible.sync="detailVisible" width="60%" @opened="onDialogOpened">
      <div v-if="detailRecord" class="detail-content">
        <el-form label-width="80px">
          <el-form-item label="专利摘要">
            <div class="summary-text">{{ detailRecord.summary }}</div>
          </el-form-item>
          <el-form-item label="预测类别">
            {{ detailRecord.predLabel }} (置信度: {{ (detailRecord.predProbability * 100).toFixed(2) }}%)
          </el-form-item>
          <el-form-item label="来源类型">
            {{ formatSource(detailRecord) }}
          </el-form-item>
          <el-form-item label="批次ID" v-if="detailRecord.source === 'batch'">
            {{ detailRecord.batchId }}
          </el-form-item>
        </el-form>
        <div class="chart-section">
          <h4>概率分布</h4>
          <ChartVisualization
            ref="detailChart"
            :categories="detailCategories"
            height="400px"
            :style="{ display: detailCategories.length > 0 ? 'block' : 'none' }"
          />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { recordApi } from '../api'
import ChartVisualization from '../components/ChartVisualization.vue'

export default {
  name: 'ClassificationHistory',
  components: {
    ChartVisualization
  },
  data () {
    return {
      filters: {
        predLabel: '',
        startTime: '',
        endTime: '',
        source: '',
        summary: '',
        batchId: ''
      },
      records: [],
      loading: false,
      exportLoading: false,
      detailVisible: false,
      detailRecord: null,
      detailCategories: []
    }
  },
  mounted () {
    // 检查是否有batchId参数（从批量分类页面跳转）
    if (this.$route.query.batchId) {
      this.filters.batchId = this.$route.query.batchId
      this.filters.source = 'batch'
    }
    this.loadRecords()
  },
  methods: {
    loadRecords () {
      this.loading = true
      const params = {}
      if (this.filters.predLabel) params.predLabel = this.filters.predLabel
      if (this.filters.startTime) params.startTime = this.filters.startTime
      if (this.filters.endTime) params.endTime = this.filters.endTime
      if (this.filters.source) params.source = this.filters.source
      if (this.filters.summary) params.summary = this.filters.summary
      if (this.filters.batchId) params.batchId = this.filters.batchId

      recordApi.getList(params)
        .then(res => {
          if (res.code === 200) {
            this.records = res.data || []
          } else {
            this.$message.error(res.message || '查询失败')
          }
        })
        .catch(err => {
          console.error(err)
          this.$message.error('查询失败')
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleQuery () {
      this.loadRecords()
    },
    handleReset () {
      this.filters = {
        predLabel: '',
        startTime: '',
        endTime: '',
        source: '',
        summary: '',
        batchId: ''
      }
      this.loadRecords()
    },
    handleExport () {
      this.$confirm('确定导出当前筛选结果？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.doExport()
      }).catch(() => {})
    },
    doExport () {
      this.exportLoading = true
      const params = {}
      if (this.filters.predLabel) params.predLabel = this.filters.predLabel
      if (this.filters.startTime) params.startTime = this.filters.startTime
      if (this.filters.endTime) params.endTime = this.filters.endTime
      if (this.filters.source) params.source = this.filters.source
      if (this.filters.summary) params.summary = this.filters.summary
      if (this.filters.batchId) params.batchId = this.filters.batchId

      recordApi.export(params)
        .then(res => {
          if (res.data.type === 'application/json') {
            // count > 200 或无数据，返回 JSON 错误
            const reader = new FileReader()
            reader.onload = () => {
              try {
                const json = JSON.parse(reader.result)
                this.$message.warning(json.message || '导出失败')
              } catch (e) {
                this.$message.error('导出失败')
              }
            }
            reader.readAsText(res.data)
          } else {
            // 正常 Excel 流
            const blob = new Blob([res.data])
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            const now = new Date()
            const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`
            link.download = `分类记录_${dateStr}.xlsx`
            link.click()
            window.URL.revokeObjectURL(url)
            this.$message.success('导出成功')
          }
        })
        .catch(err => {
          console.error(err)
          this.$message.error('导出失败')
        })
        .finally(() => {
          this.exportLoading = false
        })
    },
    highlightKeyword (text) {
      if (!text) return ''
      let escaped = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')

      if (this.filters.summary) {
        const keyword = this.filters.summary
        const regex = new RegExp(keyword, 'gi')
        escaped = escaped.replace(regex, match => `<mark>${match}</mark>`)
      }
      return escaped
    },
    formatDate (dateStr) {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      const y = date.getFullYear()
      const m = String(date.getMonth() + 1).padStart(2, '0')
      const d = String(date.getDate()).padStart(2, '0')
      const h = String(date.getHours()).padStart(2, '0')
      const min = String(date.getMinutes()).padStart(2, '0')
      return `${y}-${m}-${d} ${h}:${min}`
    },
    formatSource (row) {
      if (row.source === 'single') {
        return '单条输入'
      } else if (row.source === 'batch' && row.batchId) {
        return `批量(${row.batchId.substring(0, 8)}...)`
      } else {
        return '批量导入'
      }
    },
    showDetail (row) {
      this.detailRecord = row
      this.detailVisible = true
    },
    onDialogOpened () {
      // 弹窗完全打开后，解析数据并刷新图表
      try {
        this.detailCategories = JSON.parse(this.detailRecord.topCategories || '[]')
      } catch (e) {
        this.detailCategories = []
      }
      this.$nextTick(() => {
        if (this.$refs.detailChart) {
          this.$refs.detailChart.renderChart()
          // 弹窗打开后容器尺寸变化，需要 resize
          setTimeout(() => {
            if (this.$refs.detailChart) {
              this.$refs.detailChart.resize()
            }
          }, 100)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.classification-history {
  .filter-form {
    margin-bottom: 20px;
    .el-form-item {
      margin-bottom: 10px;
    }
  }
  .detail-content {
    .summary-text {
      white-space: pre-wrap;
      word-break: break-all;
      line-height: 1.6;
      background: #f5f7fa;
      padding: 10px;
      border-radius: 4px;
    }
    .chart-section {
      h4 {
        margin: 20px 0 10px;
        font-size: 16px;
        color: #303133;
      }
    }
  }
}
</style>