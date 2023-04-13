<template>
  <div class="app-container">
    <div class="filter-container card">
      <el-form ref="listQuery" :model="listQuery" inline label-width="80px">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="listQuery.condition.name" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="负责人" prop="leader">
          <el-input v-model="listQuery.condition.leader" placeholder="请输入负责人" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
          <el-button type="primary" icon="el-icon-plus" plain @click="handleCreate">新增</el-button>
          <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="doctorTable card">
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        width="3000px"
        :data="list"
        header-cell-class-name="table-header"
        cell-class-name="table-cell"
        highlight-current-row
        style="width: 100%;"
        @sort-change="sortChange"
      >
        <el-table-column v-for="(item,index) in tableData" :key="index" :label="item.label" :min-width="item.width">
          <template slot-scope="{row}">
            <!--  渲染状态 -->
            <el-tag v-if="item.prop==='status'" :type="row.status | statusFilter">
              {{ row.status | statusFilter }}
            </el-tag>
            <div v-else-if="item.prop==='icon'">
              <img class="avatar" width="50" height="50" :src="row.icon" alt="">
            </div>
            <!--   其他属性   -->
            <span v-else>{{ row[item.prop] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width" width="220px">
          <template slot-scope="{row}">
            <el-button icon="el-icon-edit" type="text" @click="handleUpdate(row)">编辑</el-button>
            <el-button icon="el-icon-view" type="text" style="margin-right: 10px" @click="handleDetail(row)">
              详情
            </el-button>
            <el-dropdown>
              <el-button icon="el-icon-more" type="text">更多</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item class="drop-menu">
                  <el-popconfirm
                    title="确定删除吗？"
                    @onConfirm="handleDelete(row)"
                  >
                    <div slot="reference">删除</div>
                  </el-popconfirm>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div @click="handleEmployee(row)">部门员工</div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div @click="handleAddEmployee(row)">新增员工</div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :current.sync="listQuery.current" :size.sync="listQuery.size" @pagination="getList" />
    </div>

    <Dialog class="dialog-costume card" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="30%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="部门图标" prop="icon" width="50%">
          <el-upload
            class="upload-demo"
            action="cdn.bestwellai.com"
            :http-request="onUpload"
            :show-file-list="false"
            :on-remove="onRemove"
          >
            <div v-if="temp.icon" class="avatar-container">
              <img class="avatar plus" :src="temp.icon" width="50" height="50" alt="">
              <i class="el-icon el-icon-plus" />
            </div>
            <el-button v-else size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="负责人" prop="leader">
          <el-input v-model="temp.leader" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="部门简介" prop="description">
          <el-input v-model="temp.description" type="textarea" placeholder="请输入" />
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
    <!--   详情   -->
    <Dialog class="detail-dialog dialog-costume card" width="500px" :title="detailDialogMap[detailDialogStatus]" :visible.sync="departmentFormVisible">
      <div v-if="detailDialogStatus==='department'" class="detail-container detail">
        <el-row :gutter="20">
          <el-col v-for="(item) in Object.keys(departmentDetailForm)" :key="item" :span="12">
            <div v-if="item==='icon'" class="grid-content bg-purple" style="display: flex">
              <span class="label">{{ item | detailFilter }}:</span>
              <img v-if="departmentDetailForm[item]" class="avatar" width="50" height="50" :src="departmentDetailForm[item]" alt="">
              <div v-else>无</div>
            </div>
            <div v-else-if="item==='status'" class="grid-content bg-purple">
              <span class="label">{{ item | detailFilter }}:</span>
              <span class="content">{{ departmentDetailForm[item] | statusFilter }}</span>
            </div>
            <div v-else class="grid-content bg-purple">
              <span class="label">{{ item | detailFilter }}:</span>
              <span class="content">{{ departmentDetailForm[item] }}</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-else-if="detailDialogStatus==='addEmployee'" class="detail-container">
        新增部门员工
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="departmentFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="detailDialogStatus==='department'?(departmentFormVisible= false):handleConfirmAddEmployee()">确 定</el-button>
      </div>
    </Dialog>

    <Dialog class="dialog-costume dialog-add card" width="30%" top="100px" :visible.sync="visible">
      <template v-slot:title>
        <h4> 新增员工 </h4>
      </template>
      <template>
        <el-form ref="tempForm" inline label-width="80px" class="tempForm">
          <!-- 新增 -->
          <el-form-item label="当前部门">
            {{ dialogForm.name }}
          </el-form-item>
          <el-form-item label="部门员工">
            <el-drag-select v-model="dialogForm.employeeIds" multiple placeholder="请选择">
              <el-option v-for="item in doctorMap" :key="item.value" :label="item.label" :value="item.value" />
            </el-drag-select>
          </el-form-item>
        </el-form>
      </template>
      <template v-slot:footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="onConfirm('addEmployee')">确定</el-button>
      </template>
    </Dialog>
  </div>
</template>

<script>
import api from '@/api/merchant/department'
import employee from '@/api/merchant/employee'
import tableData from './config'
import ElDragSelect from '@/components/DragSelect'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import server from '@/api/server/oss.js'
import * as qiniu from 'qiniu-js'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Dialog from '@/components/Dialog/BasicDialog.vue'
export default {
  name: 'DepartmentManagement',
  components: { Pagination, Dialog, ElDragSelect },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        '0': '开启',
        '-1': '已删除'
      }
      return statusMap[status]
    },
    detailFilter(key) {
      const detailMap = {
        id: 'id',
        createTime: '创建时间',
        description: '描述',
        employees: '员工',
        icon: '图标',
        leader: '负责人',
        name: '部门名称',
        status: '状态',
        sort: '排序',
        tenantId: '租户id',
        updateTime: '更新时间'
      }
      return detailMap[key]
    }
  },
  data() {
    return {
      dialogForm: {
        departmentId: '',
        employeeIds: []
      },
      visible: false,
      detailDialogStatus: '',
      detailDialogMap: {
        employee: '员工详情',
        department: '部门信息详情'
      },
      departmentFormVisible: false,
      departmentDetailForm: {},
      employeeListForm: [],
      typeOptions: [
        {
          label: '医院',
          value: 1
        },
        {
          label: '宠物店',
          value: 2
        }
      ],
      statusOptions: [
        {
          label: '开启',
          value: 0
        },
        {
          label: '关闭',
          value: 1
        }
      ],
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: false,
      tableData,
      listQuery: {
        current: 1,
        size: 20,
        condition: {
          name: '',
          leader: ''
        },
        sortKeys: []
      },
      importanceOptions: [1, 2, 3],
      titleOptions: [1, 2, 3],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      showReviewer: false,
      temp: {

      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑部门',
        create: '创建部门'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {},
      downloadLoading: false,
      doctorMap: [],
      departmentMap: []
    }
  },
  created() {
    this.getList()
    this.getEmployee()
  },
  methods: {
    getEmployee() {
      const params = {
        current: 1,
        size: 20,
        condition: {},
        sortKeys: []
      }
      employee.employee(params).then(res => {
        this.doctorMap = res.data.list.map(item => {
          return {
            label: item.name,
            value: item.id
          }
        })
      })
    },
    onConfirm(type) {
      if (type === 'addEmployee') {
        console.log(this.dialogForm)
        const params = Object.assign({}, {
          departmentId: this.dialogForm.departmentId,
          employeeIds: this.dialogForm.employeeIds
        })
        api.addEmployee(params).then(res => {
          console.log('res', res)
          this.visible = false
          this.$notify({
            message: res.message,
            type: res.success ? 'success' : 'error',
            duration: 2000
          })
        })
      }
    },
    handleReset() {
      this.listQuery = { current: 1,
        size: 20,
        condition: {
          name: '',
          leader: ''
        },
        sortKeys: [] }
      this.getList()
    },
    handleConfirmAddEmployee(params) {
      api.addEmployee(params).then(data => {
        this.departmentFormVisible = false
        console.log('新增下级部门成功', data)
        this.$notify({
          title: 'Success',
          message: '新增商家部门成功',
          type: 'success',
          duration: 2000
        })
      })
    },
    // 跳转到员工页面获取员工列表
    handleEmployee(row) {
      console.log('handleEmployee', row)
      this.$router.push({
        path: '/merchant/doctor',
        query: {
          departmentId: row.id
        }
      })
    },
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
          }
        }
        const observable = qiniu.upload(uploadInfo.file, uploadInfo.file.name, token, {}, {})
        observable.subscribe(observer)
        const icon = `http://cdn.bestwellai.com/${uploadInfo.file.name}`
        this.temp.icon = icon
      })
    },
    onRemove(file) {
      console.log(file)
    },
    handleAddEmployee(row) {
      this.visible = true
      this.dialogForm = {
        departmentId: '',
        employeeIds: []
      }
      this.dialogForm.departmentId = row.id
      this.dialogForm.name = row.name
    },
    //  清空表单通用方法
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleDetail(row) {
      console.log('详情', row)
      this.detailDialogStatus = 'department'
      const id = row?.id
      if (!id) {
        return this.$message({
          message: '数据异常',
          type: 'error'
        })
      }
      api.detail(id).then(data => {
        const { name, leader, icon, description, status } = data.data
        this.departmentDetailForm = {
          name, leader, icon, description, status
        }
        this.departmentFormVisible = true
      }).catch(e => {
        console.log(e)
      })
    },
    getList() {
      console.log('getList 🚀 ✈~')
      this.listLoading = true
      const params = Object.assign({}, this.listQuery)
      api.department(params).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
        this.resetForm('listQuery')
      })
    },
    handleFilter() {
      console.log('搜索啦 🚀', this.listQuery)
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
    handleCreate() {
      console.log('handleCreate 🚀 ✈~')
      this.temp = {
        icon: ''
      }
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      console.log('createData 🚀 ✈~')
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const params = Object.assign({}, this.temp)
          api.add(params).then((res) => {
            // 真实接口
            this.getList()
            // 关闭弹窗
            this.dialogFormVisible = false
            // 重置表单
            this.resetForm('dataForm')
            // 消息提示
            this.$notify({
              title: 'Success',
              message: res?.message,
              type: res?.success ? 'success' : 'error',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpload() {
      console.log('handleUpload')
    },
    handleBeforeUpload(file) {
      console.log('handleBeforeUpload', file)
      const fd = new FormData()
      fd.append(file, 'utf-8')
    },
    handleUpdate(row) {
      console.log('handleUpdate 🚀 ✈~', row)
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const params = Object.assign({}, this.temp)

          api.edit(params).then((res) => {
            this.dialogFormVisible = false
            // 重置表单
            this.resetForm('dataForm')
            this.getList()
            this.$notify({
              title: 'Success',
              message: res?.message,
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      api.del(row.id).then(data => {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    handleDisable(row) {
      console.log('禁用 🚀 ✈~', row)
    },
    handleMore(row) {
      console.log('handleMore 🚀 ✈~', row)
    },
    handleDownload(row) {
      console.log('handleDownload 🚀 ✈~', row)
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        // 导出表格
        const tHeader = ['注册时间', '职称', '姓名', '状态', '部门', '手机号']
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
  width: 100%;
  // padding: 20px 40px;

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

      .el-input, .drag-select,.el-select, .el-date-editor {
        flex: 1;
        height: 36px;
        margin: 0;
      }
    }
  }
  >>> .el-card__body {
    padding: 10px;
  }

  ::v-deep .el-form.tempForm{
    background: #fff;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    .el-form-item{
      width: 100%;
      display: flex;
      justify-content: center;
      .el-form-item__label{
        width: 100px;
      }
      .el-form-item__content{
        // flex:1;
        width: 176px;
        .el-date-editor{
          width: 100%;
        }
        .drag-select{
          width: 100%;
        }
        .el-checkbox-group{
          display: flex;
          flex-wrap: wrap;
          .el-checkbox{
            margin-right: 11px;
            .el-checkbox__label{
              padding-left: 5px;
            }
          }
        }
      }
    }
  }
  // table -end
  .detail-dialog{
    //width: 500px;
    ::v-deep  .el-dialog__body{
      padding: 0;
    }
    .detail-container {
      .grid-content{
        display: flex;
        width: 230px;
        padding: 10px 15px;
        align-items: center;
        .label{
          width: 110px;
          padding: 10px;
          height: 47px;
          display: flex;
          align-items: center;
          font-size: 16px;
          line-height: 47px;
          color: #666;
        }
        .content{
          display: flex;
          align-items: center;
          justify-content: center;
          height: 47px;
          width: 130px;
          font-weight: 100;
          font-size: 16px;
          color: #666;
        }
      }
    }
  }

  ::v-deep .dialog-costume{
    .cat-dialog{
      width: 400px;
      .cat-dialog__body{
      height: 300px;
      overflow-y: scroll;
      }
      .dialog-footer{
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
    }
    &.dialog-add {
      .cat-dialog__body{
        height: 150px;
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

}
</style>
