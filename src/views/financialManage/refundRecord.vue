/*
* @Author: 范开杰
* @Date: 2020-09-09
* @Last Modified by: 范开杰
* @Last Modified time: 2020-12-01 13:04:01
*/
//财务管理-退费记录页面
<template>
  <div class="refundRecord">
    <div class="refundRecord_header"><!-- 退费记录头部 -->
      <el-row>
        <el-col :span="3" :offset="20">
          <el-input v-model="listQuery.searchData" placeholder="输入课程名称搜索" clearable @keyup.enter.native="search" /><!-- 搜索对应的课程名称 -->
        </el-col>
        <el-col :span="1">
          <el-button type="primary" @click="search">搜索</el-button>
        </el-col>
      </el-row>
    </div>

    <div class="refundRecord--table"><!-- 退费记录表格 -->
      <el-table
        v-loading="loading"
        :data="list"
        :default-sort="{prop: 'studentID', order: 'ascending'}"
        style="width: 100%"
      >
        <el-table-column
          label="学生姓名"
          prop="studentName"
          sortable
        />
        <el-table-column
          label="课程编号"
          prop="courseId"
          sortable
        />
        <el-table-column
          label="退款原因"
          prop="refundReason"
          sortable
        />
        <el-table-column
          label="退款金额(单位:元)"
          prop="refundAmount"
          sortable
        />
        <el-table-column
          label="退款状态"
          prop="refundStatus"
          sortable
        />
        <el-table-column
          label="操作员"
          prop="operator"
          sortable
        />
        <el-table-column
          label="操作时间"
          prop="operatingTime"
          sortable
        />
        <el-table-column
          label="创建时间"
          prop="createTime"
          sortable
        />
        <el-table-column
          label="操作"
          prop="operation"
          sortable
        >
          <template slot-scope="{row,$index}">
            <el-popconfirm
              title="确定删除吗？"
              icon="el-icon-info"
              icon-color="red"
              @onConfirm="handleDelete(row,$index)"
            >
              <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <el-row type="flex" justify="end">
        <el-col :span="24" class="pagination">
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="listQuery.page"
            :limit.sync="listQuery.limit"
            @pagination="getList"
          />
        </el-col> <!-- 分页 -->
      </el-row>
    </div>
  </div>
</template>

<script>
import { getrefundRecordList, deleterefundRecord } from '@/api/financialManage/refundRecord'
import Pagination from '@/components/Pagination'
export default {
  name: 'RefundRecord',
  components: { Pagination },
  data() {
    return {
      list: [], // 表格数据
      listQuery: { // 分页数据
        page: 1,
        limit: 10,
        searchData: undefined // 右上方搜索框的值
      },
      sendData: { // 获取数据所需参数
        courseName: undefined,
        pageNo: undefined,
        pageSize: undefined
      },
      total: 0, // 取得数据总数
      loading: true // 表格加载状态
    }
  },
  computed: {
    /**
     * 返回listQuery对象中的page
     */
    newPage() {
      return this.listQuery.page
    },
    /**
     * 返回listQuery对象中的limit
     */
    newLimit() {
      return this.listQuery.limit
    },
    /**
     * 返回listQuery对象中的searchData
     */
    newSearchData() {
      return this.listQuery.searchData
    }
  },
  watch: {
    /**
     * 监视分页的当前页数
     * @param {Number} val 当前页数
     */
    newPage(val) {
      this.sendData.pageNo = val
    },

    /**
     * 监视分页中每页显示数量
     * @param {Number} val 每页显示数量
     */
    newLimit(val) {
      this.sendData.pageSize = val
    },

    /**
     * 监视搜索内容并在清空时重新获取数据
     * @param {String} val 当前搜索输入框数据
     */
    newSearchData(val) {
      if (val === '') {
        this.search()
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    /**
     * 获取退费记录数据
     */
    getList() {
      getrefundRecordList(this.sendData).then(response => {
        this.list = response.data.data.map((item) => {
          return {
            studentName: item['studentName'],
            refundReason: item['refundReason'],
            courseId: item['courseId'],
            refundAmount: item['refundFee'],
            operator: item['operatorId'],
            operatingTime: item['updateTime'],
            createTime: item['createTime'],
            refundStatus: item['refundStatus']
          }
        })
        const status = new Map([[0, '未支付'], [1, '已支付'], [2, '已取消'], [3, '已申请退费'], [4, '退费通过'], [5, '已拒绝退费']])
        this.list.forEach(item => {
          item.refundAmount = parseFloat(item.refundAmount).toLocaleString('ch-CN', { style: 'currency', currency: 'CNY' })
          item.refundStatus = status.get(item.refundStatus)
        })
        this.total = response.data.totalCount
        this.loading = false
      })
    },
    /**
     * 搜索过滤数据
     */
    search() {
      this.sendData.courseName = this.listQuery.searchData
      this.listQuery.page = 1
      this.getList()
    },
    /**
     * 删除退费记录
     * @param {Object} row 当前行
     */
    handleDelete(row) {
      deleterefundRecord(row.id).then(response => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      }).catch(response => {
        this.$notify.error({
          title: '失败',
          message: '删除失败',
          duration: 2000
        })
        this.resetForm()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .refundRecord {
    padding: 30px;
    &--table{
      margin-top: 10px;
      padding: 5px;
      border: 1px solid #DCDFE6;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
    }
    &--pagination{
      display: flex;
      justify-content: flex-end;
      width: 100%;
      margin-top: 5px;
    }
  }
</style>
