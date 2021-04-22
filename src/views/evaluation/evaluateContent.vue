<template>
  <div class="evaluate-container">
    <div class="searchbar-container">
      <div style="line-height: 40px; width: 80px;">课程名称</div>
      <el-select
        v-model="value"
        filterable
        remote
        placeholder="请选择"
        @change="search"
      >
        <el-option
          v-for="item in options"
          :key="item.courseId"
          :label="item.courseName"
          :value="item.courseId"
        />
      </el-select>
      <div class="search">
        <el-input
          v-model="CName"
          placeholder="课程名称"
          class="filter-item search-input"
          @keyup.enter.native="handleFilter"
        />
        <el-button class="filter-item search-button" type="primary" icon="el-icon-search" @click="searchByCName">
          搜索
        </el-button>
      </div>
    </div>
    <!-- 评价信息表格 -->
    <el-table
      v-loading="listLoading"
      :data="recodelist"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="95" sortable>
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="评价内容">
        <template slot-scope="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>
      <el-table-column label="星级" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.star }}
        </template>
      </el-table-column>
      <el-table-column label="评价人" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.studentName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="评价时间" width="160" align="center" prop="createTime" sortable />
      <el-table-column label="操作" align="center" width="300px">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click.native.prevent="deleteRow(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--弹窗-->
    <el-dialog :title="dialogTitle" width="50%" :visible.sync="iconFormVisible">
      <el-form :inline="true" :model="userInfo" :label-width="formLabelWidth">
        <el-form-item label="序号">
          <el-input v-model="userInfo.id" placeholder="序号" />
        </el-form-item>
        <el-form-item label="评价人">
          <el-input v-model="userInfo.studentName" placeholder="评价人" :disabled="true" />
        </el-form-item>
        <el-form-item label="评价内容">
          <el-input v-model="userInfo.content" placeholder="评价内容" />
        </el-form-item>
        <el-form-item label="星级">
          <el-input v-model="userInfo.star" placeholder="星级" />
        </el-form-item>
        <el-form-item label="评价时间">
          <el-input v-model="userInfo.createTime" placeholder="评价时间" :disabled="true" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="iconFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 底部分页 -->
    <el-row type="flex" justify="end">
      <el-col :span="24" class="pagination">
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="getList"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>

import { getListCourse } from '@/api/evaluationManage/evaluateContent' // 获取机构下所有课程
import { getEvaluationByCourseId } from '@/api/evaluationManage/evaluateContent' // 查询某课程评价
import { getEvaluationByCourseName } from '@/api/evaluationManage/evaluateContent' // 根据课程名搜索评价
import { updateEvaluation } from '@/api/evaluationManage/evaluateContent' // 修改评价
import { deleteEvaluationById } from '@/api/evaluationManage/evaluateContent' // 删除评价
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  data() {
    return {
      iconFormVisible: false,
      userInfo: {},
      dialogTitle: '编辑',
      value: '',
      CName: '',
      listLoading: true,
      options: [],
      recodelist: [],
      formLabelWidth: '120px',
      total: 0,
      listQuery: {
        page: 1,
        limit: 20
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 编辑
    handleEdit(index, row) {
      this.userInfo = JSON.parse(JSON.stringify(row))
      this.iconFormVisible = true
      this.rowIndex = index
    },
    // 弹窗确定
    submitUser() {
      var data = new FormData()
      data.append('evaluationId', this.userInfo.id)
      data.append('content', this.userInfo.content)
      data.append('star', this.userInfo.star)
      updateEvaluation(data).then(res => {
      })
      this.recodelist.splice(this.rowIndex, 1, this.userInfo)
      this.iconFormVisible = false
    },
    // 删除
    deleteRow(id) {
      var data = new FormData()
      data.append('evaluationId', id)
      deleteEvaluationById({ 'evaluationId': id }).then(res => {
      })
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      this.search()
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    // 模糊搜索
    searchByCName() {
      getEvaluationByCourseName(this.CName).then(response => {
        this.recodelist = response.data.data
        this.total = response.data.data.length
        this.listLoading = false
      })
    },
    // 搜索
    search() {
      getEvaluationByCourseId(this.value).then(response => {
        this.recodelist = response.data.data
        this.total = response.data.data.length
        this.listLoading = false
      })
    },
    // 获取课程列表
    getList() {
      getListCourse().then(response => {
        this.options = response.data.data
        this.value = response.data.data[0].courseId
        this.search()
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
.evaluate-container{
  padding: 30px;
  .searchbar-container{
    padding-bottom: 30px;
    display: flex;
    text-align:center;
    .search {
      margin-left: auto;
        .search-input {
          width: 200px;
        }
    }
  }
  .table-container {
      border: 1px solid #DCDFE6;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  }
  .el-table {
      width: 100%;
      border-radius: 10px 10px 0 0;
  }
  .pagination{
      display: flex;
      justify-content: flex-end;
      width: 100%;
      margin-top: 5px;
  }
}
</style>
