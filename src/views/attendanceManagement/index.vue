/*
* @Author: 冯伟棋
* @Date: 2020-07-21
* @Last Modified by: 冯伟棋
* @Last Modified time: 2020-09-08 13:50
*/
<template>
  <div class="app-container">
    <div class="tableStyle">
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        :header-cell-style="{background:'#eef1f6',color:'black'}"
      >
        <el-table-column label="课程ID" prop="classID" sortable align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.classId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="课程名称" prop="className" sortable align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.className }}</span>
          </template>
        </el-table-column>
        <el-table-column label="任课老师" prop="classTeacher" sortable align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.classTeacher }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上课时间" prop="Time" sortable align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.Time }}</span>
          </template>
        </el-table-column>
        <el-table-column label="缺席人数" prop="absentNum" sortable align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.absentNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="缺席名单" prop="absentList" sortable align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-search" size="mini" @click="attendanceDetailBtn(scope.row.absentNum)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="190px">
          <template>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="attendanceDeleteBtn()">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getattendanceList"
      />
    </div>

    <el-dialog
      title="缺席学生名单"
      :visible.sync="dialogFormVisible"
      width="50%"
    >
      <el-table
        ref="studentTable"
        v-loading="dialogLoading"
        :data="list"
        class="virtual-table"
        height="440px"
        :max-height="440"
      >
        <el-table-column prop="studentID" label="学号" min-width="200px" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.studentId }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.studentName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sex" label="性别" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.sex === 1 ? '男' : '女' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="地址" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.address }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="190px">
          <template>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="absentListDeleteBtn()">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { getattendanceList } from '@/api/attendanceManagement'
import Pagination from '@/components/Pagination'

export default {
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listloading: true,
      listQuery: {
        page: 1,
        limit: 20
      },
      dialogFormVisible: false,
      studentID: '1000',
      studentName: '@ctitle(2, 3)',
      sex: '@natural(0, 1)',
      address: '@ctitle(3, 6)',
      phone: '@natural(11)'
    }
  },
  created() {
    this.getattendanceList()
  },
  methods: {
    getattendanceList() {
      getattendanceList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
      })
      this.listloading - false
    },
    attendanceDetailBtn(num) {
      this.dialogFormVisible = true
    },
    attendanceDeleteBtn() {
      this.$confirm('确认删除考勤信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(action => {
        if (action === 'confirm') {
          this.$message({
            type: 'info',
            message: '已删除'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    absentListDeleteBtn() {
      this.$confirm('确认删除该缺席学生信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(action => {
        if (action === 'confirm') {
          this.$message({
            type: 'info',
            message: '已删除'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.func-container {
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;

  .search {
    .search-input {
      width: 300px;
      margin-right: 5px;
    }
  }
}

.tableStyle {
  width: 100%;
  border: 1px solid #dcdfe6;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
</style>
