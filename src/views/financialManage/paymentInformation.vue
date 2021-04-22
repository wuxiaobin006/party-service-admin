/*
* @Author: 范开杰
* @Date: 2020-09-08
* @Last Modified by: 范开杰
* @Last Modified time: 2020-12-01 10:04:01
*/
//财务管理-缴费信息页面
<template>
  <div class="paymentInformation">
    <div class="paymentInformation_header"><!-- 缴费信息头部 -->
      <el-row>
        <el-col :span="4">
          <el-select v-model="listQuery.options_value" placeholder="请选择缴费状态" clearable @change="search()"><!-- 搜索状态 -->
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <!-- <el-col :span="1">
          <el-button type="primary" @click="dialogFormVisible = true">新增</el-button>
        </el-col> -->
        <el-col :span="3" :offset="16">
          <el-input v-model="listQuery.searchData" placeholder="输入搜索课程名称" clearable @keyup.enter.native="search" />
        </el-col>
        <el-col :span="1">
          <el-button type="primary" @click="search">搜索</el-button>
        </el-col>
      </el-row>
    </div>

    <div class="paymentInformation--table"><!-- 缴费信息表格 -->
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
          label="实收/退费金额"
          prop="refundAmount"
          sortable
        />
        <el-table-column
          label="课程名称"
          prop="className"
          sortable
        />
        <el-table-column
          label="缴费时间"
          prop="paymentTime"
          sortable
        />
        <el-table-column
          label="缴费状态"
          prop="paymentState"
          sortable
        />
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

      <el-dialog title="新增缴费信息" custom-class="dialog" :visible.sync="dialogFormVisible" width="25%">
        <el-form :model="form">
          <el-form-item label="学生ID" :label-width="formLabelWidth" required>
            <el-input v-model="form.studentId" class="paymentInformation--formItem" />
          </el-form-item>
          <el-form-item label="课程ID" :label-width="formLabelWidth" required>
            <el-input v-model="form.courseId" class="paymentInformation--formItem" />
          </el-form-item>
          <el-form-item label="缴费金额" :label-width="formLabelWidth" required>
            <el-input v-model="form.totalFee" class="paymentInformation--formItem" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false;resetForm()">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false;addForm()">添 加</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getPaymentInformationList, addPaymentInformation } from '@/api/financialManage/paymentInformation'
import Pagination from '@/components/Pagination'
export default {
  name: 'PaymentInformation',
  components: { Pagination },
  data() {
    return {
      options: [], // 搜索选项
      list: [], // 表格数据
      listQuery: { // 分页数据
        page: 1,
        limit: 10,
        options_value: undefined, // 搜索选项的值
        searchData: undefined // 右上方搜索框的值
      },
      sendData: { // 获取数据所需参数
        payStatus: undefined,
        courseName: undefined,
        pageNo: undefined,
        pageSize: undefined
      },
      total: 0, // 取得数据总数
      loading: true, // 表格加载状态
      dialogFormVisible: false, // 新增缴费信息对话框显示状态
      form: { // 提交表单
        totalFee: undefined,
        studentId: undefined,
        courseId: undefined
      },
      formLabelWidth: '30%' // 表单输入框长度
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
    this.setOptions()
  },
  methods: {
    /**
     * 获取缴费信息数据
     */
    getList() {
      getPaymentInformationList(this.sendData).then(response => {
        this.list = response.data.data.map((item) => {
          return {
            studentName: item['studentName'],
            refundAmount: item['totalFee'],
            className: item['courseName'],
            paymentTime: item['date'],
            paymentState: item['payStatus']
          }
        })
        const status = new Map([['0', '未支付'], ['1', '已支付'], ['2', '已取消'], ['3', '已申请退费'], ['4', '退费通过'], ['5', '已拒绝退费']])
        this.list.forEach(item => {
          item.refundAmount = parseFloat(item.refundAmount).toLocaleString('ch-CN', { style: 'currency', currency: 'CNY' })
          item.paymentState = status.get(item.paymentState)
        })
        this.total = response.data.totalCount
        this.loading = false
      })
    },
    /**
     * 搜索过滤数据
     */
    search() {
      this.sendData.payStatus = this.listQuery.options_value
      this.sendData.courseName = this.listQuery.searchData
      this.listQuery.page = 1
      console.log(this.sendData.courseName)
      this.getList()
    },
    /**
     * 新增缴费信息数据
     */
    addForm() {
      addPaymentInformation(this.form).then(response => {
        this.$notify({
          title: '成功',
          message: '新增缴费信息成功',
          type: 'success',
          duration: 2000
        })
        this.resetForm()
      }).catch(response => {
        this.$notify.error({
          title: '失败',
          message: '新增缴费信息失败',
          duration: 2000
        })
        this.resetForm()
      })
    },
    /**
     * 重置表单
     */
    resetForm() {
      this.form = {
        totalFee: undefined,
        studentId: undefined,
        courseId: undefined
      }
    },
    /**
     * 设置左上选项列表
     */
    setOptions() {
      this.options = [
        { value: 0, label: '未支付' },
        { value: 1, label: '已支付' },
        { value: 2, label: '已取消' },
        { value: 3, label: '已申请退费' },
        { value: 4, label: '退费通过' },
        { value: 5, label: '已拒绝退费' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
  .paymentInformation {
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
    &--formItem{
      width:75%
    }
  }
  /deep/ .dialog{
    border-radius: 10px;
  }
</style>
