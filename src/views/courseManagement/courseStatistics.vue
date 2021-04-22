/*
* @Author: 范开杰
* @Date: 2020-06-12
* @Last Modified by: 范开杰
* @Last Modified time: 2020-11-02 17:52:01
*/
//课程管理-课程统计页面
<template>
  <div class="classStatistics">
    <div class="classStatistics_header"><!-- 课程统计头部 -->
      <el-row>
        <el-col :span="3" :offset="20">
          <el-input v-model="listQuery.searchData" placeholder="输入课程名称搜索" clearable @keyup.enter.native="search" /><!-- 搜索对应的课程名称 -->
        </el-col>
        <el-col :span="1">
          <el-button type="primary" @click="search">搜索</el-button>
        </el-col>
      </el-row>
    </div>

    <div class="classStatistics--table"><!-- 课程信息表格 -->
      <el-table
        v-loading="loading"
        :data="list"
        :default-sort="{prop: 'classId', order: 'ascending'}"
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
          prop="className"
          sortable
        />
        <el-table-column
          label="教师姓名"
          prop="teacherName"
          sortable
        />
        <el-table-column
          label="学生名单"
          prop="classMember"
          align="center"
          min-width="50px"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-user-solid"
              size="mini"
              @click="openDialog(scope.row);"
            >
              名单
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          prop="operation"
          align="center"
          min-width="50px"
        >
          <template slot-scope="{row,$index}">
            <el-popconfirm
              title="确定删除该文章吗？"
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

      <el-dialog
        title="学生名单"
        :visible.sync="dialogTableVisible"
        width="50%"
        @opened="addListeners();handleScroll()"
        @closed="removeListeners"
      >
        <el-table
          ref="studentTable"
          v-loading="dialogLoading"
          :data="virtualRows"
          class="virtual-table"
          height="440px"
          :max-height="440"
        >
          <el-table-column prop="studentID" label="学号" min-width="200px" show-overflow-tooltip />
          <el-table-column prop="name" label="姓名" show-overflow-tooltip />
          <el-table-column prop="sex" label="性别" show-overflow-tooltip />
          <el-table-column prop="address" label="地址" show-overflow-tooltip />
          <el-table-column prop="phone" label="手机号" show-overflow-tooltip />
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getClassStatisticsList, getStudentList, deleteCourseMessage } from '@/api/CourseStatistics'
import Pagination from '@/components/Pagination'
export default {
  name: 'CourseStatistics',
  components: { Pagination },
  data() {
    return {
      list: [], // 表格数据
      studentList: [], // 学生表格数据
      virtualRows: [], // 虚拟列表分段后的数据
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
      searchStudentList: { // 获取学生名单列表所需数据
        courseId: undefined
      },
      deleteCourse: { // 删除课程所需数据
        courseId: undefined
      },
      total: 0, // 取得数据总数
      loading: true, // 表格加载状态
      dialogTableVisible: false, // 学生名单对话框显示状态
      dialogLoading: true, // 学生名单表格加载状态
      isDialogOpen: false // 判断学生名单对话框是否打开
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
    },

    /**
     * 监视学生列表数据
     */
    studentList: function() {
      var that = this
      that.$nextTick(function() {
        if (that.isDialogOpen) {
          this.dialogTableVisible = true
        }
      })
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    /**
     * 获取课程统计数据
     */
    getList() {
      getClassStatisticsList(this.sendData).then(response => {
        this.list = response.data.data.map((item) => {
          return {
            courseId: item['courseId'],
            className: item['courseName'],
            teacherName: item['teacherName']
          }
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
     * 打开学生列表弹窗
     * @param {Object} row 当前行
     */
    openDialog(row) {
      this.getStudentList(row)
    },
    /**
     * 获取学生列表
     * @param {Object} val 当前行
     */
    getStudentList(val) {
      this.searchStudentList.courseId = val.courseId
      getStudentList(this.searchStudentList).then(response => {
        this.studentList = response.data.map((item) => {
          return {
            studentID: item['id'],
            name: item['name'],
            sex: item['sex'],
            address: item['address'],
            phone: item['familyPhone'],
            orgId: item['orgId']
          }
        })
        this.$nextTick(function() {
          this.dialogLoading = false
          this.isDialogOpen = true
        })
      })
    },
    /**
     * 删除当前课程数据
     * @param {Object} row 当前行
     */
    handleDelete(row) {
      this.deleteCourse.courseId = row.courseId
      deleteCourseMessage(this.deleteCourse).then(response => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        const index = this.list.findIndex(v => v.id === row.id)
        this.list.splice(index, 1)
        this.getList()
      })
    },
    /**
     * 对学生列表table增加监听事件
     */
    addListeners() {
      this.$nextTick(() => {
        if (!this.$refs.studentTable.bodyWrapper) {
          return
        }
        this.$refs.studentTable.bodyWrapper.addEventListener('scroll', this.debounce(() => {
          this.handleScroll()
        }, 0))
      })
    },
    /**
     * 对学生列表table移除监听事件
     */
    removeListeners() {
      if (!this.$refs.studentTable.bodyWrapper) {
        return
      }
      this.$refs.studentTable.bodyWrapper.removeEventListener('scroll', this.handleScroll())
      this.dialogLoading = true
      this.isDialogOpen = false
      this.studentList = []
    },
    /**
     * 处理学生列表滚动事件
     */
    handleScroll() {
      setTimeout(() => {
        this.updateVisibleItems()
      }, 10)
    },
    /**
     * 获取当前学生列表滚动条位置
     * @returns {Object} 滚动条当前起始点与终点
     */
    getScroll() {
      if (!this.$refs.studentTable.bodyWrapper) {
        return {
          start: 0,
          end: 400
        }
      }
      const dom = this.$refs.studentTable.bodyWrapper
      const scrollState = {
        start: dom.scrollTop,
        end: dom.scrollTop + dom.clientHeight
      }
      return scrollState
    },
    /**
     * 更新学生列表可视区域的数据
     */
    updateVisibleItems() {
      const itemSize = 40 // td高度
      const count = this.studentList.length // table总条数
      const bufferCount = 10 // table每次实际渲染条数
      const height = count * itemSize

      // 获取当前滚动条位置
      const scroll = this.getScroll()
      const scrollTop = scroll.start

      // 计算当前开始索引
      let startIndex
      startIndex = ~~(scrollTop / itemSize)
      startIndex < 0 && (startIndex = 0)
      // 分隔数组
      this.virtualRows = this.studentList.slice(startIndex, startIndex + bufferCount)

      // 设置el-table上的虚拟列表，采用了padding的方案，原因是transform 会使el-table的样式混乱
      const mainTable = this.$refs.studentTable.$el.getElementsByClassName('el-table__body')
      Array.from(mainTable).forEach(table => {
        table.style.height = height + 'px'
        if (startIndex + bufferCount >= count) {
          // 由于el-table 在滚动到最后时，会出现抖动，因此增加判断，单独设置属性
          table.style.paddingTop = startIndex * itemSize - itemSize + 'px'
          table.style.paddingBottom = 0
        } else {
          table.style.paddingTop = startIndex * itemSize + 'px'
          table.style.paddingBottom = height - scrollTop - bufferCount * itemSize + 'px'
        }
      })
    },
    /**
     * 防抖动方法
     * @param {Object} func
     * @param {Number} delay
     * @returns {Object} 在delay时间仅执行一次参数func的方法
     */
    debounce(func, delay) {
      var timer = null
      return function() {
        clearTimeout(timer)
        timer = setTimeout(func, delay)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .classStatistics {
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
    &--currentData{
      display: inline-block;
      font-weight: 400;
      font-size: 13px;
      color: #606266;
      height: 28px;
      line-height: 28px;
      margin-top: 5px;
      margin-left: 5px;
    }
  }
</style>
