/*
* @Author:吴晓斌
* @Date:2020-06-04
 * @Last Modified by: 吴晓斌
 * @Last Modified time: 2020-10-13 15:10:20
*/
<template>
  <div class="app-container">
    <div class="tableStyle">
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        :header-cell-style="{background:'#eef1f6',color:'black'}"
      >
        <el-table-column label="反馈ID" prop="feedbackId" sortable align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.feedbackId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户名" prop="userName" sortable align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.userName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="机构名/学校名" prop="orgName" sortable align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.orgName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户类型" prop="userType" sortable align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.userType === 1 ? '学生' : '教师' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户反馈内容" prop="feedbackContent" sortable align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.feedbackContent }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建反馈时间" prop="createTime" sortable align="center" min-width="120px">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="反馈回复状态" prop="status" sortable align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.answerId === null ? 'gray' : 'success'">{{ scope.row.answerId === null ? '待回复' : '已回复' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="190px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-search" size="mini" @click="feedbackDetailBtn(scope.row)">查看</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="feedbackDeleteConfirm(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="pageNo"
        :limit.sync="pageSize"
        @pagination="getFeedbackList"
      />
    </div>
    <el-dialog :title="feedbackDetailTitle" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :model="feedbackDetail"
        label-position="left"
        size="mini"
      >
        <el-form-item label="反馈ID：" prop="feedbackId">
          {{ feedbackDetail.feedbackId }}
        </el-form-item>
        <el-form-item label="回复ID：" prop="answerId">
          {{ feedbackDetail.answerId }}
        </el-form-item>
        <el-form-item label="回复反馈的管理员ID：" prop="adminId">
          {{ feedbackDetail.adminId }}
        </el-form-item>
        <el-form-item label="机构名/学校名：" prop="orgName">
          {{ feedbackDetail.orgName }}
        </el-form-item>
        <el-form-item label="用户名：" prop="userName">
          {{ feedbackDetail.userName }}
        </el-form-item>
        <el-form-item label="用户类型：" prop="userType">
          {{ feedbackDetail.userType === 1 ? '学生' : '教师' }}
        </el-form-item>
        <el-form-item label="反馈内容：" prop="feedbackContent">
          {{ feedbackDetail.feedbackContent }}
        </el-form-item>
        <el-form-item label="附带图片：" prop="picUrl">
          <el-image v-if="feedbackDetail.picUrl !== ''" class="feedbackDetailPic" title="点击查看图片" :src="feedbackDetail.picUrl" @click="enlargeImage(feedbackDetail.picUrl)" />
          <span v-else>无</span>
        </el-form-item>
        <el-form-item label="创建反馈时间：" prop="feedbackTime">
          {{ feedbackDetail.feedbackTime }}
        </el-form-item>
        <el-form-item label="回复反馈的管理员名称：" prop="adminName">
          {{ feedbackDetail.adminName }}
        </el-form-item>
        <el-form-item label="回复内容：" prop="answerContent">
          <el-input id="textarea" v-model="feedbackDetail.answerContent" type="textarea" />
        </el-form-item>
        <el-form-item label="回复时间：" prop="answerTime">
          {{ feedbackDetail.answerTime }}
        </el-form-item>
        <el-form-item label="用户是否可以删除回复：" prop="deletable">
          {{ feedbackDetail.deletable === false ? '不可删除' : '可删除' }}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button icon="el-icon-close" type="danger" @click="answerDeleteConfirm(feedbackDetail)">
          删除回复
        </el-button>
        <el-button icon="el-icon-check" type="primary" @click="answerSubmit(feedbackDetail)">
          提交回复
        </el-button>
      </div>
    </el-dialog>
    <el-image-viewer v-if="showViewer" class="imageViewer" :on-close="closeViewer" :url-list="[enlargeImageUrl]" :z-index="9999" />
  </div>
</template>

<script>
import { getFeedbackList, getFeedbackDetail, answerFeedback, deleteFeedback, deleteFeedbackAnswer } from '@/api/feedBack'
import Pagination from '@/components/Pagination'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'

export default {
  components: { Pagination, ElImageViewer },
  data() {
    return {
      list: null,
      listLoading: true,
      feedbackDetailTitle: '反馈详情',
      total: 0,
      pageNo: 1,
      pageSize: 20,
      tempData: {
        feedbackId: '',
        userType: '',
        answerContent: '',
        answerId: ''
      },
      feedbackDetail: {},
      enlargeImageUrl: '',
      dialogFormVisible: false,
      showViewer: false
    }
  },
  created() {
    this.getFeedbackList()
  },
  methods: {
    async getFeedbackList() {
      this.listLoading = true
      try {
        const res = await getFeedbackList(this.pageNo, this.pageSize)
        this.list = res.data.data
        this.total = res.data.totalCount
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      } catch (err) {
        console.log(err)
      }
    },
    async getFeedbackDetail() {
      try {
        const res = await getFeedbackDetail(this.tempData.feedbackId, this.tempData.userType)
        this.feedbackDetail = res.data
        if (this.feedbackDetail.picUrl !== '') {
          this.feedbackDetail.picUrl = 'https://all.bnuz.edu.cn' + this.feedbackDetail.picUrl
        }
      } catch (err) {
        console.log(err)
      }
    },
    async answerFeedback() {
      try {
        const res = await answerFeedback(this.tempData.feedbackId, this.tempData.answerContent)
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '回复成功!'
          })
          this.getFeedbackList()
        } else {
          this.$message({
            type: 'error',
            message: '回复失败。'
          })
        }
      } catch (err) {
        console.log(err)
      }
    },
    async deleteFeedback(index) {
      try {
        const res = await deleteFeedback(this.tempData.feedbackId)
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.list.splice(index, 1)
          this.getFeedbackList()
        } else {
          this.$message({
            type: 'error',
            message: '删除失败。'
          })
        }
      } catch (err) {
        console.log(err)
      }
    },
    async deleteFeedbackAnswer() {
      try {
        const res = await deleteFeedbackAnswer(this.tempData.answerId)
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getFeedbackList()
        } else {
          this.$message({
            type: 'error',
            message: '删除失败。'
          })
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 查看反馈信息详细内容
    feedbackDetailBtn(row) {
      this.dialogFormVisible = true
      this.tempData.feedbackId = row.feedbackId
      this.tempData.userType = row.userType
      this.getFeedbackDetail()
    },
    // 删除回复操作
    answerDelete(feedbackDetail) {
      this.tempData.answerId = feedbackDetail.answerId
      this.deleteFeedbackAnswer()
      this.dialogFormVisible = false
    },
    // 删除回复确认框
    answerDeleteConfirm(feedbackDetail) {
      this.$confirm('确认删除回复?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(action => {
        if (action === 'confirm' && !(feedbackDetail.answerId === null)) {
          this.answerDelete(feedbackDetail)
        } else if (action === 'confirm' && feedbackDetail.answerId === null) {
          this.$message({
            type: 'warning',
            message: '回复内容为空，无法删除'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 提交回复操作
    answerSubmit(feedbackDetail) {
      if (feedbackDetail.answerContent === null | feedbackDetail.answerContent === '') {
        this.$message({
          type: 'warning',
          message: '回复内容为空，请填写'
        })
      } else {
        this.tempData.feedbackId = feedbackDetail.feedbackId
        this.tempData.answerContent = feedbackDetail.answerContent
        this.answerFeedback()
        this.dialogFormVisible = false
      }
    },
    // 删除反馈操作(同时删除对应回复)
    feedbackDelete(index, row) {
      this.tempData.feedbackId = row.feedbackId
      this.deleteFeedback(index)
    },
    // 删除反馈确认框
    feedbackDeleteConfirm(index, row) {
      this.$confirm('确认删除反馈?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(action => {
        if (action === 'confirm') {
          this.feedbackDelete(index, row)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 查看反馈详情附带图片(打开图片查看器)
    enlargeImage(picUrl) {
      this.showViewer = true
      this.enlargeImageUrl = picUrl
    },
    // 关闭图片查看器image-viewer
    closeViewer() {
      this.showViewer = false
      document.body.style.overflow = null
    }
  }
}
</script>

<style lang="scss" scoped>
  .tableStyle {
    width: 100%;
    border: 1px solid #DCDFE6;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  }
  /deep/ .el-dialog {
    width: 40%;

    .el-form {
      height: 300px;
      overflow: auto;
      margin-left: 30px;
    }
  }
  .feedbackDetailPic {
    width: 100px;
    height: 100px;
    cursor: pointer;
  }
</style>
