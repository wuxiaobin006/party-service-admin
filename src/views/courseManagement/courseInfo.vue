/*
* @Author: 卢贤睿
* @Date: 2020-07-12
* @Last Modified by: 卢贤睿
* @Last Modified time: 2021-02-25 15:50:23
*/
<template>
  <div class="app-container">
    <div class="search-container" style="margin-bottom: 8px">
      <el-input
        v-model="courseNameKeyWord"
        :data="list"
        placeholder="课程名称"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="searchCourse"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="searchCourse">搜索</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      stripe
      fit
      highlight-current-row
    >
      <el-table-column prop="courseName" label="课程名称" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.courseName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="coursePrice" label="课程费用" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.coursePrice }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="courseNum" label="课程次数" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.courseNum }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sales" label="选课人数" sortable align="center">
        <template slot-scope="{row}">
          <span>{{ row.sales }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="150px">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-search" size="mini" @click="checkCourseDetail(scope.$index, scope.row)">查看</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCourseConfirm(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="pageNo"
      :limit.sync="pageSize"
      @pagination="getCourseManageInfo"
    />
    <el-dialog title="课程详情" :visible.sync="dialogFormVisible">
      <el-form
        ref="checkCourseDetail"
        :rules="rules"
        :model="courseDetail"
        label-position="left"
        size="mini"
      >
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="courseDetail.courseName" />
        </el-form-item>
        <el-form-item label="课程类型" prop="courseType">
          <el-radio-group v-model="courseDetail.courseType">
            <el-radio :label="1">书法</el-radio>
            <el-radio :label="2">绘画</el-radio>
            <el-radio :label="3">陶瓷</el-radio>
            <el-radio :label="4">其它</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="课程标签" prop="courseLabel">
          <el-input v-model="courseDetail.courseLabel" />
        </el-form-item>
        <el-form-item label="任课教师" prop="teacherName">
          <el-select ref="selectedTeacherName" v-model="courseDetail.teacherName" @change="teacherChange">
            <el-option
              v-for="(item,index) in select.teacherInfo"
              :key="index"
              :label="item.teacherName"
              :value="item.teacherId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课程费用" prop="coursePrice">
          <el-input v-model="courseDetail.coursePrice" />
        </el-form-item>
        <el-form-item label="课程简介" prop="courseSpecificIntroduction">
          <el-input v-model="courseDetail.courseSpecificIntroduction" type="textarea" />
        </el-form-item>
        <el-form-item label="课程介绍" prop="courseSpecificIntroduction">
          <el-input v-model="courseDetail.courseBasicIntroduction" type="textarea" />
        </el-form-item>
        <el-form-item label="课程内容" prop="courseContent">
          <el-input v-model="courseDetail.courseContent" type="textarea" />
        </el-form-item>
        <el-form-item label="课程图片" prop="courseImgUrl">
          <el-image v-if="courseDetail.courseImgUrl !== ''" class="courseDetailPic" title="点击查看图片" :src="courseDetail.courseImgUrl" @click="enlargeImg(courseDetail.courseImgUrl)" />
          <span v-else>无</span>
        </el-form-item>
        <el-form-item label="修改课程图片">
          <el-upload
            ref="uploadFile"
            action="#"
            accept="image/jpeg, image/png"
            :auto-upload="true"
            multiple
            :limit="1"
            :on-exceed="handleExceed"
            :http-request="uploadFile"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="el-icon-close" @click="editCourseInfo()">
          确定
        </el-button>
        <el-button type="el-icon-close" @click="closeCourseInfo()">
          取消
        </el-button>
      </div>
    </el-dialog>
    <el-image-viewer v-if="showViewer" class="imgViewer" :on-close="closeViewer" :url-list="[enlargeImgUrl]" :z-index="9999" />
  </div>
</template>

<script>
import {
  getCourseManageInfo,
  getAllTeacherInfo,
  deleteCourse,
  editCourseInfo,
  uploadCourseImg,
  getCourseInfo
} from '@/api/courseManage'
import Pagination from '@/components/Pagination'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'

export default {
  name: 'CourseManage',
  components: { Pagination, ElImageViewer },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      pageNo: 1,
      pageSize: 10,
      courseNameKeyWord: '',
      courseImageUrl: '',
      enlargeImgUrl: '',
      showViewer: false,
      isChange: false,
      fun: null,
      courseImgId: '',
      radio: '',
      radioGroup: ['书法', '绘画', '瓷器', '其它'],
      select: {
        teacherInfo: []
      },
      tempData: {
        courseId: ''
      },
      courseDetail: {
        courseName: '',
        courseImgUrl: '',
        courseType: '',
        teacherId: '',
        teacherName: '',
        coursePrice: '',
        courseContent: '',
        courseBasicIntroduction: '',
        courseLabel: '',
        courseSpecificIntroduction: ''
      },
      tempIndex: '',
      dialogFormVisible: false,
      rules: {
        courseName: [{ required: true, message: '请填写课程名称', trigger: 'blur' }],
        coursePrice: [{ type: 'number', required: true, message: '请填写课程费用（请输入数字）', trigger: 'blur', transform: (value) => Number(value) }]
      }
    }
  },
  watch: {
    courseNameKeyWord: function(str) {
      if (typeof str === 'string') {
        if (str.trim().length !== 0) {
          this.debounce(this.keyWordChange, 1000)
        }
      }
    }
    // 课程名称模糊搜索
    // async courseNameKeyWord(newKeyWord, oldKeyWord) {
    //   try {
    //     const res = await getCourseInfo(newKeyWord)
    //     this.list = res.data.data
    //     this.total = res.data.totalCount
    //     setTimeout(() => {
    //       this.listLoading = false
    //     }, 1.5 * 1000)
    //   } catch (err) {
    //     console.log(err)
    //   }
    // }
  },
  created() {
    this.getCourseManageInfo()
    this.getAllTeacherInfo()
  },
  methods: {
    // 获取课程信息
    async getCourseManageInfo() {
      this.listLoading = true
      try {
        const res = await getCourseManageInfo(this.pageNo, this.pageSize)
        this.list = res.data.data
        this.total = res.data.totalCount
        this.listLoading = false
        // setTimeout(() => {
        //   this.listLoading = false
        // }, 1.5 * 1000)
      } catch (err) {
        console.log(err)
      }
    },
    // 通过课程名称搜索课程
    searchCourse() {
      getCourseInfo(this.courseNameKeyWord).then(response => {
        this.$message({
          type: 'sucess',
          message: '查询成功'
        })
        this.total = response.data.data.length
        this.list = response.data.data
        this.listLoading = false
      })
    },
    // 搜索班级防抖函数
    debounce: function(fn, wait) {
      if (this.fun !== null) {
        clearTimeout(this.fun)
      }
      this.fun = setTimeout(fn, wait)
    },
    // 根据输入的课程名称自动搜索并显示
    async keyWordChange() {
      try {
        const res = await getCourseInfo(this.courseNameKeyWord)
        this.list = res.data.data
        this.total = res.data.totalCount
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      } catch (err) {
        console.log(err)
      }
    },
    // 获取教师信息
    async getAllTeacherInfo() {
      try {
        const res = await getAllTeacherInfo()
        this.select.teacherInfo = res.data
      } catch (err) {
        console.log(err)
      }
    },
    // 删除课程
    async deleteCourse(index) {
      try {
        const res = await deleteCourse(this.tempData.courseId)
        if (res.code === 200) {
          this.$message({
            type: 'sucess',
            message: '删除成功'
          })
          if (this.courseNameKeyWord !== '' || this.courseNameKeyWord !== null) {
            this.keyWordChange()
          } else {
            this.list.splice(index, 1)
            this.getCourseManageInfo()
          }
        } else {
          this.$message({
            type: 'error',
            message: '删除失败'
          })
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 删除确认框确认后进行删除课程操作
    deleteCourseOperation(index, row) {
      this.tempData.courseId = row.courseId
      this.deleteCourse(index)
    },
    // 删除课程确认框
    deleteCourseConfirm(index, row) {
      this.$confirm('确定删除此班级?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(action => {
        if (action === 'confirm') {
          this.deleteCourseOperation(index, row)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 查看课程详情按钮
    checkCourseDetail(index, row) {
      this.tempData.courseId = row.courseId
      this.courseDetail = Object.assign({}, row)
      if (this.courseDetail.courseImgUrl !== '') {
        this.courseDetail.courseImgUrl = 'https://all.bnuz.edu.cn' + this.courseDetail.courseImgUrl
      }
      this.dialogFormVisible = true
    },
    // 关闭课程详情窗口
    closeCourseInfo() {
      this.dialogFormVisible = false
      this.$refs.uploadFile.clearFiles()
    },
    // 上传课程封面图片
    async uploadFile(param) {
      const file = param.file
      const tempId = this.tempData.courseId
      const formData = new FormData()
      formData.append('courseId', tempId)
      formData.append('courseImg', file)
      try {
        const res = await uploadCourseImg(formData)
        if (res.code === 200) {
          this.courseImageUrl = res.detail
        } else {
          this.$message({
            type: 'error',
            message: '图片上传失败'
          })
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 教师改动
    teacherChange() {
      this.isChange = true
    },
    // 判断课程费用是否为数字
    isValueNumber(val) {
      const value = val.replace('/(^\s*)|(\s*$)', '')
      const num = Number(value)
      if (isNaN(num)) {
        return false
      } else if (value === '' || value === null) {
        return false
      } else {
        return true
      }
    },
    // 修改课程信息
    async editCourseInfo() {
      await this.$refs.uploadFile.submit()
      const tempId = this.tempData.courseId
      const tempIndex = this.tempIndex
      const temp = Object.assign({}, this.courseDetail)
      if (this.isChange === true) {
        temp.teacherName = this.$refs.selectedTeacherName.selected.label
        temp.teacherId = this.$refs.selectedTeacherName.selected.value
        this.isChange = false
      }
      if (temp.courseName === '' || temp.courseName === null) {
        this.$message({
          type: 'error',
          message: '请输入课程名称'
        })
        return
      }
      if (temp.coursePrice === '' || temp.coursePrice === null) {
        this.$message({
          type: 'error',
          message: '请输入课程费用'
        })
        return
      }
      if (!(this.isValueNumber(temp.coursePrice))) {
        this.$message({
          type: 'error',
          message: '请确认课程费用是否输入正确'
        })
        return
      }
      temp.courseLabel = this.radioGroup[temp.courseType - 1]
      const formData = new FormData()
      formData.append('courseId', tempId)
      formData.append('courseName', temp.courseName)
      formData.append('courseImgUrl', this.courseImageUrl)
      formData.append('courseType', temp.courseType)
      formData.append('teacherId', temp.teacherId)
      formData.append('teacherName', temp.teacherName)
      formData.append('coursePrice', temp.coursePrice)
      formData.append('courseContent', temp.courseContent)
      formData.append('courseBasicIntroduction', temp.courseBasicIntroduction)
      formData.append('courseLabel', temp.courseLabel)
      formData.append('courseSpecificIntroduction', temp.courseSpecificIntroduction)
      try {
        const res = await editCourseInfo(formData)
        if (res.code === 200) {
          this.$message({
            type: 'sucess',
            message: '修改成功'
          })
          this.$refs.uploadFile.clearFiles()
          this.list.splice(tempIndex, 1)
          this.dialogFormVisible = false
          this.getCourseManageInfo()
        } else {
          this.$message({
            type: 'error',
            message: '修改失败'
          })
        }
      } catch (err) {
        console.log(err)
      }
    },
    async handleChange() {
      const isSubmit = await this.$confirm('确定删除此文件？', '提示', {
        confirButtonText: '确定',
        canelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return false
      }).catch(() => {
        return true
      })
      if (isSubmit) {
        this.$refs.uploadFile.clearFiles()
      }
    },
    handleExceed(files) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length} 个文件`)
    },
    // 查看图片
    enlargeImg(courseImgUrl) {
      this.showViewer = true
      this.enlargeImgUrl = courseImgUrl
    },
    // 关闭图片视窗
    closeViewer() {
      this.showViewer = false
      document.body.style.overflow = null
    }
  }
}
</script>

<style lang="scss" scoped>
  textarea {
    min-height: 100px !important;
  }
  .courseDetailPic {
    width: 100px;
    height: 100px;
    cursor: pointer;
  }
</style>
