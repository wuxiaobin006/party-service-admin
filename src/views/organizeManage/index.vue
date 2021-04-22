/*
* @Author: 杨志杰
* @Date: 2020-06-09
* @Last Modified by: 杨志杰
* @Last Modified time: 2020-09-23 22:18:01
*/
//学校管理-机构管理页面
<template>
  <div class="organizeManage">
    <div class="filter-container">
      <div class="create-button">
        <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
          新增
        </el-button>
      </div>
      <div class="search">
        <el-input
          v-model="listQuery.orgName"
          placeholder="机构名称"
          class="filter-item search-input"
          @keyup.enter.native="handleFilter"
        />
        <el-button class="filter-item search-button" type="primary" icon="el-icon-search" @click="handleFilter">
          搜索
        </el-button>
      </div>
    </div>
    <div class="table-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
      >
        <el-table-column prop="tbProvinceName" label="省份" sortable align="center">
          <template slot-scope="{row}">
            <span>{{ row.provinceName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="tbCity" label="城市" sortable align="center">
          <template slot-scope="{row}">
            <span>{{ row.cityName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="tbOrgName" label="机构名称" sortable align="center">
          <template slot-scope="{row}">
            <span>{{ row.orgName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="tbWechatID" label="微信号" sortable align="center">
          <template slot-scope="{row}">
            <span>{{ row.wechatID }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="tbContact" label="联系方式" min-width="110px" sortable align="center">
          <template slot-scope="{row}">
            <span>{{ row.contact }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" min-width="280px" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-button icon="el-icon-edit" type="primary" size="mini" @click="handleUpdate(row)">修改</el-button>
            <el-popconfirm title="确定删除吗？" @onConfirm="handleDelete(row,$index)">
              <el-button slot="reference" icon="el-icon-close" size="mini" type="danger">删除</el-button>
            </el-popconfirm>
            <el-button icon="el-icon-s-promotion" size="mini" type="success">分享</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="80px"
      >
        <el-form-item label="省份" prop="provinceName">
          <el-select v-model="temp.provinceName" placeholder="请选择" @change="selectChange">
            <el-option
              v-for="(item,index) in select.province"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="城市" prop="cityName">
          <el-select v-model="temp.cityName" :loading="select.loading" placeholder="请选择" no-data-text="请先选择省份">
            <el-option
              v-for="(item,index) in select.city"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="机构名称" prop="orgName">
          <el-input v-model="temp.orgName" prefix-icon="el-icon-office-building" />
        </el-form-item>
        <el-form-item label="微信号" prop="wechatID">
          <el-input v-model="temp.wechatID" prefix-icon="el-icon-chat-dot-round" />
        </el-form-item>
        <el-form-item label="联系方式" prop="contact">
          <el-input v-model="temp.contact" prefix-icon="el-icon-mobile-phone" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getOrg,
  createOrg,
  updateOrg,
  deleteOrg,
  getAllProvince,
  getCityByProvince
} from '@/api/organizeManage'
import Pagination from '@/components/Pagination'
import { openFullScreenLoading } from '@/utils'

export default {
  name: 'OrganizeManage',
  components: { Pagination },
  data() {
    const validatorContact = function(rule, value, callback) {
      if (value === '') {
        callback(new Error('请填写联系方式'))
      } else if (!/^1\d{10}$/.test(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }
    return {
      list: [],
      listLoading: true,
      total: 0,
      listQuery: { page: 1, limit: 10, orgName: null },
      temp: { orgId: undefined, provinceName: '', cityName: '', orgName: '', wechatID: '', contact: '' },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: { update: '编辑', create: '新增' },
      rules: {
        provinceName: [{ required: true, message: '请选择所在省份', trigger: 'blur' }],
        contact: [{ required: true, validator: validatorContact, trigger: 'blur' }],
        cityName: [{ required: true, message: '请选择所在城市', trigger: 'blur' }],
        orgName: [{ required: true, message: '请填写机构名称', trigger: 'blur' }],
        wechatID: [{ required: true, message: '请填写微信号', trigger: 'blur' }]
      },
      // 下拉选择器数据
      select: {
        province: [],
        city: [],
        loading: false
      }
    }
  },
  created() {
    this.getList()
    this.getAllProvince()
  },
  methods: {
    // 获取所有省份
    async getAllProvince() {
      try {
        const { data } = await getAllProvince()
        this.select.province = data
      } catch (e) {
        console.log(e)
      }
    },
    // 根据省份查询所属城市
    async selectChange(value) {
      this.select.loading = true
      this.temp.cityName = ''
      try {
        const { data } = await getCityByProvince(value)
        this.select.city = data
        this.select.loading = false
      } catch (e) {
        console.log(e)
      }
    },
    // 查
    async getList() {
      this.listLoading = true
      try {
        const { data } = await getOrg(this.listQuery.orgName, this.listQuery.page, this.listQuery.limit)
        // const res = await getCountOrg(this.listQuery.orgName)
        this.list = data.data
        this.total = data.totalCount
        this.listLoading = false
      } catch (e) {
        console.log(e)
      }
    },
    resetTemp() {
      this.temp = { orgId: undefined, provinceName: '', cityName: '', orgName: '', wechatID: '', contact: '' }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleCreate() {
      this.resetTemp()
      this.select.city = []
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.selectChange(row.provinceName)
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 删
    async handleDelete(row) {
      const loading = openFullScreenLoading(this)
      try {
        await deleteOrg(row.orgId)
        loading.close()
        this.$notify.success({ title: '成功', message: '删除成功', duration: 2000 })
        const index = this.list.findIndex(v => v.orgId === row.orgId)
        this.list.splice(index, 1)
        this.total--
      } catch (e) {
        loading.close()
        this.$notify.error({ title: '失败', message: '删除失败', duration: 2000 })
        console.log(e)
      }
    },
    // 增
    createData() {
      this.$refs['dataForm'].validate(async(valid) => {
        if (valid) {
          const loading = openFullScreenLoading(this)
          try {
            const { data } = await createOrg(this.temp.provinceName, this.temp.cityName, this.temp.orgName, this.temp.wechatID, this.temp.contact)
            this.temp.orgId = data.orgId
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            loading.close()
            this.$notify.success({ title: '成功', message: '添加成功', duration: 2000 })
            this.total++
          } catch (e) {
            loading.close()
            this.$notify.error({ title: '失败', message: '添加失败', duration: 2000 })
            console.log(e)
          }
        }
      })
    },
    // 改
    updateData() {
      this.$refs['dataForm'].validate(async(valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          const loading = openFullScreenLoading(this)
          try {
            await updateOrg(tempData.provinceName, tempData.cityName, tempData.orgName, tempData.wechatID, tempData.contact, tempData.orgId)
            const index = this.list.findIndex(v => v.orgId === this.temp.orgId)
            this.list.splice(index, 1, tempData)
            this.dialogFormVisible = false
            loading.close()
            this.$notify.success({ title: '成功', message: '更新成功', duration: 2000 })
          } catch (e) {
            loading.close()
            this.$notify.error({ title: '失败', message: '更新失败', duration: 2000 })
            console.log(e)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.organizeManage {
  padding: 30px;

  .filter-container {
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .search {
      display: flex;

      .search-input {
        width: 200px;
      }
    }
  }

  .table-container {
    border: 1px solid #DCDFE6;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);

    .el-table {
      width: 100%;
      border-radius: 10px 10px 0 0;
    }
  }

  /deep/ .el-dialog {
    width: 70%;

    .el-form {
      width: 90%;
      margin-left: 30px;
    }
  }

}
</style>
