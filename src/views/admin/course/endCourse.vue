<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input
        v-model="params.keyword"
        clearable
        placeholder="输入搜索内容"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="toQuery"
      />
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-plus" @click="add">新增</el-button>
    </div>
    <!--表单组件-->
    <e-from ref="form" :is-add="isAdd" @close="load()"/>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      style="width: 100%;"
      stripe
      empty-text="暂无数据"
      highlight-current-row
      current-row-key="id"
    >
      <el-table-column prop="id" label="课程编号" min-width="100" show-overflow-tooltip/>
      <el-table-column prop="name" label="课程名称" min-width="200"/>
      <el-table-column prop="sname" label="上课时间" show-overflow-tooltip min-width="100">
        <template slot-scope="scope">
          {{scope.row.sw}}&nbsp; {{scope.row.sse}}
        </template>
      </el-table-column>
      <el-table-column prop="wname" label="上课周数" show-overflow-tooltip min-width="120"/>
      <el-table-column prop="teacherName" label="上课教师" show-overflow-tooltip min-width="120"/>
      <el-table-column prop="collegeName" label="开课学院" show-overflow-tooltip min-width="120"/>
      <el-table-column prop="nname" label="课程性质" show-overflow-tooltip min-width="100"/>
      <el-table-column prop="totalTime" label="总学时" show-overflow-tooltip width="60"/>
      <el-table-column prop="ename" label="考核方式" show-overflow-tooltip min-width="80"/>
      <el-table-column
        label="操作"
        width="200px"
        align="center"
      >
        <template slot-scope="scope">
          <el-row>
            <el-col :span="10">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="agree(scope.row)">同意
              </el-button>
            </el-col>
            <el-col :span="4"/>
            <el-col :span="10">
              <el-button size="mini" type="warning" icon="el-icon-edit" @click="reject(scope.row)">拒绝
              </el-button>
            </el-col>
          </el-row>
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
          @current-change="pageChange"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import service from '../../../utils/request'
  import eFrom from './form'
  import { endApply,updateCourseEnd } from '@/api/admin/course/course'

  export default {
    components: {
      eFrom
    },
    data() {
      return {
        loading: true,
        delLoading: false,
        total: 0,
        isAdd: false,
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
        endApply().then(res => {
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
      subDelete(id, status) {
        this.delLoading = true
        this.$confirm('确定进行此操作吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          del(id).then(res => {
            this.delLoading = false
            this.$notify({
              title: '成功',
              type: 'success',
              duration: 2500
            })
            this.load()
          }).catch(err => {
            this.delLoading = false
            console.log(err.response.data.message)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },
      add() {
        this.isAdd = true
        this.$refs.form.dialog = true
      },
      edit(data) {
        this.isAdd = false
        const _this = this.$refs.form
        _this.form = {
          id: data.id,
          username: data.username,
          password: data.password,
          qx: data.qx,
          collegeId: data.collegeId,
          status: data.status
        }
        _this.dialog = true
      },
      toQuery() {
        this.load()
      },
      agree(val) {
        val['endStatus'] = 'agree'
        updateCourseEnd(val).then(res => {
          if (res.status == '1') {
            this.$message({
              type: 'success',
              message: '已同意'
            })
            this.load()
          }
        }).catch(res => {
          this.$message({
            type: 'error',
            message: '操作失败'
          })
        })
      },
      reject(val) {
        val['endStatus'] = 'reject'
        updateCourseEnd(val).then(res => {
          if (res.status == '1') {
            this.$message({
              type: 'success',
              message: '已拒绝'
            })
            this.load()
          }
        }).catch(res => {
          this.$message({
            type: 'error',
            message: '操作失败'
          })
        })
      }
    }
  }
</script>

<style scoped>
  .status {
    color: green;
  }
</style>
