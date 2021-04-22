<template>
  <div class="achievement">
    <el-image
      style="width: 70px; height: 50px"
      :src="url"
      fit="cover"
    >
      <div slot="error" class="image-slot">
        <i class="el-icon-picture-outline" />
      </div>
    </el-image>
    <span>{{ achieve }}</span>
  </div>
</template>

<script>

export default {
  props: {
    url: {
      type: String,
      default: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
    },
    achieve: {
      type: String,
      default: '成就名称'
    },
    courseNum: {
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
  mounted() {
  }
}
</script>
<style lang="scss" scoped>
.achievement{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100px;
    padding: 10px 10px 5px;
    box-shadow: 0px 0px 13px 1px rgba(32, 32, 32, 0.3);
    border-radius: 10%;
}
.achievement span{
    line-height: 18px;
    font-size: 16px;
    color: rgba(0,0,0,0.45);
}
</style>
