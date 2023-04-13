<template>
  <div class="app-container">
    <div class="filter-container card">
      <el-form ref="form" class="searchForm" :model="listQuery" inline label-width="100px">
        <el-form-item label="账号">
          <el-input
            v-model="listQuery.condition.name"
            placeholder="请输入角色名称"
            style="width: 200px"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input
            v-model="listQuery.condition.key"
            placeholder="请输入权限字符"
            style="width: 200px"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="listQuery.condition.createTimeRange"
            value-format="yyyy-MM-dd hh:mm:ss"
            type="datetimerange"
            align="center"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="listQuery.condition.status"
            placeholder="请选择"
            clearable
            style="width: 200px"
            class="filter-item"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            v-waves
            v-permission="['system:role:list']"
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
          >
            搜索
          </el-button>
          <el-button
            v-permission="['system:role:create']"
            class="filter-item"
            style="margin-left: 10px;"
            type="primary"
            plain
            icon="el-icon-plus"
            @click="handleCreate"
          >
            新增
          </el-button>
          <el-button
            class="filter-item"
            style="margin-left: 10px;"
            type="warning"
            plain

            icon="el-icon-download"
            @click="handleDownload"
          >
            导出
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="doctorTable card">
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        fit
        highlight-current-row
        style="width: 100%"
        @sort-change="sortChange"
      >
        <el-table-column
          label="角色编号"
          prop="id"
          sortable="custom"
          align="center"
          :class-name="getSortClass('id')"
        />
        <el-table-column label="角色名称" prop="name" align="center" />
        <el-table-column prop="key" label="权限字符" />
        <el-table-column label="状态" align="center">
          <template slot-scope="{ row }">
            <el-switch
              v-model="row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" />
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          width="330px"
        >
          <template slot-scope="{ row }">
            <el-button
              v-permission="['system:role:update']"
              icon="el-icon-edit"
              type="text"
              style="margin-right:10px;"
              @click="handleUpdate(row)"
            >
              编辑
            </el-button>
            <el-popconfirm
              title="确定删除吗？"
              @onConfirm="handleDelete(row)"
            >
              <el-button slot="reference" type="text" icon="el-icon-delete">删除</el-button>
            </el-popconfirm>
            <el-dropdown>
              <el-button type="text" icon="el-icon-more">更多</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div @click="handleAssignPermission(row)">分配权限</div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.current"
        :limit.sync="listQuery.size"
        @pagination="getList"
      />
    </div>

    <!--  新增 / 修改   -->
    <Dialog class="dialog-costume" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="addAndEditForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="80px"
      >
        <el-form-item v-if="dialogStatus === 'update'" label="id" prop="id">
          <el-input
            v-model="temp.id"
            class="filter-item"
            disabled
            placeholder="请输入账号"
          />
        </el-form-item>
        <el-form-item label="角色名称" prop="name">
          <el-input
            v-model="temp.name"
            class="filter-item"
            placeholder="请输入角色名称"
          />
        </el-form-item>
        <el-form-item label="权限字符" prop="key">
          <el-input
            v-model="temp.key"
            class="filter-item"
            placeholder="请输入权限字符"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"

          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          提交
        </el-button>
      </div>
    </Dialog>
    <!--  分配 / 更新 权限   -->
    <Dialog v-if="isShowTree" class="dialog-costume permission" title="分配权限" :visible.sync="roleFormVisible">
      <el-form ref="roleForm" :model="roleForm" :rule="rolesRules">
        <el-tree
          ref="tree"
          :data="roleForm.permissionTree"
          show-checkbox
          default-expand-all
          node-key="id"
          highlight-current
          :props="defaultProps"
          :default-checked-keys="defaultKeys"
          :check-strictly="true"
          @check="checkNodes"
        />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignPermission()">确 定</el-button>
      </div>
    </Dialog>

    <el-drawer
      title="角色权限配置"
      :visible.sync="drawer"
      direction="rtl"
      :before-close="handleClose"
      width="300px"
    >
      <el-form ref="roleForm" :model="roleForm" :rule="rolesRules">
        <el-tree
          ref="tree"
          :data="roleForm.permissionTree"
          show-checkbox
          default-expand-all
          node-key="id"
          highlight-current
          :props="defaultProps"
          :default-checked-keys="defaultKeys"
          :check-strictly="true"
          @check="checkNodes"
        />
        <div class="demo-drawer__footer">
          <el-button @click="drawer=false">取 消</el-button>
          <el-button type="primary" :loading="loading" @click="assignPermission">{{ loading ? '提交中 ...' : '确 定' }}</el-button>
        </div>
      </el-form>
      <!--      <div slot="footer" class="dialog-footer">-->
      <!--        <el-button @click="roleFormVisible = false">取 消</el-button>-->
      <!--        <el-button type="primary" @click="assignPermission()">确 定</el-button>-->
      <!--      </div>-->
    </el-drawer>
  </div>
</template>

<script>
import {
  getRoleList,
  addRole,
  editRole,
  assignPermission,
  delRole,
  getRoleInfo
} from '@/api/system/role'
import { getPermissionTree } from '@/api/system/permission'
import permission from '@/directive/permission'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import Dialog from '@/components/Dialog/BasicDialog.vue'
export default {
  name: 'Role',
  components: { Pagination, Dialog },
  directives: { waves, permission },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      roleForm: {
        permissionTree: []
      },
      defaultProps: {
        children: 'children',
        label: 'resource'
      },
      roleFormVisible: false,
      roleMap: {
        assign: '分配角色',
        update: '更新角色'
      },
      rolesRules: {
        roles: [{ required: true, message: '请选择角色', trigger: 'change' }]
      },
      roleFormStatus: '',
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        size: 10,
        current: 1,
        condition: {
          name: '',
          key: '',
          status: '',
          createTimeRange: []
        },
        sortKeys: [
          {
            column: 'create_time',
            sort: 'desc'
          }
        ]
      },
      statusOptions: [
        { value: '0', label: '开启' },
        { value: '1', label: '关闭' }
      ],
      importanceOptions: [1, 2, 3],
      titleOptions: [1, 2, 3],
      sortOptions: [
        { label: 'ID Ascending', key: '+id' },
        { label: 'ID Descending', key: '-id' }
      ],
      showReviewer: false,
      temp: {
        id: undefined,
        name: '',
        key: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      rolesOption: [],
      dialogPvVisible: false,
      pvData: [],
      rules: {
        name: [{ message: 'name is required', trigger: 'blur' }],
        key: [{ message: 'key is required', trigger: 'blur' }],
        status: [{ message: 'status is required', trigger: 'change' }]
      },
      downloadLoading: false,
      checkedKeys: [],
      defaultKeys: [],
      isShowTree: false,
      drawer: false,
      loading: false
    }
  },
  created() {
    this.getList()
    this.getRoleList()
    this.getTree()
  },
  methods: {
    handleClose(done) {
      if (this.loading) {
        return
      }
      this.$confirm('确定要提交表单吗？')
        .then(_ => {
          this.loading = true
          this.timer = setTimeout(() => {
            done()
            this.assignPermission()
            // 动画关闭需要一定的时间
            setTimeout(() => {
              this.loading = false
            }, 400)
          }, 2000)
        })
        .catch(_ => {})
    },
    cancelForm() {
      this.loading = false
      this.dialog = false
      clearTimeout(this.timer)
    },
    checkNodes(_, payload) {
      this.checkedKeys = payload.checkedKeys
    },
    getTree() {
      // 获取权限树
      getPermissionTree()
        .then(({ data }) => {
          console.log('getPermissionTree', data)
          this.roleForm.permissionTree = data
        })
        .catch((e) => {
          console.log(e)
        })
    },
    getRoleList() {
      const params = { size: 10, current: 1, condition: {}}
      getRoleList(params).then(({ data }) => {
        console.log(data)
        const len = data.list.length
        for (let i = 0; i < len; i++) {
          const item = { value: data.list[i].id, label: data.list[i].name }
          this.rolesOption.push(item)
        }
      })
    },
    async getRolePermission(id) {
      console.log('获取权限')
      const roleRes = await getRoleInfo(id)
      const { data } = roleRes
      let permissions = []
      this.defaultKeys = []

      if (roleRes && data) {
        // console.log('role', data)
        permissions = data.permissions.map(item => item.id)
      }
      this.defaultKeys = permissions
      this.checkedKeys = permissions
      return permissions
    },
    handleAssignPermission(row) {
      console.log('分配权限')
      this.roleForm.id = row.id
      this.isShowTree = false
      this.getRolePermission(row.id)
      this.drawer = true
      this.isShowTree = true
      // this.roleFormVisible = true
    },
    assignPermission() {
      const params = {
        id: this.roleForm.id,
        permissionIds: this.checkedKeys
      }

      assignPermission(params).then((data) => {
        if (data.code) {
          this.$notify({
            message: '权限分配失败',
            type: 'error',
            duration: 2000
          })

          this.roleFormVisible = false
          this.$router.go(0)
          this.$refs.tree.setCheckedKeys([])
          return
        }

        this.$notify({
          message: '权限分配成功',
          type: 'success',
          duration: 2000
        })

        this.roleFormVisible = false
        this.$router.go(0)
        this.$refs.tree.setCheckedKeys([])
      })
    },
    handleStatusChange(row) {
      const params = {
        id: row.id,
        status: Number(!row.status)
      }

      editRole(params)
        .then((data) => {
          this.$notify({
            message: data.message,
            type: data.success ? 'success' : 'error',
            duration: 2000
          })
        })
        .catch((e) => {
          console.log(e)
        })
    },
    getList() {
      console.log('getList 🚀 ✈~')
      this.listLoading = true
      getRoleList(this.listQuery).then((response) => {
        for (let i = 0; i < response.data.list.length; i++) {
          response.data.list[i].status = !response.data.list[i].status
          console.log('status: ', response.data.list[i].status)
        }
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      console.log('handleFilter 🚀 ✈~')
      this.listQuery.page = 1
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
    sortChange(data) {
      console.log('sortChange 🚀 ✈~', data)
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      console.log('sortByID 🚀 ✈~', order)
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      console.log('resetTemp 🚀 ✈~')
      this.temp = {
        id: undefined,
        name: '',
        key: '',
        sort: '',
        createUserName: ''
      }
    },
    handleCreate() {
      console.log('handleCreate 🚀 ✈~')
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['addAndEditForm'].clearValidate()
      })
    },
    createData() {
      console.log('createData 🚀 ✈~')
      this.$refs['addAndEditForm'].validate((valid) => {
        if (valid) {
          addRole(this.temp)
            .then((data) => {
              this.$notify({
                message: data.message,
                type: data.success ? 'success' : 'error',
                duration: 2000
              })
              this.getList()
            })
            .catch((e) => {
              console.log(e)
            })
          this.resetTemp()
          this.dialogFormVisible = false
          this.getList()
        }
      })
    },
    handleUpdate(row) {
      console.log('handleUpdate 🚀 ✈~', row)
      this.temp = Object.assign({}, row)
      this.temp.id = row.id
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['addAndEditForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['addAndEditForm'].validate((valid) => {
        if (valid) {
          const params = Object.assign({}, {
            id: this.temp.id,
            name: this.temp.name,
            key: this.temp.key
          })
          editRole(params)
            .then((data) => {
              this.$notify({
                message: data.message,
                type: data.success ? 'success' : 'error',
                duration: 2000
              })
            })
            .catch((e) => {
              console.log(e)
            })
          this.resetTemp()
          this.dialogFormVisible = false
          this.getList()
        }
      })
    },
    handleDelete(row) {
      console.log('handleDel')
      delRole(row.id)
        .then((data) => {
          console.log('deleteRole', data)
          this.$notify({
            message: data.message,
            type: data.success ? 'success' : 'error',
            duration: 2000
          })
          this.getList()
        })
        .catch((e) => {
          console.log(e)
        })
    },
    handleDisable(row) {
      console.log('handleDisable 🚀 ✈~', row)
    },
    handleDownload(row) {
      console.log('handleDownload 🚀 ✈~', row)
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        // 导出表格
        const tHeader = ['注册时间', '职称', '姓名', '状态', '科室', '手机号']
        const filterVal = [
          'timestamp',
          'title',
          'name',
          'status',
          'department',
          'phone'
        ]
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
      return this.list.map((v) =>
        filterVal.map((j) => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
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

      .el-input,
      .el-select,
      .el-date-editor {
        flex: 1;
        height: 36px;
        margin: 0;
      }
    }
  }
  ::v-deep .dialog-costume{
    .cat-dialog{
      width: 400px;
      .cat-dialog__body{
        height: 200px;
        overflow-y: scroll;
      }
      .dialog-footer{
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
    }
    &.permission{
      .cat-dialog__body{
        height: 500px;
        overflow-y: scroll;
      }
    }
  }

  ::v-deep .el-drawer {
    width: 400px !important;
  }
  ::v-deep .el-drawer__body{
    position: relative;
    overflow-y: scroll;
    padding-bottom: 50px;
    .el-form {
      width: 400px;
      position: relative;
      .el-tree {
        //overflow-y: scroll;
      }
    }
  }

  .demo-drawer__footer{
    width: 400px;
    display: flex;
    justify-content: center;
    background-color: #fff;
    position: fixed;
    right: 0;
    bottom: 0;
    z-index: 999;
  }
}
</style>
