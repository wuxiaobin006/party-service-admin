/*
* @Author: 吴晓斌
* @Date: 2020-09-10
* @Last Modified by: 吴晓斌
* @Last Modified time: 2020-09-11 09:23:21
*/
//财务管理-教师费用设置页面
<template>
  <div class="app-container">
    <div class="func-container">
      <div class="select">
        <el-date-picker
          v-model="listQuery.propValue"
          class="timePicker"
          type="month"
          placeholder="选择日期"
          format="yyyy-MM"
          value-format="yyyy-MM"
          clearable
          @change="selectDate()"
        /> <!--选择日期-->
        <el-button type="primary" icon="el-icon-download" round @click="download()">导出教师费用</el-button>
        <el-button type="success" icon="el-icon-plus" round @click="upload()">导入教师费用</el-button>
      </div>
      <div class="search">
        <el-input
          v-model="listQuery.teacherName"
          placeholder="请输入教师姓名"
          class="search-input"
          prefix-icon="el-icon-search"
          clearable
          @keyup.enter.native="searchBox"
        />
        <el-button class="search-button" type="primary" icon="el-icon-search" :disabled="searchBtnState==false" @click="searchBox">
          搜索
        </el-button>
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
        <el-table-column label="教师id" prop="teacherId" sortable align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.teacherId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="教师姓名" prop="teacherName" sortable align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.teacherName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="教师班级" prop="teacherClass" sortable align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.teacherClass }}</span>
          </template>
        </el-table-column>
        <el-table-column label="开始时间" prop="startTime" sortable align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.startTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结束时间" prop="endTime" sortable align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.endTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="课时标准" prop="classTimeStandard" sortable align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.classTimeStandard }}</span>
          </template>
        </el-table-column>
        <el-table-column label="加班费" prop="overtimePay" sortable align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.overtimePay }}</span>
          </template>
        </el-table-column>
        <el-table-column label="顶课费" prop="substitutePay" sortable align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.substitutePay }}</span>
          </template>
        </el-table-column>
        <el-table-column label="助教费" prop="taPay" sortable align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.taPay }}</span>
          </template>
        </el-table-column>
        <el-table-column label="扣款" prop="deductions" sortable align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.deductions }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="190px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-download" size="mini" @click="detailShow(scope.row)">
              查看
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteConfirm(scope.row,scope.$index)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getTeacherFeeSettingsList"
      /> <!--分页组件-->
    </div>
    <el-dialog :title="detail" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :model="init"
        :rules="rules"
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="教师id" prop="teacherId">
          <el-input v-model="init.teacherId" />
        </el-form-item>
        <el-form-item label="教师姓名" prop="teacherName">
          <el-input v-model="init.teacherName" />
        </el-form-item>
        <el-form-item label="教师班级" prop="teacherClass">
          <el-input v-model="init.teacherClass" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-input v-model="init.startTime" />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-input v-model="init.endTime" />
        </el-form-item>
        <el-form-item label="课时标准" prop="classTimeStandard">
          <el-input v-model="init.classTimeStandard" />
        </el-form-item>
        <el-form-item label="加班费" prop="overtimePay">
          <el-input v-model="init.overtimePay" />
        </el-form-item>
        <el-form-item label="顶课费" prop="substitutePay">
          <el-input v-model="init.substitutePay" />
        </el-form-item>
        <el-form-item label="助教费" prop="taPay">
          <el-input v-model="init.taPay" />
        </el-form-item>
        <el-form-item label="扣款" prop="deductions">
          <el-input v-model="init.deductions" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button icon="el-icon-close" @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button icon="el-icon-check" type="primary" @click="save()">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTeacherFeeSettingsList, updateTeacherFeeSettingsList } from '@/api/financialManage/teacherFeeSettings'
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      dialogFormVisible: false,
      detail: '教师费用详情',
      listQuery: {
        propValue: '',
        startTime: '',
        endTime: '',
        teacherName: undefined,
        page: 1,
        limit: 20
      },
      init: {
        id: '',
        teacherId: '',
        teacherName: '',
        teacherClass: '',
        startTime: '',
        endTime: '',
        classTimeStandard: '',
        overtimePay: '',
        substitutePay: '',
        taPay: '',
        deductions: ''
      },
      rules: {
        teacherName: [{ required: true, message: '不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    searchBtnState() { // 搜索栏若为空 则搜索按钮不能点击
      return this.listQuery.teacherName !== ''
    }
  },
  created() {
    this.getTeacherFeeSettingsList()
  },
  methods: {
    getTeacherFeeSettingsList() { // 获取教师费用设置列表
      this.listLoading = true
      getTeacherFeeSettingsList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        for (let i = 0; i < this.list.length; i++) { // toLocaleString()方法对金额类型的数字进行格式化(如1234 -> 1,234)
          this.list[i].overtimePay = this.list[i].overtimePay.toLocaleString()
          this.list[i].substitutePay = this.list[i].substitutePay.toLocaleString()
          this.list[i].taPay = this.list[i].taPay.toLocaleString()
          this.list[i].deductions = this.list[i].deductions.toLocaleString()
        }
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    searchBox() {
      this.listQuery.page = 1
      this.getTeacherFeeSettingsList()
    },
    selectDate() {
      // console.log(this.listQuery.propValue)
      this.listQuery.page = 1
      this.getTeacherFeeSettingsList()
    },
    detailShow(row) {
      this.init = Object.assign({}, row) // copy obj
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    save(rowId) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const initData = Object.assign({}, this.init)
          updateTeacherFeeSettingsList(initData).then(() => {
            const index = this.list.findIndex(v => v.id === this.init.id)
            this.list.splice(index, 1, this.init)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '保存成功',
              type: 'success',
              duration: 2000
            })
          })
        } else {
          this.$notify({
            title: '通知',
            message: '提交失败，请完成填写',
            type: 'info',
            duration: 2000
          })
        }
      })
    },
    delete(row) {
      const index = this.list.findIndex(v => v.id === row.id)
      this.list.splice(index, 1)
    },
    deleteConfirm(row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(action => {
        if (action === 'confirm') {
          this.delete(row)
        }
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
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
          width: 180px;
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
