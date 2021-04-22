/*
* @Author: 吴晓斌
* @Date: 2020-09-14
* @Last Modified by: 吴晓斌
* @Last Modified time: 2020-10-23 14:23:21
*/
//财务管理-教师费用统计页面
<template>
  <div class="app-container">
    <div class="func-container">
      <div class="search">
        <el-input
          v-model="tempData.teacherName"
          placeholder="请输入教师姓名"
          class="search-input"
          prefix-icon="el-icon-search"
          clearable
          @change="searchByTeacherName"
          @keyup.enter.native="searchByTeacherName"
        />
      </div>
    </div>
    <div class="tableStyle">
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        :header-cell-style="{background:'#eef1f6',color:'black'}"
      >
        <el-table-column label="教师Id" prop="teacherId" sortable align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.teacherId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="教师姓名" prop="teacherName" sortable align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.teacherName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="总收入(单位：元)" prop="teacherTotalIncome" sortable align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.teacherTotalIncome }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-search" size="mini" @click="feeDetailInfoBtn(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="pageNo"
        :limit.sync="pageSize"
        @pagination="getTeacherFeeStatisticsList"
      /> <!--分页组件-->
    </div>
    <el-dialog :title="detailTitle" :visible.sync="dialogFormVisible">
      <el-table
        :data="incomeDetailData"
        border
        fit
        highlight-current-row
      >
        <el-table-column label="课程Id" prop="courseId" sortable align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.courseId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="课程名称" prop="courseName" sortable align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.courseName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="课程收入(单位：元)" prop="totalFee" sortable align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.totalFee }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { getTeacherTotalIncome, getTeacherDetailIncomeInfo } from '@/api/financialManage/teacherFeeStatistics'
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  data() {
    return {
      list: null, // 教师总收入列表数据
      listLoading: true,
      total: 0,
      pageNo: 1,
      pageSize: 20,
      tempData: {
        teacherName: '',
        teacherId: ''
      },
      detailTitle: '收入详情',
      dialogFormVisible: false,
      incomeDetailData: null // 某教师的课程收入详情列表数据
    }
  },
  created() {
    this.getTeacherFeeStatisticsList()
  },
  methods: {
    async getTeacherFeeStatisticsList() { // 获取教师总收入列表
      try {
        const res = await getTeacherTotalIncome(this.tempData.teacherName, this.pageNo, this.pageSize)
        this.list = res.data.data
        this.total = res.data.totalCount
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      } catch (err) {
        console.log(err)
      }
    },
    async getTeacherDetailIncomeInfo() { // 获取某教师的课程收入详情列表
      try {
        const res = await getTeacherDetailIncomeInfo(this.tempData.teacherId)
        this.incomeDetailData = res.data
      } catch (err) {
        console.log(err)
      }
    },
    searchByTeacherName() { // 通过教师名字搜索
      this.getTeacherFeeStatisticsList()
    },
    feeDetailInfoBtn(row) { // 查看某教师的课程收入详情
      this.dialogFormVisible = true
      this.tempData.teacherId = row.teacherId
      this.getTeacherDetailIncomeInfo()
    }
  }
}
</script>

<style lang="scss" scoped>
    .func-container {
      margin-bottom: 10px;
      display: flex;
      justify-content: flex-start;
      .search {
        .search-input {
          width: 180px;
          margin-right: 5px;
        }
      }
    }
    .tableStyle {
      width: 100%;
      border: 1px solid #DCDFE6;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    }
</style>
