<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

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
    loginScore: {
      type: Number,
      require: false,
      default: 0
    },
    videoScore: {
      type: Number,
      require: false,
      default: 0
    },
    articleScore: {
      type: Number,
      require: false,
      default: 0
    },
    distributionName: {
      type: Array,
      require: false,
      default: function() {
        return ['登录积分', '视频积分', '文章积分']
      }
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    loginScore(newVal, oldVal) {
      this.loginScore = newVal
      this.initChart()
    },
    videoScore(newVal, oldVal) {
      this.videoScore = newVal
      this.initChart()
    },
    articleScore(newVal, oldVal) {
      this.articleScore = newVal
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
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: this.distributionName
        },
        series: [
          {
            name: '',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 65],
            center: ['50%', '45%'],
            data: [
              { value: this.loginScore, name: this.distributionName[0] },
              { value: this.videoScore, name: this.distributionName[1] },
              { value: this.articleScore, name: this.distributionName[2] }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
