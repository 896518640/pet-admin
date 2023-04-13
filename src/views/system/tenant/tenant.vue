<template>
  <div class="app-container">
    <!--  搜索  -->
    <div class="filter-container card">
      <el-form ref="form" class="searchForm" :model="listQuery" inline label-width="100px">
        <div class="form-line">
          <div class="left">
            <el-form-item label="企业名称">
              <el-input
                v-model="listQuery.condition.name"
                placeholder="请输入企业名称"
                style="width: 200px;"
                class="filter-item"
                size="small"
                @keyup.enter.native="handleFilter"
              />
            </el-form-item>
            <el-form-item label="负责人">
              <el-input
                v-model="listQuery.condition.contacts"
                placeholder="请输入负责人"
                style="width: 200px;"
                class="filter-item"
                size="small"
                @keyup.enter.native="handleFilter"
              />
            </el-form-item>
            <el-form-item label="联系方式">
              <el-input
                v-model="listQuery.condition.phone"
                placeholder="请输入联系方式"
                style="width: 200px;"
                class="filter-item"
                size="small"
                @keyup.enter.native="handleFilter"
              />
            </el-form-item>
            <el-form-item label="微信号">
              <el-input
                v-model="listQuery.condition.wx"
                placeholder="请输入微信号"
                style="width: 200px;"
                class="filter-item"
                size="small"
                @keyup.enter.native="handleFilter"
              />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input
                v-model="listQuery.condition.email"
                placeholder="请输入邮箱"
                style="width: 200px;"
                class="filter-item"
                size="small"
                @keyup.enter.native="handleFilter"
              />
            </el-form-item>
            <el-form-item label="状态">
              <el-select
                v-model="listQuery.condition.status"
                placeholder="请选择状态"
                clearable
                style="width: 150px"
                class="filter-item"
                size="small"
                @keyup.enter.native="handleFilter"
              >
                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button v-waves v-permission="['system:tenant:list']" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
              <el-button
                class="filter-item"
                style="margin-left: 10px;"
                plain
                type="primary"
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

    <!--  表格  -->
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
        <el-table-column label="ID" prop="id" sortable="custom" align="center" :class-name="getSortClass('id')">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="账号" align="center">
          <template slot-scope="{row}">
            <span>{{ row.username }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="企业名称">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="负责人" align="center">
          <template slot-scope="{row}">
            <span>{{ row.contacts }}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系方式" align="center">
          <template slot-scope="{row}">
            <span>{{ row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="微信" align="center">
          <template slot-scope="{row}">
            <span>{{ row.wx }}</span>
          </template>
        </el-table-column>
        <el-table-column label="主营业务" align="center">
          <template slot-scope="{row}">
            <span>{{ row.business }}</span>
          </template>
        </el-table-column>
        <el-table-column label="认证状态" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.status | statusFilter">
              {{ row.status| statusTextFilter }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="购买服务" align="center">
          <template slot-scope="{row}">
            <span>{{ row.services | arrayFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="330px">
          <template slot-scope="{row}">
            <el-button v-permission="['system:tenant:audit']" type="text" icon="el-icon-finished" @click="handleExamine(row)">审核</el-button>
            <el-button icon="el-icon-edit" type="text" style="margin-right: 10px" @click="handleUpdate(row)">
              编辑
            </el-button>
            <el-dropdown>
              <el-button type="text" icon="el-icon-more">更多</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <div @click="handleDisable(row)">禁用账号</div></el-dropdown-item>
                <el-dropdown-item>
                  <el-popconfirm
                    title="确定删除吗？"
                    @onConfirm="handleDelete(row)"
                  >
                    <div slot="reference" v-waves>删除</div>
                  </el-popconfirm>
                  <!--                  <span @click="handleDelete(row, $index)">删除</span>-->
                </el-dropdown-item>
                <el-dropdown-item>
                  <div @click="handleAddServer(row)">新增服务</div>
                </el-dropdown-item>
                <el-dropdown-item>
                  <div @click="handleEditServer(row)">修改服务</div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <!--   页角  -->
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.current"
        :limit.sync="listQuery.size"
        @pagination="getList"
      />
    </div>

    <!--  新增 / 修改 dialog   -->
    <Dialog class="dialog-costume" :title="textMap[addAndEditDialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"

        label-position="left"
        label-width="80px"
      >
        <el-form-item v-show="textMap[addAndEditDialogStatus]==='编辑'" label="租户id" prop="id">
          <el-input v-model="temp.id" disabled />
        </el-form-item>
        <!-- <el-form-item label="租户账号" prop="account">
          <el-input v-model="temp.account" placeholder="请输入租户账号" />
        </el-form-item> -->
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入企业名称" />
        </el-form-item>
        <el-form-item label="负责人" prop="leader">
          <el-input v-model="temp.contacts" placeholder="请输入负责人" />
        </el-form-item>
        <el-form-item label="主营业务" prop="status">
          <el-input v-model="temp.business" placeholder="请输入主营业务" />
          <!-- <el-drag-select v-model="temp.business" style="width: 300px" multiple placeholder="请选择">
            <el-option v-for="item in businessOption" :key="item.value" :label="item.value" :value="item.value" />
          </el-drag-select> -->
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="temp.phone" class="filter-item" placeholder="请输入租户手机号" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="addAndEditDialogStatus==='create'?createData():updateData()">
          提交
        </el-button>
      </div>
    </Dialog>
    <!--  审核/禁用  -->
    <Dialog class="dialog-costume" :title="reviewFormMap[reviewFormStatus]" :visible.sync="reviewFormVisible">
      <el-form ref="reviewForm" :model="reviewForm" :rules="reviewRules" label-width="80px">
        <el-form-item :label="reviewFormStatus === 'review'?'审核结果':'是否禁用'" prop="action">
          <template v-if="reviewFormStatus === 'review'">
            <el-select v-model="reviewForm.action" placeholder="请选择审核结果" autocomplete="off">
              <el-option v-for="item in reviewOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </template>
          <template v-if="reviewFormStatus !== 'review'">
            <el-select v-model="reviewForm.action" placeholder="请选择禁用状态" autocomplete="off">
              <el-option v-for="item in disableOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </template>
        </el-form-item>
        <el-form-item :label="reviewFormStatus === 'review'?'审核意见':'禁用原因'" prop="message">
          <el-input
            v-model="reviewForm.message"
            type="textarea"
            :rows="2"
            :placeholder="reviewFormStatus === 'review'?'请输入审核意见':'请输入禁用原因'"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reviewFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="reviewFormStatus === 'review'?ReviewStatus():DisableStatus() ">确 定</el-button>
      </div>
    </Dialog>
    <!--  新增/修改服务  -->
    <Dialog class="dialog-costume" :title="serverFormMap[serverFormStatus]" :visible.sync="serverFormVisible">
      <el-form ref="serverForm" :model="serverForm" :rules="serverRules" label-width="80px">
        <el-form-item label="服务列表" prop="server">
          <el-drag-select v-model="serverForm.server" style="width: 300px" multiple placeholder="请选择">
            <el-option v-for="item in serverOptions" :key="item" :label="item" :value="item" />
          </el-drag-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="serverFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="serverFormStatus === 'add'?AddServer():EditServer() ">确 定</el-button>
      </div>
    </Dialog>
  </div>
</template>

<script>
import {
  getTenantList,
  editTenantStatus,
  addTenant,
  editTenant,
  delTenant,
  addTenantServer,
  editTenantServer
} from '@/api/system/tenant'
import ElDragSelect from '@/components/DragSelect' // base on element-ui
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import Dialog from '@/components/Dialog/BasicDialog.vue'
import permission from '@/directive/permission/index.js'
export default {
  name: 'Tenant',
  components: { Pagination, ElDragSelect, Dialog },
  directives: { waves, permission },
  filters: {
    // 将状态 过滤为 => 类名
    statusFilter(status) {
      const statusMap = {
        '-1': 'danger',
        '0': 'primary',
        '1': 'info',
        '2': 'warning',
        '3': 'success',
        '4': 'warning',
        '5': 'danger'
      }
      return statusMap[status]
    },
    // 将状态过滤为 => 文字
    statusTextFilter(status) {
      const statusMap = {
        '-1': '已注销',
        '0': '等待提交审核',
        '1': '等待系统审核',
        '2': '系统审核中',
        '3': '通过系统审核',
        '4': '系统审核未通过'
      }
      return statusMap[status]
    },
    // 将数组过滤
    arrayFilter(array) {
      if (Array.isArray(array)) {
        return array.join('、')
      }
      return array
    }
  },
  data() {
    return {
      serverForm: {
        server: [],
        id: ''
      },
      serverRules: {
        server: [{ required: true, message: '请输入...', trigger: 'blur' }]
      },
      serverFormVisible: false,
      serverOptions: [
        '交易服务', '商家服务'
      ],
      serverFormStatus: '',
      serverFormMap: {
        add: '新增服务',
        edit: '修改服务'
      },
      reviewForm: {
        message: '',
        action: ''
      },
      reviewRules: {
        message: [{ required: true, message: '请输入修改意见', trigger: 'blur' }],
        action: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      reviewFormVisible: false,
      reviewOptions: [
        { label: '开始审核', value: 'audit' },
        { label: '通过审核', value: 'pass' },
        { label: '未通过审核', value: 'reject' }
      ],
      disableOptions: [
        { label: '禁用', value: 'disable' },
        { label: '解禁', value: 'able' }
      ],
      reviewFormStatus: '',
      reviewFormMap: {
        review: '审核',
        disable: '禁用'
      },
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        current: 1, // 当前页数
        size: 10, // 数据个数
        // status: 1, // 已注册
        condition: {},
        sortKey: [{
          column: 'create_time',
          sort: 'desc'
        }] // 按照create_time`字段倒序排列
      },
      importanceOptions: [1, 2, 3],
      statusOptions: [
        {
          label: '已注销',
          value: -1
        },
        {
          label: '等待提交审核',
          value: 0
        },
        {
          label: '等待系统审核',
          value: 1
        },
        {
          label: '系统审核中',
          value: 2
        },
        {
          label: '通过系统审核',
          value: 3
        },
        {
          label: '系统审核未通过',
          value: 4
        }
      ],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      showReviewer: false,
      temp: {
        id: undefined,
        account: '',
        name: '',
        timestamp: new Date(),
        leader: '',
        business: [],
        phone: 17605589076
      },
      businessOption: [
        { value: '宠物洗护' },
        { value: '宠物主粮' },
        { value: '宠物酒店' }
      ],
      dialogFormVisible: false,
      addAndEditDialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      dialogPvVisible: true,
      pvData: [],
      rules: {
        type: [{ message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', message: 'timestamp is required', trigger: 'change' }],
        title: [{ message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 分页功能
    getList() {
      console.log('getList 🚀 ✈~')
      this.listLoading = true
      getTenantList(this.listQuery)
        .then(res => {
          console.log('list', res.data)
          this.list = res.data.list
          this.total = res.data.total
          this.listLoading = false
        })
    },
    // 审核
    ReviewStatus() {
      console.log('ReviewStatus')
      this.$refs['reviewForm'].validate((valid) => {
        if (valid) {
          const params = Object.assign({}, this.reviewForm)
          editTenantStatus(params)
            .then(({ data }) => {
              this.list.forEach((item) => {
                if (item.id === params.id) {
                  item.status = params.action === 'reviewed' ? 3 : 4
                  console.log(params)
                  console.log(item)
                  this.$notify({
                    title: 'Success',
                    message: 'Update Successfully',
                    type: 'success',
                    duration: 2000
                  })
                  this.reviewFormVisible = false
                  this.getList()
                  this.resetReview()
                }
              })
            })
            .catch(e => {
              console.log(e)
            })
        }
      })
    },
    // 禁用
    DisableStatus() {
      console.log('DisableStatus')
      this.$refs['reviewForm'].validate((valid) => {
        if (valid) {
          const params = Object.assign({}, this.reviewForm)
          editTenantStatus(params)
            .then(({ data }) => {
              this.list.forEach((item) => {
                if (item.id === params.id) {
                  item.status = params.action === 'disable' ? 5 : 0
                  this.$notify({
                    title: 'Success',
                    message: 'Update Successfully',
                    type: 'success',
                    duration: 2000
                  })
                  this.reviewFormVisible = false
                  this.getList()
                  this.resetReview()
                }
              })
            })
            .catch(e => {
              console.log(e)
            })
        }
      })
    },
    // 搜索功能
    handleFilter() {
      console.log('handleFilter 🚀 ✈~')
      this.listQuery.current = 1
      this.getList()
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
    // 重置编辑 / 新增表单
    resetTemp() {
      console.log('resetTemp 🚀 ✈~')
      this.temp = {
        id: undefined,
        account: '',
        name: '',
        timestamp: new Date(),
        leader: '',
        business: [],
        phone: ''
      }
    },
    // 重置 review表单
    resetReview() {
      console.log('resetReview 🚀 ✈~')
      this.reviewForm = {
        message: '',
        action: ''
      }
    },
    resetServer() {
      this.serverForm = {
        id: '',
        server: []
      }
    },
    // 新增租户
    handleCreate() {
      console.log('handleCreate 🚀 ✈~')
      this.resetTemp()
      this.addAndEditDialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 创建一个新的数据
    createData() {
      console.log('createData 🚀 ✈~')
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // 模拟 id
          this.temp.server = ['交易管理'] // 模拟 server
          this.temp.status = 0 // 模拟 status
          console.log('updateData', this.temp)
          addTenant(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '添加成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      console.log('handleUpdate 🚀 ✈~', row)
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.addAndEditDialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // 需要浅拷贝一下 取消引用关系
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          console.log('updateData', tempData)
          editTenant(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    // 删除~
    handleDelete(row, index) {
      console.log('handleDelete', row, index)
      delTenant(row).then(data => {
        this.$notify({
          title: 'Success',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      }).catch(e => {
        console.log(e)
      })
    },
    handleExamine(row) {
      console.log('handleExamine 🚀~~', row)
      // 将id 传过去
      this.reviewForm.id = row.id
      this.reviewFormVisible = true
      this.reviewFormStatus = 'review'
      this.$nextTick(() => {
        this.$refs['reviewForm'].clearValidate()
      })
    },
    handleDisable(row) {
      console.log('handleDisable 🚀 ✈~', row)
      this.reviewForm.id = row.id
      this.reviewFormVisible = true
      this.reviewFormStatus = 'disable'
      this.$nextTick(() => {
        this.$refs['reviewForm'].clearValidate()
      })
    },
    handleAddServer(row) {
      console.log('handleAddServer 🚀~~', row)
      // 将id 传过去
      this.resetServer()
      this.serverForm.id = row.id
      this.serverFormVisible = true
      this.serverFormStatus = 'add'
      this.$nextTick(() => {
        this.$refs['serverForm'].clearValidate()
      })
    },
    handleEditServer(row) {
      console.log('handleEditServer 🚀 ✈~', row)
      this.serverForm.id = row.id
      this.serverForm.server = row.server || []
      this.serverFormVisible = true
      this.serverFormStatus = 'edit'
      this.$nextTick(() => {
        this.$refs['serverForm'].clearValidate()
      })
    },
    AddServer() {
      console.log('AddServer')
      this.$refs['serverForm'].validate((valid) => {
        if (valid) {
          const params = Object.assign({}, this.serverForm)
          addTenantServer(params)
            .then(({ data }) => {
              console.log(data)
              this.$notify({
                title: 'Success',
                message: 'Update Successfully',
                type: 'success',
                duration: 2000
              })
              console.log('params', params)
              this.list.forEach(item => {
                if (item.id === params.id) {
                  console.log(...params.server)
                  item.server.push(...params.server)
                }
              })
              this.serverFormVisible = false
            })
            .catch(e => {
              console.log(e)
            })
        }
      })
    },
    EditServer() {
      console.log('EditServer')
      this.$refs['serverForm'].validate((valid) => {
        if (valid) {
          const params = Object.assign({}, this.serverForm)
          editTenantServer(params)
            .then(({ data }) => {
              console.log(data)
              this.$notify({
                title: 'Success',
                message: 'Update Successfully',
                type: 'success',
                duration: 2000
              })
              this.list.forEach(item => {
                if (item.id === params.id) {
                  item.server = [...params.server]
                }
              })
              this.serverFormVisible = false
            })
            .catch(e => {
              console.log(e)
            })
        }
      })
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
