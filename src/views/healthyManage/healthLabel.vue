/*
* @Author: 范开杰
* @Date: 2020-10-22
* @Last Modified by: 范开杰
* @Last Modified time: 2020-12-01 10:04:01
*/
//健康管理-养生课堂标签管理页面
<template>
  <div class="healthLabel">
    <div class="healthLabel_header"><!-- 退费记录头部 -->
      <el-row>
        <el-col :span="3">
          <el-button type="primary" @click="dialogFormVisible = true">新增标签</el-button>
        </el-col>
      </el-row>
    </div>

    <div class="healthLabel--table"><!-- 退费记录表格 -->
      <el-table
        v-loading="loading"
        :data="list"
        :default-sort="{prop: 'id', order: 'ascending'}"
        style="width: 100%"
      >
        <el-table-column
          label="标签号"
          prop="id"
          sortable
        />
        <el-table-column
          label="标签名称"
          prop="name"
          sortable
        />
        <el-table-column
          label="标签相关"
          prop="about"
          sortable
        />
        <el-table-column
          label="关注人数"
          prop="countFollow"
          sortable
        />
        <el-table-column
          label="文章数量"
          prop="countArticle"
          sortable
        />
        <el-table-column
          label="操作"
          prop="operation"
          sortable
        >
          <template slot-scope="{row,$index}">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="dialogEditFormVisible = true;gethandleMessage(row,$index)">修改</el-button>
            <el-popconfirm
              title="确定删除该文章吗？"
              icon="el-icon-info"
              icon-color="red"
              @onConfirm="handleDelete(row,$index)"
            >
              <el-button slot="reference" class="healthLabel--deleteButton" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
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

      <el-dialog title="新增养生讲堂内容标签" custom-class="dialog" :visible.sync="dialogFormVisible" width="25%">
        <el-form :model="form">
          <el-form-item label="标签名称" required>
            <el-input v-model="form.name" class="healthLabel--formItem" />
          </el-form-item>
          <el-form-item label="标签相关" required>
            <el-input v-model="form.about" class="healthLabel--formItem" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false;addLabel()">添 加</el-button>
        </div>
      </el-dialog>

      <el-dialog title="修改养生讲堂内容标签" custom-class="dialog" :visible.sync="dialogEditFormVisible" width="25%">
        <el-form :model="form">
          <el-form-item label="标签名称" required>
            <el-input v-model="editForm.name" class="healthLabel--formItem" />
          </el-form-item>
          <el-form-item label="标签相关" required>
            <el-input v-model="editForm.about" class="healthLabel--formItem" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogEditFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogEditFormVisible = false;editLabel()">修 改</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { gethealthLabelList, addhealthLabel, deletehealthLabel, edithealthLabel } from '@/api/healthyManage/healthLabel'
import Pagination from '@/components/Pagination'
export default {
  name: 'HealthLabel',
  components: { Pagination },
  data() {
    return {
      list: [], // 表格数据
      listQuery: { // 分页数据
        page: 1,
        limit: 10
      },
      sendData: { // 获取数据所需参数
        pageNo: undefined,
        pageSize: undefined
      },
      form: { // 新增标签表单参数
        name: undefined,
        about: undefined
      },
      deleteLabel: { // 删除标签所需参数
        id: undefined
      },
      editForm: { // 修改标签所需参数
        id: undefined,
        name: undefined,
        about: undefined
      },
      total: 0, // 取得标签数
      loading: true, // 表格加载状态
      dialogFormVisible: false, // 新增标签表单对话框显示状态
      dialogEditFormVisible: false // 修改标签表单对话框显示状态
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
    }
  },
  watch: {
    /**
     * 监视分页的当前页数
     * @param {Number} val 当前页数
     */
    newPage(val) {
      this.sendData.pageNo = val
    },

    /**
     * 监视分页中每页显示数量
     * @param {Number} val 每页显示数量
     */
    newLimit(val) {
      this.sendData.pageSize = val
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    /**
     * 获取养生讲堂内容标签数据
     */
    getList() {
      gethealthLabelList().then(response => {
        this.list = response.data.slice((this.listQuery.page - 1) * this.listQuery.limit, this.listQuery.page * this.listQuery.limit)
        this.total = response.data.length
        this.loading = false
      })
    },
    /**
     * 添加养生讲堂内容标签
     */
    addLabel() {
      addhealthLabel(this.form).then(response => {
        this.$notify({
          title: '成功',
          message: '添加成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },

    /**
     * 获取当前行的标签名称与标签相关并显示到修改对话框
     * @param {Object} row 当前行
     */
    gethandleMessage(row) {
      this.editForm.id = row.id
      this.editForm.name = row.name
      this.editForm.about = row.about
    },

    /**
     * 修改养生讲堂内容标签
     */
    editLabel() {
      edithealthLabel(this.editForm).then(response => {
        this.$notify({
          title: '成功',
          message: '修改成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },

    /**
     * 删除养生讲堂内容标签
     * @param {Object} row 当前行
     */
    handleDelete(row) {
      this.deleteLabel.id = row.id
      deletehealthLabel(this.deleteLabel).then(response => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .healthLabel {
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
    &--formItem{
      width:75%
    }
    &--deleteButton{
      margin-left: 10px;
    }
  }
  /deep/ .dialog{
    border-radius: 10px;
  }
</style>
