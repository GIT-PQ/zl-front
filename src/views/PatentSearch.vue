<template>
  <div class="patent-search">
    <el-card>
      <div slot="header">
        <h2>专利检索</h2>
      </div>
      <el-form :model="searchForm" :inline="true" label-width="80px">
        <el-form-item label="关键词">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入关键词"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="分类">
          <el-select
            v-model="searchForm.category"
            placeholder="请选择分类"
            clearable
            style="width: 200px"
          >
            <el-option label="A部-人类生活必需" value="A部" />
            <el-option label="B部-作业、运输" value="B部" />
            <el-option label="C部-化学、冶金" value="C部" />
            <el-option label="D部-纺织、造纸" value="D部" />
            <el-option label="E部-固定建筑物" value="E部" />
            <el-option label="F部-机械工程" value="F部" />
            <el-option label="G部-物理" value="G部" />
          </el-select>
        </el-form-item>
        <el-form-item label="申请日期">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleSearch">
            检索
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-divider />

      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        stripe
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="title" label="专利标题" min-width="200" show-overflow-tooltip />
        <el-table-column prop="category" label="分类" width="120" />
        <el-table-column prop="patentNumber" label="专利号" width="150" />
        <el-table-column prop="applicant" label="申请人" width="150" />
        <el-table-column prop="applicationDate" label="申请日期" width="120" />
        <el-table-column prop="abstract" label="摘要" min-width="300" show-overflow-tooltip />
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="handleViewDetail(scope.row)"
            >
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-if="total > 0"
        style="margin-top: 20px; text-align: right"
        :current-page="pagination.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pagination.pageSize"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />

      <!-- 详情对话框 -->
      <el-dialog
        title="专利详情"
        :visible.sync="detailDialogVisible"
        width="60%"
      >
        <el-descriptions :column="2" border>
          <el-descriptions-item label="专利标题">
            {{ currentDetail.title }}
          </el-descriptions-item>
          <el-descriptions-item label="专利号">
            {{ currentDetail.patentNumber }}
          </el-descriptions-item>
          <el-descriptions-item label="分类">
            {{ currentDetail.category }}
          </el-descriptions-item>
          <el-descriptions-item label="申请人">
            {{ currentDetail.applicant }}
          </el-descriptions-item>
          <el-descriptions-item label="申请日期">
            {{ currentDetail.applicationDate }}
          </el-descriptions-item>
          <el-descriptions-item label="摘要" :span="2">
            {{ currentDetail.abstract }}
          </el-descriptions-item>
        </el-descriptions>
        <span slot="footer" class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { patentApi } from '../api'

export default {
  name: 'PatentSearch',
  data () {
    return {
      searchForm: {
        keyword: '',
        category: '',
        dateRange: null
      },
      loading: false,
      tableData: [],
      total: 0,
      pagination: {
        page: 1,
        pageSize: 10
      },
      detailDialogVisible: false,
      currentDetail: {}
    }
  },
  mounted () {
    this.handleSearch()
  },
  methods: {
    handleSearch () {
      this.loading = true
      const params = {
        keyword: this.searchForm.keyword || undefined,
        category: this.searchForm.category || undefined,
        page: this.pagination.page,
        pageSize: this.pagination.pageSize
      }

      // 如果有日期范围，添加到参数中
      if (this.searchForm.dateRange && this.searchForm.dateRange.length === 2) {
        params.startDate = this.searchForm.dateRange[0]
        params.endDate = this.searchForm.dateRange[1]
      }

      // 真实后端请求代码：
      // patentApi.search(params)
      //   .then(res => {
      //     if (res.code === 200) {
      //       this.tableData = res.data.list
      //       this.total = res.data.total
      //       this.pagination.page = res.data.page
      //       this.pagination.pageSize = res.data.pageSize
      //       this.$message.success(res.message)
      //     } else {
      //       this.$message.error(res.message)
      //     }
      //   })
      //   .catch(err => {
      //     this.$message.error('检索失败，请稍后重试')
      //     console.error(err)
      //   })
      //   .finally(() => {
      //     this.loading = false
      //   })

      // 当前使用假数据
      patentApi.search(params)
        .then(res => {
          if (res.code === 200) {
            this.tableData = res.data.list
            this.total = res.data.total
            this.pagination.page = res.data.page
            this.pagination.pageSize = res.data.pageSize
            this.$message.success({ message: res.message, duration: 1000 })
          } else {
            this.$message.error({ message: res.message, duration: 1000 })
          }
        })
        .catch(err => {
          this.$message.error({ message: '检索失败，请稍后重试', duration: 1000 })
          console.error(err)
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleReset () {
      this.searchForm = {
        keyword: '',
        category: '',
        dateRange: null
      }
      this.pagination.page = 1
      this.handleSearch()
    },
    handleSizeChange (val) {
      this.pagination.pageSize = val
      this.pagination.page = 1
      this.handleSearch()
    },
    handlePageChange (val) {
      this.pagination.page = val
      this.handleSearch()
    },
    handleViewDetail (row) {
      // 真实后端请求代码：
      // patentApi.getDetail(row.id)
      //   .then(res => {
      //     if (res.code === 200) {
      //       this.currentDetail = res.data
      //       this.detailDialogVisible = true
      //     } else {
      //       this.$message.error(res.message)
      //     }
      //   })
      //   .catch(err => {
      //     this.$message.error('获取详情失败')
      //     console.error(err)
      //   })

      // 当前使用假数据
      this.currentDetail = row
      this.detailDialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
.patent-search {
  padding: 20px;
}
</style>
