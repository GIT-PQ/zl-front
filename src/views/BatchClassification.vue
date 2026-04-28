<template>
  <div class="batch-classification">
    <el-card class="main-card">
      <div slot="header" class="card-header">
        <span>批量分类</span>
      </div>

      <!-- 上传区域 -->
      <el-upload
        ref="upload"
        class="upload-area"
        drag
        action=""
        :auto-upload="false"
        :on-change="handleFileChange"
        :on-remove="handleFileRemove"
        :limit="1"
        :file-list="fileList"
        accept=".xlsx,.xls,.csv"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将Excel文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          支持 .xlsx / .xls / .csv 格式，文件大小不超过 5MB，单次最多 50 条
        </div>
      </el-upload>

      <!-- 摘要列选择 -->
      <div class="column-select" v-if="previewData">
        <span class="label">摘要列名：</span>
        <el-select v-model="selectedColumn" placeholder="请选择摘要列" style="width: 200px">
          <el-option
            v-for="col in previewData.columns"
            :key="col"
            :label="col"
            :value="col"
          />
        </el-select>
        <span class="total-info">共 {{ previewData.totalRows }} 条数据</span>
      </div>

      <!-- 文件预览 -->
      <div class="preview-section" v-if="previewData && previewData.previewRows.length > 0">
        <h4>文件预览（前5行）</h4>
        <el-table :data="previewData.previewRows" border style="width: 100%" max-height="300">
          <el-table-column
            v-for="col in previewData.columns"
            :key="col"
            :prop="col"
            :label="col"
            min-width="150"
          >
            <template slot-scope="scope">
              <span class="preview-text">{{ scope.row[col] }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button
          type="primary"
          :disabled="!previewData || !selectedColumn || processing"
          :loading="processing"
          @click="startBatchClassify"
        >
          {{ processing ? '正在处理中...' : '开始分类' }}
        </el-button>
      </div>

      <!-- 结果展示 -->
      <div class="result-section" v-if="result">
        <h4>分类结果</h4>
        <div class="result-summary">
          <el-tag type="success">成功: {{ result.success }} 条</el-tag>
          <el-tag type="danger" v-if="result.failed > 0">失败: {{ result.failed }} 条</el-tag>
          <span class="batch-id">批次ID: {{ result.batchId }}</span>
        </div>

        <!-- 失败列表 -->
        <div v-if="result.failedList && result.failedList.length > 0" class="failed-list">
          <h5>失败详情：</h5>
          <el-table :data="result.failedList" border size="small">
            <el-table-column prop="summary" label="摘要" min-width="300">
              <template slot-scope="scope">
                <span class="failed-summary">{{ scope.row.summary || '(空)' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="error" label="错误原因" width="200" />
          </el-table>
        </div>

        <div class="action-buttons">
          <el-button type="success" @click="goToHistory">查看结果</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { patentApi } from '@/api'

export default {
  name: 'BatchClassification',
  data () {
    return {
      fileList: [],
      previewData: null,
      selectedColumn: '',
      processing: false,
      result: null,
      currentFile: null
    }
  },
  methods: {
    handleFileChange (file) {
      // 检查文件大小
      if (file.size > 5 * 1024 * 1024) {
        this.$message.error('文件大小不能超过5MB')
        this.fileList = []
        return
      }

      this.currentFile = file.raw
      this.fileList = [file]
      this.previewData = null
      this.selectedColumn = ''
      this.result = null

      // 调用预览接口
      this.loadPreview(file.raw)
    },

    handleFileRemove () {
      this.currentFile = null
      this.fileList = []
      this.previewData = null
      this.selectedColumn = ''
      this.result = null
    },

    async loadPreview (file) {
      try {
        const res = await patentApi.uploadPreview(file)
        if (res.code === 200) {
          this.previewData = res.data
          // 默认选择"摘要"列（如果存在）
          if (this.previewData.columns.includes('摘要')) {
            this.selectedColumn = '摘要'
          } else if (this.previewData.columns.length > 0) {
            this.selectedColumn = this.previewData.columns[0]
          }

          // 检查数量限制
          if (this.previewData.totalRows > 50) {
            this.$message.warning('文件数据超过50条，请拆分文件')
          }
        } else {
          this.$message.error(res.message || '文件解析失败')
          this.fileList = []
        }
      } catch (error) {
        this.$message.error('文件解析失败: ' + (error.message || '未知错误'))
        this.fileList = []
      }
    },

    async startBatchClassify () {
      if (!this.currentFile || !this.selectedColumn) {
        this.$message.warning('请先上传文件并选择摘要列')
        return
      }

      this.processing = true
      this.result = null

      try {
        const res = await patentApi.batchClassify(this.currentFile, this.selectedColumn)
        if (res.code === 200) {
          this.result = res.data
          this.$message.success(`批量分类完成，成功 ${res.data.success} 条`)
        } else {
          this.$message.error(res.message || '批量分类失败')
        }
      } catch (error) {
        this.$message.error('批量分类失败: ' + (error.message || '未知错误'))
      } finally {
        this.processing = false
      }
    },

    goToHistory () {
      if (this.result && this.result.batchId) {
        this.$router.push({
          path: '/classification-history',
          query: { batchId: this.result.batchId }
        })
      } else {
        this.$router.push('/classification-history')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.batch-classification {
  padding: 20px;

  .main-card {
    max-width: 900px;
    margin: 0 auto;

    .card-header {
      font-size: 18px;
      font-weight: bold;
    }
  }

  .upload-area {
    margin-bottom: 20px;

    .el-upload-dragger {
      width: 100%;
    }
  }

  .column-select {
    margin-bottom: 20px;
    display: flex;
    align-items: center;

    .label {
      margin-right: 10px;
      font-weight: 500;
    }

    .total-info {
      margin-left: 20px;
      color: #909399;
    }
  }

  .preview-section {
    margin-bottom: 20px;

    h4 {
      margin-bottom: 10px;
      color: #303133;
    }

    .preview-text {
      font-size: 13px;
      word-break: break-all;
    }
  }

  .action-buttons {
    margin-top: 20px;
    text-align: center;
  }

  .result-section {
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #ebeef5;

    h4 {
      margin-bottom: 15px;
      color: #303133;
    }

    .result-summary {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 15px;

      .batch-id {
        color: #909399;
        font-size: 13px;
      }
    }

    .failed-list {
      margin-top: 15px;

      h5 {
        color: #f56c6c;
        margin-bottom: 10px;
      }

      .failed-summary {
        font-size: 12px;
        color: #909399;
        word-break: break-all;
      }
    }
  }
}
</style>