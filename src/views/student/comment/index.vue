<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div style="margin-top: 10px">
        <el-button class="filter-item" size="mini" type="primary" icon="el-icon-zoom-in">查询班级学生
        </el-button>
      </div>
    </div>
    <!--表格渲染-->
    <el-table
      ref="table"
      v-loading="loading"
      :data="data"
      size="small"
      style="width: 100%;"
      stripe
      empty-text="暂无数据"
      highlight-current-row
      current-row-key="id"
      @select="handleSelectionChange"
    >
      <el-table-column prop="tname" label="学年学期" min-width="100"/>
      <el-table-column prop="commentType" label="评价分类" min-width="100">
        <template slot-scope="scope">
          {{scope.row.commentType == 1 ? "学生评价":""}}
        </template>
      </el-table-column>
      <el-table-column prop="commentBatch" label="评价批次" min-width="200"/>
      <el-table-column prop="beginTime" label="开始时间" show-overflow-tooltip min-width="100">
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间" show-overflow-tooltip min-width="100">
      </el-table-column>
      <el-table-column label="操作" width="100px"
                       align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="selectList(scope.row)">进入评价
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-row>
      <el-col :offset="10">
        <el-pagination
          :total="total"
          :current-page="params.offset"
          style="margin-top: 8px;"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, prev, pager, next, sizes"
          @size-change="sizeChange"
          @current-change="pageChange"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import service from '../../../utils/request'
  import { pageQuery } from '@/api/student/comment/comment'

  export default {
    data() {
      return {
        loading: true,
        total: 0,
        show: false,
        isAdd: false,
        classesId: null,
        classname: null,
        params: {
          offset: 1,
          limit: 10,
          keyword: null,
          status: null
        },
        data: null
      }
    },
    created() {
      this.load()
    },
    methods: {
      load() {
        pageQuery().then(res => {
          this.data = res.records
          this.loading = false
          this.currentPage = res.current
          this.total = res.realTotal
        }).catch(error => {
          this.loading = false
          this.$notify({
            title: '错误信息',
            message: '登录超时，请重新登录'
          })
          this.$router.push({ path: '/login' })
        })
      },
      sizeChange(val) {
        this.params.limit = val
        this.load()
      },
      pageChange(val) {
        this.params.offset = val
        this.load()
      },
      toQuery() {
        this.load()
      },
      selectList(val) {
        this.$router.push({path:"teamComment",query:{"commentId":val.id}})
      },
      handleSelectionChange(val, row) {
        if (val.length == 0) {
          this.classesId = null
          this.classname = null
        } else if (val.length > 1) {
          this.$refs.table.clearSelection()
          this.$refs.table.toggleRowSelection(row)
          val.splice(0, val.length - 1)
          this.classesId = val[0].id
          this.classname = val[0].classname
        } else {
          this.classesId = val[0].id
          this.classname = val[0].classname
        }
      }
    }
  }
</script>

<style scoped>
  .status {
    color: green;
  }
</style>
