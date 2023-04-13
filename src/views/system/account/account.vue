<template>
  <div class="app-container account">
    <div class="filter-container card">
      <el-form ref="form" class="searchForm" :model="listQuery" inline label-width="100px">
        <el-form-item label="账号">
          <el-input
            v-model="listQuery.condition.account"
            placeholder="请输入"

            style="width: 250px"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input
            v-model="listQuery.condition.phone"
            placeholder="请输入"

            style="width: 250px"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="listQuery.condition.createTime"
            value-format="yyyy-MM-dd"
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
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-waves v-permission="['system:account:list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
          <el-button
            v-permission="['system:account:create']"
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
            type="success"
            plain

            icon="el-icon-edit"
            @click="handleCreate"
          >
            修改
          </el-button>
          <el-button
            class="filter-item"
            style="margin-left: 10px;"
            type="info"
            plain

            icon="el-icon-upload2"
            @click="handleCreate"
          >
            导入
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
        style="width: 100%;"
        @sort-change="sortChange"
      >
        <el-table-column label="ID" prop="id" sortable="custom" align="center" :class-name="getSortClass('id')" />
        <el-table-column label="账号" prop="username" width="100px" align="center" />
        <el-table-column label="图标">
          <template slot-scope="{row}">
            <span><img class="avatar" :src="row.avatar" width="50" height="50" alt=""></span>
          </template>
        </el-table-column>
        <el-table-column label="昵称" prop="nickname" align="center" />
        <el-table-column label="联系方式" prop="phone" width="120px" align="center" />
        <el-table-column label="角色" width="300px" align="center">
          <template slot-scope="{row}">
            <span v-for="(item,index) in row.roles" :key="index">
              <el-tag style="margin: 0 5px">{{ item }}</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="{row}">
            <span>{{ row.status | statusFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" class-name="mini-padding fixed-width" width="250px">
          <template slot-scope="{row}">
            <el-button :icon="row.status!==2?'el-icon-error':'el-icon-success'" type="text" @click="disableStatus(row)">{{ row.status !== 2 ? '禁用' : '解禁' }}</el-button>
            <el-button v-permission="['system:account:update']" type="text" icon="el-icon-edit" style="margin-right: 10px" @click="handleUpdate(row)">
              编辑
            </el-button>
            <el-dropdown>
              <el-button type="text" icon="el-icon-more">更多</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-permission="['system:account:delete']">
                  <el-popconfirm
                    title="确定删除吗？"
                    @onConfirm="handleDelete(row)"
                  >
                    <div slot="reference" v-waves>删除</div>
                  </el-popconfirm>
                <!--                  <span @click="handleDelete(row)">删除</span>-->
                </el-dropdown-item>
                <el-dropdown-item>
                  <div v-permission="['system:account:password:update']" @click="handleResetPass(row)">重置密码</div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div @click="handleAssignRoles(row)">分配角色</div></el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.current"
        :limit.sync="listQuery.limit"
        @pagination="getList"
      />
    </div>

    <!--  新增 / 修改   -->
    <Dialog class="dialog-costume" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="30%">
      <el-form
        ref="addAndEditForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="80px"
      >
        <el-form-item v-if="dialogStatus==='update'" label="id" prop="id">
          <el-input v-model="temp.id" class="filter-item" disabled placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <el-input v-model="temp.username" class="filter-item" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="姓名" prop="nickname">
          <el-input v-model="temp.nickname" class="filter-item" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="temp.phone" />
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <!-- <el-input v-model="temp.avatar" /> -->
          <el-upload
            class="upload-demo"
            action="cdn.bestwellai.com"
            :http-request="onUpload"
            :show-file-list="false"
            :on-remove="onRemove"
          >
            <div v-if="temp.avatar" class="avatar-container">
              <img class="avatar plus" :src="temp.avatar" width="40" height="40" alt="">
              <i class="el-icon el-icon-plus" />
            </div>

            <el-button v-else size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item v-if="dialogStatus==='create'" label="用户密码" prop="password">
          <el-input v-model="temp.password" />
        </el-form-item>
        <el-form-item v-if="dialogStatus==='create'" label="账号类型" prop="roles">
          <el-drag-select v-model="temp.roles" style="width: 300px" multiple placeholder="请选择">
            <el-option v-for="item in ableRoles" :key="item.value" :label="item.label" :value="item.value" />
          </el-drag-select>
        </el-form-item>
        <el-form-item v-if="dialogStatus==='create'" label="状态" prop="status">
          <el-select v-model="temp.status" placeholder="请选择状态" autocomplete="off">
            <el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value" />
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
    <!--  更新密码  -->
    <Dialog class="dialog-costume" title="更新密码" :visible.sync="changePassFormVisible" width="30%">
      <el-form ref="changePassForm" :model="changePassForm" label-width="80px" :rule="changePassRules">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="changePassForm.oldPassword" placeholder="请输入旧密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="changePassForm.newPassword" placeholder="请输入新密码" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changePassFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="resetPass()">确 定</el-button>
      </div>
    </Dialog>
    <!--  分配角色  -->
    <Dialog class="dialog-costume" title="分配角色" :visible.sync="roleFormVisible" width="30%">
      <el-form ref="roleForm" :model="roleForm" :rule="rolesRules" label-width="80px">
        <el-form-item label="分配角色">
          <el-drag-select v-model="roleForm.roles" style="width: 300px" multiple placeholder="请选择">
            <el-option v-for="item in ableRoles" :key="item.value" :label="item.label" :value="item.value" />
          </el-drag-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="AssignRoles">确 定</el-button>
      </div>
    </Dialog>
  </div>
</template>

<script>
import {
  getAccountList,
  addAccount,
  editAccount,
  delAccount,
  editAccountStatus,
  resetAccountPassword,
  AssignRoles,
  getRoles
} from '@/api/system/account'
import { getRoleList } from '@/api/system/role'
import ElDragSelect from '@/components/DragSelect' // base on element-ui
import permission from '@/directive/permission'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import Dialog from '@/components/Dialog/BasicDialog.vue'

import * as qiniu from 'qiniu-js'
import server from '@/api/server/oss.js'
export default {
  name: 'Account',
  components: { Pagination, ElDragSelect, Dialog },
  directives: { waves, permission },
  filters: {
    genderFilter(gender) {
      const genderMap = {
        '1': '男',
        '0': '女'
      }
      return genderMap[gender]
    },
    statusFilter(status) {
      const statusMap = {
        '0': '初始化',
        '1': '可用',
        '2': '禁用',
        '3': '关闭'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      statusOptions: [
        { value: '1', label: '可用' },
        { value: '2', label: '禁用' }
      ],
      roleForm: {
        roles: []
      },
      roleFormVisible: false,
      rolesRules: {
        roles: [{ required: true, message: '请选择角色', trigger: 'change' }]
      },
      changePassForm: {
        id: '',
        oldPassword: '',
        newPassword: ''
      },
      changePassFormVisible: false,
      changePassRules: {
        oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
        newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }]
      },
      editStatusFormVisible: false,
      editStatusRules: {
        message: [{ required: true, message: '请输入禁用原因', trigger: 'blur' }],
        action: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      editStatusOption: [
        { label: '开启', value: 'enable' },
        { label: '禁用', value: 'disable' }
      ],
      editStatusForm: {
        action: '',
        message: ''
      },
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      listQuery: {
        size: 10,
        current: 1,
        condition: {
          account: '',
          phone: '',
          status: '',
          createTimeRange: []
        },
        sortKeys: [
          {
            column: 'nickname',
            sort: 'desc'
          },
          {
            column: 'gender',
            sort: 'asc'
          }
        ]
      },
      importanceOptions: [1, 2, 3],
      titleOptions: [1, 2, 3],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      showReviewer: false,
      temp: {
        id: '',
        nickname: '',
        roles: [],
        password: '',
        username: '',
        phone: '',
        avatar: '',
        status: ''
      },
      ableRoles: [
      ],
      statusOption: [
        { label: '开启', value: '1' },
        { label: '关闭', value: '0' }
      ],
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ message: 'type is required', trigger: 'change' }],
        title: [{ message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      rolesMap: {}
    }
  },
  created() {
    this.getList()
    this.getRoles()
    this.getRoleList()
  },
  methods: {
    onUpload(uploadInfo) {
      console.log('handleUpload', uploadInfo)
      server.token().then(res => {
        const token = res.data
        const observer = {
          next(res) {
            console.log('next', res)
          },
          error(err) {
            console.log('err', err)
          },
          complete(res) {
            console.log('上传完毕', res)
            // debugger
          }
        }
        // debugger
        const observable = qiniu.upload(uploadInfo.file, uploadInfo.file.name, token, {}, {})
        const subscription = observable.subscribe(observer)
        const avatar = `http://cdn.bestwellai.com/${uploadInfo.file.name}`
        this.temp.avatar = avatar
        console.log('上传完毕111', avatar, this.temp)
        console.log('subscription', subscription, this)
      })
    },
    onRemove(file) {
      console.log(file)
    },
    getRoles() {
      getRoles().then(({ data }) => {
        console.log('getRoles', data)
        const len = data.length
        for (let i = 0; i < len; i++) {
          const item = { value: data[i].id, label: data[i].name }
          this.ableRoles.push(item)
        }
      })
    },
    getRoleList() {
      const params = { size: 10, current: 1, condition: {}}
      getRoleList(params).then(({ data }) => {
        console.log('getRoles', data)
        const len = data.list.length
        for (let i = 0; i < len; i++) {
          this.rolesMap[data.list[i].name] = data.list[i].id
        }
      })
    },
    handleAssignRoles(row) {
      const { id, roles } = row

      const res = roles.map(item => {
        return this.rolesMap[item]
      })

      this.roleForm.id = id
      this.roleForm.roles = res
      this.roleFormVisible = true

      this.$nextTick(() => {
        this.$refs['roleForm'].clearValidate()
      })
    },
    AssignRoles() {
      console.log(this.roleForm)
      const params = Object.assign({}, this.roleForm)
      AssignRoles(params).then(data => {
        console.log(data)
        this.$notify({
          message: data.message,
          type: data.success ? 'success' : 'error',
          duration: 2000
        })
        this.roleFormVisible = false
        this.getList()
        this.resetRoleForm()
      })
    },
    handleDisable(row) {
      console.log('handleDisable 🚀 ✈~', row)
      this.editStatusForm.id = row.id
      this.editStatusFormVisible = true
      this.$nextTick(() => {
        this.$refs['editStatusForm'].clearValidate()
      })
    },
    handleResetPass(row) {
      console.log('handleResetPass', row)
      this.changePassForm.id = row.id
      console.log(this.changePassForm)
      this.changePassFormVisible = true
      // 清空验证
      this.$nextTick(() => {
        this.$refs['changePassForm'].clearValidate()
      })
    },
    resetPass() {
      const params = Object.assign({}, this.changePassForm)
      console.log('params', params)
      resetAccountPassword(params).then(data => {
        this.$notify({
          message: data.message,
          type: data.success ? 'success' : 'error',
          duration: 2000
        })
        this.resetPassForm()
        this.changePassFormVisible = false
      })
    },
    getList() {
      console.log('getList 🚀 ✈~')
      this.listLoading = true
      getAccountList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    resetRoleForm(formName) {
      this.roleForm = {
        roles: []
      }
    },
    handleFilter() {
      console.log('handleFilter 🚀 ✈~')
      console.log(this.listQuery)
      this.listQuery.current = 1
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
    resetPassForm() {
      console.log('resetPassForm 🚀 ✈~')
      this.changePassForm = {
        id: '',
        oldPassword: '',
        newPassword: ''
      }
    },
    resetTemp() {
      console.log('resetTemp 🚀 ✈~')
      this.temp = {
        nickname: '',
        roles: [],
        username: '',
        phone: '',
        password: '',
        avatar: '',
        status: ''
      }
    },
    handleCreate() {
      console.log('handleCreate 🚀 ✈~')
      // 重置表单
      this.resetTemp()
      // 更改表单状态
      this.dialogStatus = 'create'
      // 显示表单
      this.dialogFormVisible = true
      // 清空验证
      this.$nextTick(() => {
        this.$refs['addAndEditForm'].clearValidate()
      })
    },
    // 重置 review表单
    resetEditStatusForm() {
      console.log('editStatusForm 🚀 ✈~')
      this.editStatusForm = {
        message: '',
        action: ''
      }
    },
    disableStatus(row) {
      console.log('disableStatus')
      console.log('row', row)
      const status = row.status !== 2 ? 'disable' : 'enable'
      const params = {
        id: row.id,
        action: status
      }
      editAccountStatus(params).then(data => {
        console.log('disableStatus', data)
        this.$notify({
          message: data.message,
          type: data.success ? 'success' : 'error',
          duration: 2000
        })
        this.getList()
      }).catch(e => {
        console.log(e)
      })
      console.log('status', status)
    },
    createData() {
      console.log('createData 🚀 ✈~')
      this.$refs['addAndEditForm'].validate((valid) => {
        if (valid) {
          this.temp.type = 4
          addAccount(this.temp).then((data) => {
            // 失败
            if (data.code === -1 || data.success === false) {
              this.$notify({
                // title: 'Success',
                message: data.message,
                type: 'error',
                duration: 2000
              })
            }
            // 成功
            this.$notify({
              message: data.message,
              type: 'success',
              duration: 2000
            })
            this.getList()
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleUpdate(row) {
      console.log('handleUpdate 🚀 ✈~', row)
      this.temp = Object.assign({}, row) // copy obj
      // 修改弹窗发状态
      this.dialogStatus = 'update'
      // 开启弹窗
      this.dialogFormVisible = true
      // 需要传一下id
      this.temp.id = row.id
      this.$nextTick(() => {
        // 清空表单验证
        this.$refs['addAndEditForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['addAndEditForm'].validate((valid) => {
        if (valid) {
          // 浅拷贝 防止造成意外bug
          const tempData = Object.assign({}, {
            username: this.temp.username,
            nickname: this.temp.nickname,
            phone: this.temp.phone,
            avatar: this.temp.avatar,
            id: this.temp.id
          })
          console.log('tempData', tempData)
          // tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          editAccount(tempData).then((data) => {
            // 失败
            if (data.code === -1 || data.success === false) {
              this.$notify({
                // title: 'Success',
                message: data.message,
                type: 'error',
                duration: 2000
              })
            }
            // 成功
            this.$notify({
              message: data.message,
              type: 'success',
              duration: 2000
            })
            this.getList()
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleDelete(row) {
      console.log('id', row.id)
      delAccount(row.id).then(data => {
        // 成功
        this.$notify({
          message: data.message,
          type: data.success ? 'success' : 'error',
          duration: 2000
        })
        this.getList()
      })
    },
    handleDownload(row) {
      console.log('handleDownload 🚀 ✈~', row)
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        // 导出表格
        const tHeader = ['id', '账号', '图标', '昵称', '联系方式', '角色', '状态']
        const filterVal = ['id', 'username', 'icon', 'nickname', 'phone', 'roles', 'status']
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
.app-container.account {
  // padding: 20px 60px;
  font-size: 14px;

  .filter-container {
    margin-bottom: 10px;
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
  .avatar {
    border-radius: 50%;
    position: absolute;
    width: 40px;
    height: 40px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    z-index: 99;
    &.plus{
      transition: .3s;
    }
    &.plus:hover{
      opacity: .5;
      transition: .3s;
    }
    &.plus:hover + i{
      opacity: 1;
    }
  }

  .avatar-container {
    width: 40px;
    height: 40px;
    position: relative;
    i {
      width: 40px;
      height: 40px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0;
    }
  }
  ::v-deep .dialog-costume{
    .cat-dialog{
      width: 400px;
      // .cat-dialog__body{
      // height: 400px;
      // overflow-y: scroll;
      // }
      .dialog-footer{
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
</style>
