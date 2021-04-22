/*
* @Author: 范开杰
* @Date: 2020-12-29
* @Last Modified by: 范开杰
* @Last Modified time: 2021-02-24 10:52:01
*/
<template>
  <div class="dashboard-editor-container">
    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="24">
        <el-select v-model="sendData.value2" filterable style="margin-right: 20px" placeholder="请选择" @change="changeStudentList()">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <el-select v-model="sendData.value" filterable placeholder="请选择" @change="getStatistics()">
          <el-option
            v-for="item in options2"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-col>
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="24">
        <panel-group
          :course-num="courseNum"
          :home-work-count="homeWorkCount"
          :total-score="totalScore"
          :course-remark="courseRemark"
        />
      </el-col>
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <pie-chart
            :login-score="loginScore"
            :video-score="videoScore"
            :article-score="articleScore"
            :distribution-name="['登录积分', '视频积分', '文章积分']"
          />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <bar-chart
            :course-num="courseNum"
            :course-avg-num="courseAvgNum"
            :org-avg-num="orgAvgNum"
          />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="24">
        <el-tabs type="border-card">
          <el-tab-pane>
            <span slot="label"><i class="el-icon-s-custom" />成就展示</span>
            <div v-for="(item, i) in achievements" :key="i" class="achieve">
              <achievement :url="item.url" :achieve="item.achieve" />
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import achievement from '@/components/StudyReport/achievement'
import { getElderStatistics } from '@/api/studyReport'
import { getClassStatisticsList, getStudentList } from '@/api/CourseStatistics'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    PieChart,
    BarChart,
    achievement
  },
  data() {
    return {
      options: [{ value: 123, label: '如何学好书法' }, { value: 2, label: '测试2' }], // 课程选项
      options2: [{ value: '046a2a0d-de63-4c87-b82c-0be70f4d3a3a', label: 'hhhh' }, { value: 2, label: '测试2' }], // 学生选项
      sendData: {
        value: '046a2a0d-de63-4c87-b82c-0be70f4d3a3a', // 学生id
        value2: 123 // 课程id
      },
      courseNum: undefined, // 课程总数量
      homeWorkCount: undefined, // 作业总数量
      totalScore: undefined, // 总积分
      loginScore: undefined, // 登录积分
      videoScore: undefined, // 视频积分
      articleScore: undefined, // 文章积分
      courseAvgNum: undefined, // 当前课程人均课程数
      orgAvgNum: undefined, // 组织课程平均数
      courseSum: undefined, // 个人课程数
      courseRemark: undefined, // 课程评论数
      orgRemark: undefined, // 组织评论数

      achievements: []
    }
  },
  mounted() {
    this.getStatistics()
    this.getCourseList()
    this.changeStudentList()
  },
  methods: {
    /**
     * 获取数据
     */
    getStatistics() {
      getElderStatistics(this.sendData.value, this.sendData.value2).then(response => {
        const url_ = '/ComprehensiveSys'
        this.courseNum = response.data.courseNum // 课程总数量
        this.homeWorkCount = response.data.homeWorkCount // 作业总数量
        this.totalScore = response.data.totalScore // 总积分
        this.loginScore = response.data.loginScore // 登录积分
        this.videoScore = response.data.videoScore // 视频积分
        this.articleScore = response.data.articleScore // 文章积分
        this.courseAvgNum = response.data.courseAvgNum // 当前课程人均课程数
        this.orgAvgNum = response.data.orgAvgNum // 组织课程平均数
        this.courseSum = response.data.courseSum // 个人课程数
        this.courseRemark = response.data.courseRemark // 课程评论数
        this.orgRemark = response.data.orgRemark // 组织评论数
        this.achievements = response.data.elderStudentPayDto.map((item) => {
          let courseImg = ''
          if (!item['courseImgUrl'].search(url_) || item['courseImgUrl'] === '') {
            courseImg = item['courseImgUrl']
          } else {
            courseImg = url_ + item['courseImgUrl']
          }
          return {
            url: courseImg,
            achieve: item['courseName']
          }
        })
      },
      this.resetStatistics()
      )
    },
    /**
     * 获取课程列表
     */
    getCourseList() {
      getClassStatisticsList({ pageSize: 1000 }).then(response => {
        this.options = response.data.data.map((item) => {
          return {
            value: item['courseId'],
            label: item['courseName']
          }
        })
      })
    },
    /**
     * 选项学生列表
     */
    changeStudentList() {
      getStudentList({ courseId: this.sendData.value2 }).then(response => {
        this.options2 = response.data.map((item) => {
          return {
            value: item['id'],
            label: item['name']
          }
        })
        if (this.options2[0] != null) {
          this.sendData.value = response.data[0].id
          this.getStatistics()
        } else {
          this.sendData.value = ''
        }
      })
      console.log(this.sendData)
    },
    /**
     * 重置数据
     */
    resetStatistics() {
      this.courseNum = 0 // 课程总数量
      this.homeWorkCount = 0 // 作业总数量
      this.totalScore = 0 // 总积分
      this.loginScore = 0 // 登录积分
      this.videoScore = 0 // 视频积分
      this.articleScore = 0 // 文章积分
      this.courseAvgNum = 0 // 当前课程人均课程数
      this.orgAvgNum = 0 // 组织课程平均数
      this.courseSum = 0 // 个人课程数
      this.courseRemark = 0 // 课程评论数
      this.orgRemark = 0 // 组织评论数
      this.achievements = []
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    margin-top: 16px;
    padding: 0px 16px 0;
    margin-bottom: 32px;
  }

  .rate{
    height: 300px;
    color: #666;
    font-size: 18px;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }

  .rate-row{
    padding-top: 20px;
  }

  .achieve {
    float: left;
    margin: 20px;
  }
}
@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
