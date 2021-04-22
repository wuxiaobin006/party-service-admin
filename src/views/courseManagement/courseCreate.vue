/*
* @Author: 卢贤睿
* @Date: 2020-07-12
* @Last Modified by: 卢贤睿
* @Last Modified time: 2021-02-25 15:50:45
*/
<template>
  <div class="courseCreate" style="margin-top: 18px">
    <el-form ref="form" :model="form" label-width="100px">
      <el-form
        :model="form"
        :inline="true"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="课程名称" prop="courseName">
          <el-col :span="24">
            <el-input v-model="form.courseName" autocomplete="off" />
          </el-col>
        </el-form-item>
        <el-form-item label="任课教师" prop="teacherName">
          <el-select ref="selectedTeacherName" v-model="form.teacherName" placeholder="请选择任课教师">
            <el-option
              v-for="(item,index) in select.teacherInfo"
              :key="index"
              :label="item.teacherName"
              :value="item.teacherId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="课程费用" prop="coursePrice">
          <el-col :span="24">
            <el-input v-model="form.coursePrice" placeholder="请输入数字" />
          </el-col>
        </el-form-item>
        <el-form-item label="课程标签" prop="courseLabel">
          <el-col :span="24">
            <el-input v-model="form.courseLabel" />
          </el-col>
        </el-form-item>
        <el-form-item label="课程类型" prop="courseType">
          <el-radio-group v-model="form.courseType">
            <el-radio label="1">书法</el-radio>
            <el-radio label="2">绘画</el-radio>
            <el-radio label="3">陶瓷</el-radio>
            <el-radio label="4">其它</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-form-item label="课程简介" prop="courseSpecificIntroduction">
        <el-input v-model="form.courseSpecificIntroduction" type="textarea" :rows="4" resize="none" />
      </el-form-item>
      <el-form-item label="课程介绍" prop="courseBasicIntroduction">
        <el-input v-model="form.courseBasicIntroduction" type="textarea" :rows="4" resize="none" />
      </el-form-item>
      <el-form-item label="课程内容" prop="courseContent">
        <el-input v-model="form.courseContent" type="textarea" :rows="4" resize="none" />
      </el-form-item>
      <el-form-item label="图片上传">
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
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过1Mb</div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="courseCreate()">立即创建</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  createCourse,
  getAllTeacherInfo,
  uploadCourseImg
} from '@/api/courseManage'

export default {
  name: 'CourseCreate',
  data() {
    return {
      radio: '',
      radioGroup: ['书法', '绘画', '瓷器', '其它'],
      courseImageUrl: '',
      form: {
        courseName: '',
        courseType: '',
        teacherId: '',
        teacherName: '',
        coursePrice: '',
        courseContent: '',
        courseBasicIntroduction: '',
        courseLabel: '',
        courseSpecificIntroduction: ''
      },
      nullValue: {
        courseName: '',
        courseType: '',
        teacherId: '',
        teacherName: '',
        coursePrice: '',
        courseContent: '',
        courseBasicIntroduction: '',
        courseLabel: '',
        courseSpecificIntroduction: ''
      },
      select: {
        teacherInfo: []
      },
      rules: {
        courseName: [{ required: true, message: '请填写课程名称', trigger: 'blur' }],
        coursePrice: [{ type: 'number', required: true, message: '请填写课程费用（请输入数字）', trigger: 'blur', transform: (value) => Number(value) }],
        teacherName: [{ required: true, message: '请选择教师', trigger: 'blur' }],
        courseType: [{ required: true, message: '请选择课程类型', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getAllTeacher()
  },
  methods: {
    // 获取任课教师
    async getAllTeacher() {
      try {
        const res = await getAllTeacherInfo()
        this.select.teacherInfo = res.data
      } catch (err) {
        console.log(err)
      }
    },
    // 上传课程封面图片
    async uploadFile(param) {
      const file = param.file
      const tempId = ''
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
    // 创建课程
    async courseCreate() {
      await this.$refs.uploadFile.submit()
      const temp = Object.assign({}, this.form)
      temp.teacherName = this.$refs.selectedTeacherName.selected.label
      temp.teacherId = this.$refs.selectedTeacherName.selected.value
      if (temp.courseName === '' || temp.courseName === null) {
        this.$message({
          type: 'error',
          message: '请输入课程名称'
        })
        return
      }
      if (temp.teacherName === '' || temp.teacherName === undefined) {
        this.$message({
          type: 'error',
          message: '请选择教师'
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
      if (temp.courseType === '' || temp.courseType === null) {
        this.$message({
          type: 'error',
          message: '请选择课程类型'
        })
        return
      }
      const formData = new FormData()
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
        const res = await createCourse(formData)
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '创建成功'
          })
          this.form = Object.assign({}, this.nullValue)
          this.$refs.uploadFile.clearFiles()
        } else {
          this.$message({
            type: 'error',
            message: '创建失败'
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
    }
  }
}
</script>
