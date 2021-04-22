/*
* @Author: 范开杰
* @Date: 2020-10-22
* @Last Modified by: 范开杰
* @Last Modified time: 2020-12-01 10:52:01
*/
//健康管理-文章信息页面
<template>
  <div class="articleInformation">
    <div class="articleInformation_header"><!-- 文章信息头部 -->
      <el-row>
        <el-col :span="4">
          <el-select v-model="sendData.tagId" placeholder="请选择标签" @change="listQuery.page = 1"><!-- 搜索养生课堂标签 -->
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
    </div>

    <div class="articleInformation--table"><!-- 课程信息表格 -->
      <el-table
        v-loading="loading"
        :data="list"
        :default-sort="{prop: 'id', order: 'ascending'}"
        style="width: 100%"
      >
        <el-table-column
          label="文章号"
          prop="id"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="文章名称"
          prop="title"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="作者姓名"
          prop="creatorName"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="创建时间"
          prop="createTime"
          min-width="100px"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="浏览数"
          prop="countView"
          show-overflow-tooltip
          sortable
        />
        <el-table-column
          label="文章评论"
          prop="comment"
          align="center"
          min-width="75px"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-user-solid"
              size="mini"
              @click="openDialog(scope.row);"
            >
              评论
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="其它"
          prop="comment"
          align="center"
          min-width="100px"
        >
          <template slot-scope="{row}"> <!--上传封面-->
            <el-button type="primary" icon="el-icon-folder-checked" size="mini" @click="getArticleId(row);centerDialogVisible = true">修改封面</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          prop="operation"
          align="center"
          min-width="150px"
        >
          <template slot-scope="{row,$index}">
            <el-button type="success" icon="el-icon-folder-checked" size="mini" @click="enableComment(row,$index)">开放</el-button>
            <el-button type="warning" icon="el-icon-folder-delete" size="mini" @click="disableComment(row,$index)">禁用</el-button>
            <el-popconfirm
              title="确定删除该文章吗？"
              icon="el-icon-info"
              icon-color="red"
              @onConfirm="handleDelete(row,$index)"
            >
              <el-button slot="reference" class="articleInformation--deleteButton" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
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
        title="文章评论"
        :visible.sync="dialogTableVisible"
        width="50%"
        @opened="addListeners();handleScroll()"
        @closed="removeListeners"
      >
        <el-table
          ref="commentTable"
          v-loading="dialogLoading"
          :data="virtualRows"
          class="virtual-table"
          height="440px"
          :max-height="440"
        >
          <el-table-column prop="id" label="编号" show-overflow-tooltip />
          <el-table-column prop="content" label="评论内容" show-overflow-tooltip />
          <el-table-column prop="createTime" label="评论时间" show-overflow-tooltip />
          <el-table-column prop="owner" label="用户" show-overflow-tooltip />
          <el-table-column
            label="操作"
            prop="operation"
            align="center"
            min-width="50px"
          >
            <template slot-scope="{row,$index}">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="commentDelete(row,$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>

      <el-dialog
        custom-class="dialog"
        title="修改封面"
        :visible.sync="centerDialogVisible"
        width="20%"
        center
      >
        <div class="el-upload__tip">
          <el-upload
            ref="upload"
            action="string"
            accept="image/jpeg,image/png,image/jpg"
            list-type="picture-card"
            :before-upload="onBeforeUploadImage"
            :http-request="UploadImage"
            :on-change="fileChange"
            :on-remove="removeImage"
            :file-list="fileList"
            :auto-upload="false"
            :class="{hide:hideUpload}"
            :limit="1"
          >
            <el-button size="small" type="primary">选择文件</el-button>
          </el-upload>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="centerDialogVisible = false">取 消</el-button>
          <el-button size="small" type="success" @click="submitUpload();centerDialogVisible = false">点击修改</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  gethealthLabelList,
  getarticleInformationList,
  getcommentList,
  deleteArticleMessage,
  deleteCommentMessage,
  enableCommentMessage,
  disableCommentMessage,
  alterCover
} from '@/api/healthyManage/articleInformation'
import Pagination from '@/components/Pagination'
export default {
  name: 'ArticleInformation',
  components: { Pagination },
  data() {
    return {
      options: [], // 选项列表
      list: [], // 表格数据
      commentList: [], // 文章评论表格数据
      virtualRows: [], // 虚拟列表
      listQuery: { // 分页数据
        page: 1,
        limit: 10
      },
      sendData: { // 获取数据所需参数
        tagId: undefined,
        start: 0,
        count: 10
      },
      searchCommentList: { // 获取文章评论所需参数
        articleId: undefined,
        start: 0,
        count: 10
      },
      deleteArticle: { // 删除文章所需参数
        id: undefined
      },
      deleteComment: { // 删除评论所需参数
        id: undefined
      },
      enableCommentId: { // 开放文章所需参数
        id: undefined
      },
      disableCommentId: { // 禁用文章所需参数
        id: undefined
      },
      total: 0, // 取得文章数
      loading: true, // 表格加载状态
      dialogTableVisible: false, // 评论对话框显示状态
      dialogLoading: true, // 评论对话框表格加载状态
      isDialogOpen: false, // 判断对话框是否打开
      centerDialogVisible: false, // 修改封面对话框显示状态
      fileList: [], // 上传文件列表
      hideUpload: false, // 是否隐藏上传按钮
      limitCount: 1, // 上传文件最大数量
      articleId: undefined // 当前行文章号
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
     * 返回标签id
     */
    newtagId() {
      return this.sendData.tagId
    }
  },
  watch: {
    /**
     * 监视分页的当前页数并设置起始索引
     * @param {Number} val 当前页数
     */
    newPage(val) {
      this.sendData.start = (val - 1) * this.listQuery.limit
      this.sendData.count = val * this.listQuery.limit
    },

    /**
     * 监视每页显示数量并设置起始索引
     * @param {Number} val 当前页数
     */
    newLimit(val) {
      this.sendData.start = (this.listQuery.page - 1) * val
      this.sendData.count = this.listQuery.page * val
    },

    /**
     * 监视标签选项更新列表
     * @param {Number} val 当前标签号
     */
    newtagId(val) {
      this.getList()
    },

    /**
     * 监视评论列表数据
     */
    commentList: function() {
      var that = this
      that.$nextTick(function() {
        if (that.isDialogOpen) {
          this.dialogTableVisible = true
        }
      })
    }
  },
  mounted() {
    this.getOptions()
  },
  methods: {
    /**
     * 获取课程统计数据
     */
    getList() {
      getarticleInformationList(this.listQuery.page, this.listQuery.limit, this.sendData.tagId).then(response => {
        this.list = response.data.data
        gethealthLabelList().then(response => {
          response.data.forEach((val) => {
            if (val.id === this.sendData.tagId) {
              this.total = val.countArticle
            }
          })
        })
        this.loading = false
      })
    },
    /**
     * 获取选项列表
     */
    getOptions() {
      gethealthLabelList().then(response => {
        this.sendData.tagId = response.data[0].id
        this.options = response.data.map((item) => {
          return {
            value: item['id'],
            label: item['name']
          }
        })
        this.getList()
      })
    },

    /**
     * 打开评论列表弹窗
     * @param {Object} row 当前行
     */
    openDialog(row) {
      this.getCommentList(row)
    },

    /**
     * 开放文章
     * @param {Object} row 当前行
     */
    enableComment(row) {
      this.enableCommentId.id = row.id
      console.log(this.enableCommentId.id)
      enableCommentMessage(this.enableCommentId).then(response => {
        this.$notify({
          title: '成功',
          message: '文章"' + row.title + '"已开放',
          type: 'success',
          duration: 2000
        })
      })
    },

    /**
     * 禁用文章
     * @param {Object} row 当前行
     */
    disableComment(row) {
      this.disableCommentId.id = row.id
      console.log(this.disableCommentId.id)
      disableCommentMessage(this.disableCommentId).then(response => {
        this.$notify({
          title: '成功',
          message: '文章"' + row.title + '"已禁用',
          type: 'success',
          duration: 2000
        })
      })
    },

    /**
     * 删除文章
     * @param {Object} row 当前行
     */
    handleDelete(row) {
      this.deleteArticle.id = row.id
      deleteArticleMessage(this.deleteArticle).then(response => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        const index = this.list.findIndex(v => v.id === row.id)
        this.list.splice(index, 1)
        this.total--
      })
    },

    /**
     * 获取评论列表
     * @param {Object} val 当前行
     */
    getCommentList(val) {
      this.searchCommentList.articleId = val.id
      getcommentList(this.searchCommentList).then(response => {
        this.commentList = response.data
        this.$nextTick(function() {
          this.dialogLoading = false
          this.isDialogOpen = true
        })
      })
    },

    /**
     * 删除评论
     * @param {Object} row 当前行
     */
    commentDelete(row) {
      this.deleteComment.id = row.id
      deleteCommentMessage(this.deleteComment).then(response => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        const index = this.commentList.findIndex(v => v.id === row.id)
        this.commentList.splice(index, 1)
      })
    },
    /**
     * 对评论列表table增加监听事件
     */
    addListeners() {
      this.$nextTick(() => {
        if (!this.$refs.commentTable.bodyWrapper) {
          return
        }
        this.$refs.commentTable.bodyWrapper.addEventListener('scroll', this.debounce(() => {
          this.handleScroll()
        }, 0))
      })
    },
    /**
     * 对评论列表table移除监听事件
     */
    removeListeners() {
      if (!this.$refs.commentTable.bodyWrapper) {
        return
      }
      this.$refs.commentTable.bodyWrapper.removeEventListener('scroll', this.handleScroll())
      this.dialogLoading = true
      this.isDialogOpen = false
      this.commentList = []
    },
    /**
     * 处理评论列表滚动事件
     */
    handleScroll() {
      setTimeout(() => {
        this.updateVisibleItems()
      }, 10)
    },
    /**
     * 获取当前评论列表滚动条位置
     * @returns {Object} 滚动条当前起始点与终点
     */
    getScroll() {
      if (!this.$refs.commentTable.bodyWrapper) {
        return {
          start: 0,
          end: 400
        }
      }
      const dom = this.$refs.commentTable.bodyWrapper
      const scrollState = {
        start: dom.scrollTop,
        end: dom.scrollTop + dom.clientHeight
      }
      return scrollState
    },
    /**
     * 更新评论列表可视区域的数据
     */
    updateVisibleItems() {
      const itemSize = 46 // td高度
      const count = this.commentList.length // table总条数
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
      this.virtualRows = this.commentList.slice(startIndex, startIndex + bufferCount)

      // 设置el-table上的虚拟列表，采用了padding的方案，原因是transform 会使el-table的样式混乱
      const mainTable = this.$refs.commentTable.$el.getElementsByClassName('el-table__body')
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
    },
    /**
     * 取得当前文章id并重置上传文件弹窗
     * @param {Object} row 当前行
     */
    getArticleId(row) {
      this.articleId = row.id
      this.logo = ''
      this.fileList = []
      this.hideUpload = false
    },
    /**
     * 上传图片前验证
     * @param {Object} file 图片文件
     * @returns {Boolean}
     */
    onBeforeUploadImage(file) {
      const isIMAGE = file.type === 'image/jpeg' || 'image/jpg' || 'image/png'
      const isLt1M = file.size / 1024 / 1024 < 2
      if (!isIMAGE) {
        this.$message.error('上传文件只能是图片格式!')
      }
      if (!isLt1M) {
        this.$message.error('上传文件大小不能超过 2MB!')
      }
      return isIMAGE && isLt1M
    },
    /**
     * 上传图片
     * @param {Object} param 图片文件
     */
    UploadImage(param) {
      const formData = new FormData()
      formData.append('file', param.file)
      alterCover(this.articleId, formData).then(response => {
        param.onSuccess() // 上传成功的图片会显示绿色的对勾
        this.$notify({
          title: '成功',
          message: '封面图片上传成功',
          type: 'success',
          duration: 2000
        })
      }).catch(response => {
        this.$notify.error({
          title: '失败',
          message: '封面图片上传失败',
          duration: 2000
        })
        param.onError()
      })
    },
    /**
     * 删除当前上传封面图片时触发显示上传按钮
     * @param {Object} param 图片文件
     * @param {Array} fileList 图片存放数组
     */
    removeImage(param, fileList) {
      this.hideUpload = fileList.length >= this.limitCount
    },
    /**
     * 封面图片修改时检验是否显示上传按钮
     * @param {Object} param 图片文件
     * @param {Array} fileList 图片存放数组
     */
    fileChange(file, fileList) {
      this.hideUpload = fileList.length >= this.limitCount
    },
    // 确认上传
    submitUpload() {
      this.$refs.upload.submit()
    }
  }
}
</script>

<style lang="scss" scoped>
  .articleInformation {
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
    &--deleteButton{
      margin-left: 10px;
    }
  }
  .el-upload__tip {
    text-align: center;
  }
  .hide >>> .el-upload--picture-card {
    display: none !important;
  }
  /deep/ .el-upload-list__item {
    transition: none !important;
  }
  /deep/ .dialog{
    border-radius: 10px;
  }
</style>
