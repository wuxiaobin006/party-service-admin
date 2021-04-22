/*
* @Author:吴晓斌
* @Date:2020-07-20
 * @Last Modified by: 庞泽邦
 * @Last Modified time: 2020-11-10 13:46:16
*/
<template>
  <div class="app-container">
    <div class="func-container">
      <div class="add">
        <el-button class="addBtn" type="primary" icon="el-icon-plus" @click="uploadResourceForm">
          新增
        </el-button>
      </div>
      <div class="search">
        <el-input
          v-model="searchFileName"
          placeholder="请输入文件名称"
          class="search-input"
          prefix-icon="el-icon-search"
          clearable
          @change="searchByFileName"
          @keyup.enter.native="searchByFileName"
        />
        <el-input
          v-model="searchCourseId"
          placeholder="请输入课程Id"
          class="search-input"
          prefix-icon="el-icon-search"
          clearable
          @change="searchByCourseId"
          @keyup.enter.native="searchByCourseId"
        />
        <!-- <el-button class="search-button" type="primary" icon="el-icon-search" :disabled="searchBtnState==false" @click="searchBtnClick">
          搜索
        </el-button> -->
      </div>
    </div>
    <div class="tableStyle">
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        :header-cell-style="{background:'#eef1f6',color:'black'}"
      >
        <el-table-column label="文件名称" prop="originalFileName" sortable align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.originalFileName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上传者" prop="author" sortable align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.author }}</span>
          </template>
        </el-table-column>
        <el-table-column label="课程Id" prop="courseId" sortable align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.courseId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="课时" prop="seq" sortable align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.seq }}</span>
          </template>
        </el-table-column>
        <el-table-column label="文件类型" prop="isShare" sortable align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.isShare === 1? '共享文件' : '私有文件' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上传时间" prop="transportTime" sortable align="center" min-width="120px">
          <template slot-scope="scope">
            <span>{{ scope.row.transportTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="下载次数" prop="downloadTimes" sortable align="center" min-width="120px">
          <template slot-scope="scope">
            <span>{{ scope.row.downloadTimes }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="190px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-download" size="mini" @click="downloadHandle(scope.row)">
              下载
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="resourceDeleteConfirm(scope.$index, scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="pageNo"
        :limit.sync="pageSize"
        @pagination="getResourceList"
      />
    </div>

    <el-dialog :title="create" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="uploadData"
        label-position="left"
        label-width="100px"
        enctype="multipart/form-data"
      >
        <el-form-item label="课程Id" prop="courseId">
          <el-input v-model="uploadData.courseId" clearable />
        </el-form-item>
        <el-form-item label="课时" prop="seq">
          <el-input v-model="uploadData.seq" clearable />
        </el-form-item>
        <el-form-item label="文件上传">
          <input id="file" ref="file" type="file" accept="*/*">
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button icon="el-icon-check" type="primary" @click="uploadResourceHandle">
          添加
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getResourceList, getResourceByName, getResourceByCourseId, deleteResourceById, upload, increaseDownTimes } from '@/api/resourceManagement'
import Pagination from '@/components/Pagination'
import { download } from '@/utils/downloadFile'

export default {
  components: { Pagination },
  data() {
    return {
      list: null,
      listLoading: true,
      create: '新增',
      total: 0,
      pageNo: 1,
      pageSize: 20,
      searchFileName: '',
      searchCourseId: '',
      tempData: {
        resourceId: '',
        resourceName: '',
        nowFileName: '',
        resourceURL: ''
      },
      uploadData: {
        courseId: '',
        seq: ''
      },
      rules: {
        courseId: [{ required: true, message: '请填写课程Id', trigger: 'blur' }],
        seq: [{ required: true, message: '请填写课时', trigger: 'change' }],
        file: [{ required: true, message: '请上传文件', trigger: 'change' }]
      },
      dialogFormVisible: false
    }
  },
  created() {
    this.getResourceList()
  },
  methods: {
    async getResourceList() {
      this.listLoading = true
      try {
        const res = await getResourceList(this.pageNo, this.pageSize)
        this.list = res.data.data
        this.total = res.data.totalCount
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      } catch (err) {
        console.log(err)
      }
    },
    async getResourceByName() {
      this.listLoading = true
      try {
        const res = await getResourceByName(this.tempData.resourceName, this.pageNo, this.pageSize)
        this.list = res.data.data
        this.total = res.data.totalCount
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      } catch (err) {
        console.log(err)
      }
    },
    async getResourceByCourseId() {
      this.listLoading = true
      try {
        const res = await getResourceByCourseId(this.tempData.courseId, this.pageNo, this.pageSize)
        this.list = res.data.data
        this.total = res.data.totalCount
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      } catch (err) {
        console.log(err)
      }
    },
    async deleteResourceById(index) {
      try {
        const res = await deleteResourceById(this.tempData.resourceId)
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.list.splice(index, 1)
          this.getResourceList()
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
    async upload(formData) {
      try {
        const res = await upload(formData)
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '上传成功!'
          })
          this.getResourceList()
        } else {
          this.$message({
            type: 'error',
            message: '上传失败。'
          })
        }
      } catch (err) {
        console.log(err)
      }
    },
    async increaseDownTimes(row) {
      try {
        this.tempData.resourceId = row.resourceId
        const res = await increaseDownTimes(this.tempData.resourceId)
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '下载成功！'
          })
          this.getResourceList()
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 上传资源填写
    uploadResourceForm() {
      this.dialogFormVisible = true
      // init
      document.getElementById('file').value = ''
      this.uploadData = {
        courseId: '',
        seq: ''
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 上传资源操作
    uploadResourceHandle() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid && document.getElementById('file').value !== '') {
          const formData = new FormData()
          formData.append('file', this.$refs.file.files[0])
          formData.append('courseId', this.uploadData.courseId)
          formData.append('seq', this.uploadData.seq)
          this.upload(formData)
          this.dialogFormVisible = false
        } else {
          this.$notify({
            title: '通知',
            message: '上传失败，请完成填写',
            type: 'info',
            duration: 2000
          })
        }
      })
    },
    // 通过文件名称搜索资源
    searchByFileName() {
      this.tempData.resourceName = this.searchFileName
      this.getResourceByName()
    },
    // 通过课程Id搜索资源
    searchByCourseId() {
      if (this.searchCourseId === '') {
        this.getResourceList()
      } else {
        this.tempData.courseId = this.searchCourseId
        this.getResourceByCourseId()
      }
    },
    // 下载操作
    downloadHandle(row) {
      this.$confirm('是否确定下载?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(action => {
        if (action === 'confirm') {
          try {
            download(row.resourceUrl, row.originalFileName, true)
            this.increaseDownTimes(row)
          } catch (error) {
            console.log(error)
            this.$message({
              type: 'error',
              message: '下载失败。'
            })
          }
        }
      }).catch((err) => {
        console.log(err)
        this.$message({
          type: 'info',
          message: '已取消下载。'
        })
      })
    },
    // 通过资源Id删除资源
    resourceDeleteHandle(index, row) {
      this.tempData.resourceId = row.resourceId
      this.deleteResourceById(index)
    },
    // 删除资源确认框
    resourceDeleteConfirm(index, row) {
      this.$confirm('确认删除资源?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(action => {
        if (action === 'confirm') {
          this.resourceDeleteHandle(index, row)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}

</script>

<style lang="scss" scoped>
    .func-container {
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;

      .search {

        .search-input {
          width: 200px;
          margin-right: 5px;
        }
      }
    }

    .tableStyle {
      width: 100%;
      border: 1px solid #DCDFE6;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    }
</style>
