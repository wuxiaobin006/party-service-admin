/*
* @Author: 范开杰
* @Date: 2020-07-22
* @Last Modified by: 范开杰
* @Last Modified time: 2020-12-01 13:04:01
*/
//财务管理-课程收费页面
<template>
  <div class="courseFee">
    <div class="courseFee_header"><!-- 课程收费头部 -->
      <el-row>
        <el-col :span="4">
          <el-select v-model="listQuery.searchYear" placeholder="请选择年份" @change="search()"><!-- 搜索年份 -->
            <el-option
              v-for="item in searchtype_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="3" :offset="16">
          <el-input v-model="listQuery.searchData" placeholder="输入课程名称搜索" clearable @keyup.enter.native="search" /><!-- 搜索对应的课程名称 -->
        </el-col>
        <el-col :span="1">
          <el-button type="primary" @click="search">搜索</el-button>
        </el-col>
      </el-row>
    </div>

    <div class="courseFee--table"><!-- 课程收费表格 -->
      <el-table
        v-loading="loading"
        :data="list"
        :default-sort="{prop: 'courseId', order: 'ascending'}"
        style="width: 100%"
      >
        <el-table-column
          label="课程号"
          prop="courseId"
          min-width="150px"
          sortable
        />
        <el-table-column
          label="课程名称"
          prop="courseName"
          sortable
        />
        <el-table-column
          label="创建时间"
          prop="createTime"
          sortable
        />
        <el-table-column
          label="课程价钱"
          prop="coursePrice"
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
    </div>
  </div>
</template>

<script>
import { getcourseFeeList } from '@/api/financialManage/courseFee'
import Pagination from '@/components/Pagination'
export default {
  name: 'CourseFee',
  components: { Pagination },
  data() {
    return {
      searchtype_options: [], // 年份选择框选项
      list: [], // 表格数据
      listQuery: { // 分页数据
        page: 1,
        limit: 10,
        searchYear: 2020, // 当前年份的值
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
     * 返回listQuery对象中的searchYear
     */
    newSearchYear() {
      return this.listQuery.searchYear
    },
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
     * 监视搜索年份选项
     * @param {object} val 当前搜索年份
     */
    newSearchYear(val) {
      this.sendData.year = val
    },

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
    this.getYearOptions()
  },
  methods: {
    /**
     * 获取后台(Mock)数据
     */
    getList() {
      getcourseFeeList(this.sendData).then(response => {
        this.list = response.data.data.map((item) => {
          return {
            courseId: item['courseId'],
            courseName: item['courseName'],
            createTime: item['courseCreateTime'],
            coursePrice: item['coursePrice']
          }
        })
        this.list.forEach(item => {
          item.coursePrice = parseFloat(item.coursePrice).toLocaleString('ch-CN', { style: 'currency', currency: 'CNY' })
        })
        this.total = response.data.count
        this.loading = false
      })
    },
    /**
     * 获取年份选项
     */
    getYearOptions() {
      for (let i = 2010; i <= 2020; i++) {
        this.searchtype_options.unshift(
          { value: i, label: i + '年' })
      }
    },
    /**
     * 搜索过滤数据
     */
    search() {
      this.sendData.courseName = this.listQuery.searchData
      this.listQuery.page = 1
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
  .courseFee {
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
