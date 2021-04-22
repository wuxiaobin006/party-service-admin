<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

const animationDuration = 3000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    },
    courseNum: {
      type: Number,
      require: false,
      default: 0
    },
    orgAvgNum: {
      type: Number,
      require: false,
      default: 0
    },
    courseAvgNum: {
      type: Number,
      require: false,
      default: 0
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    courseNum(newVal, oldVal) {
      this.courseNum = newVal
      this.initChart()
    },
    orgAvgNum(newVal, oldVal) {
      this.orgAvgNum = newVal
      this.initChart()
    },
    courseAvgNum(newVal, oldVal) {
      this.courseAvgNum = newVal
      this.initChart()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: ['个人课程数', '组织课程平均数', '当前课程人均课程数'],
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: '积分',
          type: 'bar',
          stack: 'vistors',
          barWidth: '20%',
          data: [this.courseNum, this.orgAvgNum, this.courseAvgNum],
          animationDuration
        }]
      })
    }
  }
}
</script>
