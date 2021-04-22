<template>
  <div class="dashboard-editor-container">

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="24">
        <panel-group
          v-if="totalOrderNum&&successOrderNum&&totalEarnings&&totalPeopleNum"
          :total-order-num="totalOrderNum"
          :success-order-num="successOrderNum"
          :total-earnings="totalEarnings"
          :total-people-num="totalPeopleNum"
          @handleSetLineChartData="handleSetLineChartData"
        />
      </el-col>
    </el-row>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart v-if="lineChartData" :chart-data="lineChartData" />
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <pie-chart
            v-if="peopleDistribution.maleStudentNum"
            :male-people-distribution="peopleDistribution.maleStudentNum"
            :female-people-distribution="peopleDistribution.femaleStudentNum"
            :distribution-name="['男学员', '女学员']"
          />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <pie-chart
            v-if="peopleDistribution.maleTeacherNum"
            :male-people-distribution="peopleDistribution.maleTeacherNum"
            :female-people-distribution="peopleDistribution.femaleTeacherNum"
            :distribution-name="['男教师', '女教师']"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import PieChart from './components/PieChart'
import { getEarningsStatistics, getMemberStatistics, getOrderStatistics } from '@/api/dashboard.js'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    PieChart
  },
  data() {
    return {
      totalOrderNum: undefined,
      successOrderNum: undefined,
      totalEarnings: undefined,
      totalPeopleNum: undefined,
      peopleDistribution: {
        maleStudentNum: undefined,
        femaleStudentNum: undefined,
        maleTeacherNum: undefined,
        femaleTeacherNum: undefined
      },
      lineAllData: {
        earnings: { actualData: [], name: '收益量' },
        order: { actualData: [], name: '订单量' }
      },
      lineChartData: undefined
    }
  },
  mounted() {
    this.getEarnings()
    this.getMember()
    this.getOrder()
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = this.lineAllData[type]
    },
    /**
     * 收益统计
     */
    getEarnings() {
      getEarningsStatistics().then(response => {
        this.totalEarnings = response.data.totalEarnings
        this.lineAllData.earnings.actualData = [response.data.sixDayBeforeEarnings,
          response.data.fiveDayBeforeEarnings,
          response.data.fourDayBeforeEarnings,
          response.data.threeDayBeforeEarnings,
          response.data.twoDayBeforeEarnings,
          response.data.oneDayBeforeEarnings,
          response.data.todayEarnings]
      })
    },
    /**
     * 人员/订单统计
     */
    getMember() {
      getMemberStatistics().then(response => {
        this.totalOrderNum = response.data.totalOrderNum
        this.successOrderNum = response.data.successOrderNum
        this.peopleDistribution.maleStudentNum = response.data.maleStudentNum
        this.peopleDistribution.femaleStudentNum = response.data.femaleStudentNum
        this.peopleDistribution.maleTeacherNum = response.data.maleTeacherNum
        this.peopleDistribution.femaleTeacherNum = response.data.femaleTeacherNum
        this.totalPeopleNum = response.data.maleStudentNum + response.data.femaleStudentNum + response.data.maleTeacherNum + response.data.femaleTeacherNum
      })
    },
    /**
     * 订单统计
     */
    getOrder() {
      getOrderStatistics().then(response => {
        this.lineAllData.order.actualData = [response.data.sixBeforeNum,
          response.data.fiveBeforeNum,
          response.data.fourBeforeNum,
          response.data.threeBeforeNum,
          response.data.twoBeforeNum,
          response.data.oneBeforeNum,
          response.data.todayOrderNum]
        this.lineChartData = this.lineAllData.order
      })
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
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
