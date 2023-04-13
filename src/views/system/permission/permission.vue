<template>
  <div class="app-container">
    <div class="filter-container card">
      <el-form ref="form" class="searchForm" :model="query" inline label-width="100px">
        <div class="form-line">
          <div class="left">
            <el-form-item label="菜单名称">
              <el-input v-model="query.resource" placeholder="请输入菜单名称" />
            </el-form-item>
            <el-form-item label="菜单类型">
              <el-select v-model="query.type" placeholder="请选择菜单类型">
                <el-option
                  v-for="item in menuMap"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="权限标识">
              <el-input v-model="query.permissionKey" placeholder="请输入权限标识" />
            </el-form-item>
            <el-form-item label="路由地址">
              <el-input v-model="query.router" placeholder="请输入路由地址" />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="query.status" placeholder="请选择状态" width="100">
                <el-option
                  v-for="item in statusMap"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button v-waves v-permission="['system:permission:list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
              <el-button v-waves class="filter-item" plain icon="el-icon-refresh" @click="handleReset">重置</el-button>
              <el-button v-waves :loading="downloadLoading" plain class="filter-item" type="warning" icon="el-icon-download" @click="handleDownload">导出</el-button>
              <el-button
                class="filter-item"
                style="margin-left: 10px;"

                type="primary"
                plain
                icon="el-icon-plus"
                @click="handleCreate"
              >
                新增
              </el-button>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>

    <div class="doctorTable card">
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        row-key="id"
        :data="list"
        fit
        highlight-current-row
      >
        <el-table-column label="菜单名称" width="150px" prop="resource" sortable="custom" align="center" />
        <el-table-column prop="icon" label="图标" width="50px">
          <template slot-scope="{row}">
            <i :class="`el-icon ${row.icon}`" />
          </template>
        </el-table-column>
        <el-table-column label="排序" prop="sort" align="center" />
        <el-table-column label="权限标识" width="250px" prop="permissionKey" align="center" />
        <el-table-column label="组件路径" width="250px" prop="router" align="center" />
        <el-table-column label="状态" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.status | statusFilter">
              {{ row.status | statusFilter }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="150px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width" width="220px">
          <template slot-scope="{row}">
            <el-button
              v-permission="['system:permission:create']"
              icon="el-icon-plus"
              type="text"
              @click="handleCreate(row)"
            >新增</el-button>
            <el-button
              v-permission="['system:permission:update']"
              icon="el-icon-edit"
              type="text"
              style="margin-right:10px"
              @click="handleUpdate(row)"
            >
              编辑
            </el-button>
            <el-popconfirm
              v-permission="['system:permission:delete']"
              title="确定删除吗？"
              @onConfirm="handleDelete(row)"
            >
              <el-button slot="reference" type="text" plain icon="el-icon-delete">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <Dialog class="dialog-costume" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :model="temp"
        label-position="left"
        label-width="80px"
      >
        <el-form-item v-if="dialogStatus==='create'" label="当前父级">
          <el-input v-model="curFather" disabled />
        </el-form-item>
        <el-form-item label="菜单名称" prop="resource">
          <el-input v-model="temp.resource" class="filter-item" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="temp.icon" :disabled="isInterface" placeholder="请输入菜单图标" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="temp.type" placeholder="请选择状态" width="100">
            <el-option
              v-for="item in typeMap"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="权限标识" prop="permissionKey">
          <el-input v-model="temp.permissionKey" />
        </el-form-item>
        <el-form-item label="组件路径" prop="router">
          <el-input v-model="temp.router" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="temp.status" class="filter-item" placeholder="请选择状态">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          提交
        </el-button>
      </div>
    </Dialog>
  </div>
</template>

<script>
import {
  getPermissionTree,
  // getPermissionList,
  delPermission,
  addPermission,
  editPermission
} from '@/api/system/permission'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Dialog from '@/components/Dialog/BasicDialog.vue'
import permission from '@/directive/permission'
export default {
  name: 'Permission',
  components: { Dialog },
  directives: { waves, permission },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '0': '开启',
        '1': '关闭'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      curFather: '',
      isInterface: false,
      statusOptions: [
        { value: 0, label: '开启' },
        { value: 1, label: '关闭' }
      ],
      statusMap: [{
        label: '开启',
        value: 0
      }, {
        label: '关闭',
        value: 1
      }],
      menuMap: [{
        label: '全部',
        value: -1
      },
      {
        label: '菜单组件',
        value: 1
      },
      {
        label: '接口组件',
        value: 2
      }
      ],
      typeMap: [
        {
          label: '菜单组件',
          value: 1
        },
        {
          label: '接口组件',
          value: 2
        }
      ],
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: false,
      query: {
        resource: '',
        type: -1,
        permissionKey: '',
        router: '',
        status: ''
      },
      importanceOptions: [1, 2, 3],
      titleOptions: [1, 2, 3],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      showReviewer: false,
      temp: {
        parentId: 1,
        resource: '',
        icon: '',
        permissionKey: '',
        router: '',
        status: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
      },
      downloadLoading: false
    }
  },
  watch: {
    'temp.type'(n, o) {
      console.log(n, o)
      if (n === 2) {
        this.isInterface = true
        this.temp.icon = 'el-icon-set-up'
      } else {
        this.isInterface = false
      }
    }
  },
  created() {
    this.query.type = -1
    this.getList()
  },
  methods: {
    getList() {
      console.log('getList 🚀 ✈~')
      this.listLoading = true
      getPermissionTree(this.query).then(response => {
        console.log(response, 'resp')
        this.list = response.data
        this.total = response.data.length
        this.listLoading = false
      })
    },
    handleReset() {
      console.log('handleReset')
      this.query = {
        resource: '',
        type: '',
        permissionKey: '',
        router: '',
        status: ''
      }
      this.getList()
    },
    handleFilter() {
      console.log('handleFilter 🚀 ✈~')
      this.getList()
    },
    handleModifyStatus(row, status) {
      console.log('handleModifyStatus 🚀 ✈~', row, status)
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    resetTemp() {
      console.log('resetTemp 🚀 ✈~')
      this.temp = {
        parentId: 1,
        resource: '',
        icon: '',
        permissionKey: '',
        router: '',
        status: '',
        type: ''
      }
    },
    handleCreate(row) {
      this.curFather = ''
      if (row && row.id) {
        const type = row.type
        if (type === 1) {
          this.curFather = row.resource
        } else {
          this.curFather = '接口组件'
        }
      } else {
        this.curFather = '根组件'
      }
      console.log('handleCreate 🚀 ✈~', row)
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.temp.parentId = row.id
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      console.log('createData 🚀 ✈~')
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log('this.temp', this.temp)
          addPermission(this.temp).then((data) => {
            this.$notify({
              message: data.message,
              type: data.success ? 'success' : 'error',
              duration: 2000
            })
            this.getList()
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleUpdate(row) {
      this.curFather = ''
      if (row && row.id) {
        const type = row.type
        if (type === 1) {
          this.curFather = row.resource
        } else {
          this.curFather = '接口组件'
        }
      } else {
        this.curFather = '根组件'
      }
      console.log('handleUpdate 🚀 ✈~', row)
      this.temp = Object.assign({}, row) // copy obj
      if (row && row.type === 1) {
        this.isInterface = false
      } else {
        this.isInterface = true
        this.temp.icon = 'el-icon-set-up'
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log('valid', valid)
          const tempData = Object.assign({}, this.temp)
          editPermission(tempData).then((data) => {
            this.dialogFormVisible = false
            this.$notify({
              message: data.message,
              type: data.success ? 'success' : 'error',
              duration: 2000
            })
            this.getList()
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleDelete(row, index) {
      delPermission(row.id).then(data => {
        this.$notify({
          message: data.message,
          type: data.success ? 'success' : 'error',
          duration: 2000
        })
        this.getList()
      })
    },
    handleDisable(row) {
      console.log('handleDisable 🚀 ✈~', row)
    },
    handleDownload(row) {
      console.log('handleDownload 🚀 ✈~', row)
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        // 导出表格
        const tHeader = ['注册时间', '职称', '姓名', '状态', '科室', '手机号']
        const filterVal = ['timestamp', 'title', 'name', 'status', 'department', 'phone']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      console.log('formatJson 🚀 ✈~', filterVal)
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      console.log('getSortClass 🚀 ✈~', key)
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container {
  .filter-container {
    margin-bottom:10px;
    .el-col {
      display: flex;
      align-items: center;
      margin: 10px 0;
      box-sizing: border-box;

      span {
        width: 100px;
        height: 36px;
        line-height: 36px;
        text-align: right;
        overflow: hidden;
        margin-right: 10px;
        display: inline-block;
      }

      .el-input, .el-select, .el-date-editor {
        flex: 1;
        height: 36px;
        margin: 0;
      }
    }
  }
  ::v-deep .dialog-costume{
    .cat-dialog{
      width: 400px;
      .dialog-footer{
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
</style>
