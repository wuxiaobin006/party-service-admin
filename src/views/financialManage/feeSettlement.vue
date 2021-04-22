/*
* @Author: 吴晓斌
* @Date: 2020-09-09
* @Last Modified by: 吴晓斌
* @Last Modified time: 2020-10-21 15:23:21
*/
//财务管理-收费结算页面
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
        <el-table-column label="总收费" prop="totalFee" sortable align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.totalFee }}</span>
          </template>
        </el-table-column>
        <el-table-column label="总退款" prop="totalRefundFee" sortable align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.totalRefundFee }}</span>
          </template>
        </el-table-column>
        <el-table-column label="招生数" prop="saleNum" sortable align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.saleNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="退生数" prop="refundNum" sortable align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.refundNum }}</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="pageNo"
        :limit.sync="pageSize"
        @pagination="getFeeSettlementList"
      /> <!--分页组件-->
    </div>
  </div>
</template>

<script>
import { queryCourseTotalRevenue } from '@/api/financialManage/feeSettlement'
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      pageNo: 1,
      pageSize: 20
    }
  },
  created() {
    this.getFeeSettlementList()
  },
  methods: {
    async getFeeSettlementList() {
      this.listLoading = true
      try {
        const res = await queryCourseTotalRevenue(this.pageNo, this.pageSize)
        this.list = res.data.data
        this.total = res.data.totalCount
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      } catch (err) {
        console.log(err)
      }
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
