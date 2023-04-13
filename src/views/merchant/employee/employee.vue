<template>
  <div class="app-container">
    <!-- 搜索 -->
    <div class="filter-container card">
      <el-form ref="listQuery" :model="listQuery" inline label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="listQuery.condition.name" placeholder="请输入员工姓名" />
        </el-form-item>
        <el-form-item label="职称" prop="title">
          <el-select v-model="listQuery.condition.title" placeholder="请选择职称">
            <el-option
              v-for="item in titleMap"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="telephone">
          <el-input v-model="listQuery.condition.telephone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="部门" prop="departmentId">
          <el-select v-model="listQuery.condition.departmentId" placeholder="请选择部门">
            <el-option
              v-for="item in searchDepMap"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="注册时间" prop="create_time">
          <el-date-picker
            v-model="listQuery.condition.create_time"
            class="date-picker"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始"
            end-placeholder="结束"
          />
        </el-form-item>
        <el-form-item>
          <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
          <el-button v-waves type="primary" icon="el-icon-plus" plain @click="handleCreate">新增</el-button>
          <el-button v-waves icon="el-icon-refresh" plain @click="handleReset">重置</el-button>
        </el-form-item>

      </el-form>
    </div>

    <!-- 表格 -->
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
            <!-- 头像 -->
            <div v-else-if="item.prop==='avatar'" class="avatar">
              <img class="avatar" :src="row.avatar" width="50" height="50" alt="">
            </div>
            <!-- 科室 -->
            <div v-else-if="item.prop==='department'">
              <el-tag v-for="(dep,i) in row.department" :key="i" style="margin-right:10px" type="success"> {{ dep.name }}</el-tag>
            </div>
            <!--   其他属性   -->
            <span v-else>{{ row[item.prop] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width" width="220px">
          <template slot-scope="{row}">
            <el-button icon="el-icon-edit" type="text" @click="handleUpdate(row)">编辑</el-button>
            <el-button icon="el-icon-view" type="text" style="margin-right:10px" @click="handleDetail(row)">
              详情
            </el-button>
            <el-popconfirm
              title="确定删除吗？"
              @onConfirm="handleDelete(row)"
            >
              <el-button slot="reference" icon="el-icon-delete" type="text">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <pagination v-show="total>0" :total="total" :current.sync="listQuery.current" :size.sync="listQuery.size" @pagination="getList" />
    </div>

    <!-- 弹窗 -->
    <Dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" class="dialog-costume" width="600px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="姓名" prop="name" width="50%">
                <el-input v-model="temp.name" placeholder="请输入员工姓名" />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="个人头像" prop="avatar" width="50%">
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
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="手机号" prop="telephone">
                <el-input v-model="temp.telephone" />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="职称" prop="title">
                <el-input v-model="temp.title" />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="所属科室" prop="departmentId">
                <el-select v-model="temp.departmentId" placeholder="请选择科室">
                  <el-option
                    v-for="item in departmentMap"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="状态" prop="status">
                <!-- <el-input v-model="temp.status" /> -->
                <el-select v-model="temp.status" placeholder="请选择状态">
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="grid-content bg-purple">
              <el-form-item label="个人简介" prop="description">
                <el-input v-model="temp.description" type="textarea" placeholder="请输入" />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="24">
            <div class="grid-content bg-purple">
              <el-form-item label="附加信息" class="additionInfo">
                <div v-for="(i,index) in additionLength" :key="index" class="select-item">
                  <el-select v-model="additionData[index].key" placeholder="请选择" @change="onChange">
                    <el-option
                      v-for="item in additionMap"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <el-input v-model="additionData[index].value" type="text" placeholder="请输入" @blur="onBlur" />
                  <i class="el-icon-remove-outline" @click="delInfo(index)" />
                </div>
                <i class="el-icon-circle-plus-outline" @click="addInfo" />
              </el-form-item>
            </div>
          </el-col>
        </el-row>
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
    <Dialog class="detail-dialog dialog-costume" width="500px" :title="detailDialogMap[detailDialogStatus]" :visible.sync="departmentFormVisible">
      <div v-if="detailDialogStatus==='department'" class="detail-container detail">
        <el-row :gutter="20">
          <el-col v-for="(item) in Object.keys(departmentDetailForm)" :key="item" :span="12">
            <div v-if="item==='gender'" class="grid-content bg-purple">
              <span class="label">{{ item | detailFilter }}:</span>
              <span class="content">{{ departmentDetailForm[item]===0?'男':'女' }}</span>
            </div>
            <div v-else-if="item==='department'" class="grid-content bg-purple">
              <span class="label">{{ item | detailFilter }}:</span>
              <span class="content">{{ departmentDetailForm[item].name }}</span>
            </div>
            <div v-else-if="item==='status'" class="grid-content bg-purple">
              <span class="label">{{ item | detailFilter }}:</span>
              <span class="content">{{ departmentDetailForm[item] | statusFilter }}</span>
            </div>
            <div v-else-if="item==='avatar'" class="grid-content bg-purple" style="display: flex">
              <span class="label">{{ item | detailFilter }}:</span>
              <img v-if="departmentDetailForm[item]" class="avatar" width="50" height="50" :src="departmentDetailForm[item]" alt="">
              <div v-else>无</div>
            </div>
            <!-- 额外信息-->
            <div v-else-if="item==='additionInfo'" class=" add-info grid-content bg-purple">
              <template v-if="!departmentDetailForm[item]" />
              <template v-else>
                <div v-for="(key, index) in departmentDetailForm[item]" :key="index">
                  <span class="label">{{ index | additionFilter }}:</span>
                  <span class="content">{{ key }}</span>
                </div>
              </template>
            </div>
            <div v-else class="grid-content bg-purple">
              <span class="label">{{ item | detailFilter }}:</span>
              <span class="content">{{ departmentDetailForm[item] }}</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="departmentFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="departmentFormVisible = false">确 定</el-button>
      </div>
    </Dialog>
  </div>
</template>

<script>
import api from '@/api/merchant/employee'
import department from '@/api/merchant/department'
import server from '@/api/server/oss.js'

import tableData from './config'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'

import Dialog from '@/components/Dialog/BasicDialog.vue'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

import * as qiniu from 'qiniu-js'

export default {
  name: 'EmployeeManagement',
  components: { Pagination, Dialog },
  directives: { waves },
  filters: {
    departmentFilter(obj) {
      return obj.label
    },
    additionFilter(key) {
      const map = {
        hospital: '医院',
        workYears: '从医时长',
        diseaseTags: '擅长疾病',
        averageTime: '平均等待时间',
        visitNum: '接诊次数',
        loveValue: '爱心值',
        picturePrice: '图文问诊价格',
        pictureTimes: '图文问诊次数',
        phonePrice: '图文问诊价格',
        phoneTime: '电话问诊时间',
        certificateNumber: '执业编号'
      }
      return map[key]
    },
    statusFilter(status) {
      const statusMap = {
        '0': '开启',
        '1': '关闭'
      }
      return statusMap[status]
    },
    detailFilter(key) {
      const detailMap = {
        id: 'id',
        createTime: '创建时间',
        description: '描述',
        employees: '员工',
        telephone: '手机号',
        experience: '工作年限',
        avatar: '头像',
        gender: '性别',
        icon: '图标',
        leader: '负责人',
        name: '名称',
        status: '状态',
        sort: '排序',
        tenantId: '租户id',
        title: '职称',
        updateTime: '更新时间',
        department: '所属部门'
      }
      return detailMap[key]
    }
  },
  data() {
    return {
      detailDialogStatus: '',
      detailDialogMap: {
        employee: '员工详情',
        department: '科室信息详情'
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
      titleMap: [
        {
          label: '科长',
          value: 1
        },
        {
          label: '首长',
          value: 2
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
          title: '',
          telephone: '',
          create_time: ['', ''],
          departmentId: ''
        },
        sort: []
      },
      additionInfo: {
        hospital: '',
        workYears: '',
        diseaseTags: '',
        averageTime: '',
        visitNum: '',
        loveValue: '',
        picturePrice: '',
        pictureTimes: '',
        phonePrice: '',
        phoneTime: '',
        certificateNumber: ''
      },
      additionData: [
        {
          key: '',
          value: ''
        }
      ],
      additionLength: 1,
      additionMap: [],
      importanceOptions: [1, 2, 3],
      titleOptions: [1, 2, 3],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      showReviewer: false,
      temp: {},
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改员工',
        create: '新增员工'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {},
      downloadLoading: false,
      searchDepMap: [{
        label: '全部',
        value: ''
      }],
      departmentMap: []
    }
  },
  async created() {
    await this.getDepartmentList()
    const departmentId = this.$route.query.departmentId
    if (departmentId) {
      this.listQuery.condition.departmentId = departmentId
    }
    this.getList()
    this.onReset()
  },
  methods: {
    // 失去焦点进行校验
    onBlur(e) {
      if (e.target.value.trim().length <= 0) {
        this.$message({
          message: '请把表格补充完整'
        })
      }
    },
    delInfo(index) {
      this.additionLength -= 1
      this.additionData.splice(index, 1)
    },
    // 切换去重
    onChange(value) {
      console.log('onchange', value)
      const allMap = [{
        label: '医院',
        value: 'hospital'
      },
      {
        label: '从医时长',
        value: 'workYears'
      },
      {
        label: '擅长疾病',
        value: 'diseaseTags'
      },
      {
        label: '平均等待时间',
        value: 'averageTime'
      },
      {
        label: '接诊次数',
        value: 'visitNum'
      },
      {
        label: '爱心值',
        value: 'loveValue'
      },
      {
        label: '图文问诊价格',
        value: 'picturePrice'
      },
      {
        label: '图文问诊次数',
        value: 'pictureTimes'
      },
      {
        label: '图文问诊价格',
        value: 'phonePrice'
      },
      {
        label: '电话问诊时间',
        value: 'phoneTime'
      },
      {
        label: '执业编号',
        value: 'certificateNumber'
      }]
      const list = [...this.additionData]
      list.forEach(item => {
        const index = allMap.findIndex(i => i.value === item.key)
        if (index !== -1) {
          allMap.splice(index, 1)
          this.additionMap = allMap
        }
      })
    },
    // 新增信息
    addInfo() {
      this.additionLength += 1
      this.additionData.push({
        key: '',
        value: ''
      })
    },
    // 获取下拉配置
    async getDepartmentList() {
      const params = {
        current: 1,
        size: 9999,
        condition: {
        },
        sortKeys: []
      }
      const depRes = await department.department(params)
      depRes.data.list.forEach(item => {
        const dep = {
          label: item.name,
          value: item.id
        }
        this.searchDepMap.push(dep)
        this.departmentMap.push(dep)
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
        const avatar = `http://cdn.bestwellai.com/${uploadInfo.file.name}`
        this.temp.avatar = avatar
      })
    },
    onRemove(file) {
      console.log(file)
    },
    //  清空表单通用方法
    resetForm(formName) {
      this.$refs[formName]?.resetFields()
    },
    handleDetail(row) {
      console.log('详情', row)
      this.detailDialogStatus = 'department'
      const id = row.id
      api.detail(id).then(data => {
        const { additionInfo, name, status, avatar, gender, telephone, description, title, department } = data.data
        this.departmentDetailForm = {
          name, status, avatar, gender, telephone, description, title, department
        }
        if (additionInfo) {
          this.departmentDetailForm.additionInfo = JSON.parse(additionInfo)
        } else {
          this.departmentDetailForm.additionInfo = {}
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
      api.employee(params).then(response => {
        this.listLoading = false
        this.list = response.data.list
        this.total = response.data.total
        this.resetForm('listQuery')
      })
    },
    handleReset() {
      this.listQuery = { current: 1,
        size: 20,
        condition: {
          name: '',
          title: '',
          telephone: '',
          create_time: ['', '']
        },
        sort: []
      }
      this.getList()
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
    // 重置addition
    onReset() {
      this.additionMap = [
        {
          label: '医院',
          value: 'hospital'
        },
        {
          label: '从医时长',
          value: 'workYears'
        },
        {
          label: '擅长疾病',
          value: 'diseaseTags'
        },
        {
          label: '平均等待时间',
          value: 'averageTime'
        },
        {
          label: '接诊次数',
          value: 'visitNum'
        },
        {
          label: '爱心值',
          value: 'loveValue'
        },
        {
          label: '图文问诊价格',
          value: 'picturePrice'
        },
        {
          label: '图文问诊次数',
          value: 'pictureTimes'
        },
        {
          label: '图文问诊价格',
          value: 'phonePrice'
        },
        {
          label: '电话问诊时间',
          value: 'phoneTime'
        },
        {
          label: '执业编号',
          value: 'certificateNumber'
        }
      ]
      this.additionLength = 1
      this.additionData = [
        {
          key: '',
          value: ''
        }
      ]
    },
    handleCreate() {
      console.log('handleCreate 🚀 ✈~')
      this.temp = {
        map_address: [],
        pictures: [],
        avatar: ''
      }
      this.dialogStatus = 'create'
      this.onReset()
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      console.log('createData 🚀 ✈~')
      const addData = [...this.additionData]
      const obj = {}
      addData.forEach(item => {
        obj[item.key] = item.value
      })
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const params = Object.assign({}, {
            ...this.temp,
            additionInfo: JSON.stringify(obj)
          })
          api.add(params).then((res) => {
            this.getList()
            this.dialogFormVisible = false
            this.resetForm('dataForm')
            this.onReset()
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      console.log('handleUpdate', row)
      this.onReset()
      let additionInfo
      if (row.additionInfo) {
        additionInfo = JSON.parse(row.additionInfo)
        this.additionData = []
        this.additionLength = 0
        for (const key in additionInfo) {
          this.additionData.push({
            key: key,
            value: additionInfo[key]
          })
          this.additionLength += 1
        }
      } else {
        additionInfo = {}
      }

      const temp = Object.assign({},
        {
          id: row.id,
          name: row.name,
          leader: row.leader,
          avatar: row.avatar,
          telephone: row.telephone,
          description: row.description,
          sort: row.sort,
          departmentId: row.departmentId,
          title: row.title,
          status: row.status
        }
      )
      this.temp = temp
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      const addData = [...this.additionData]
      const obj = {}
      addData.forEach(item => {
        obj[item.key] = item.value
      })
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log('valid', valid)
          const params = Object.assign({}, {
            id: this.temp.id,
            name: this.temp.name,
            leader: this.temp.leader,
            avatar: this.temp.avatar,
            telephone: this.temp.telephone,
            description: this.temp.description,
            sort: this.temp.sort,
            departmentId: this.temp.departmentId,
            title: this.temp.title,
            status: this.temp.status,
            additionInfo: JSON.stringify(obj)
          })
          api.edit(params).then(() => {
            this.dialogFormVisible = false
            this.getList()
            // 重置表单
            this.resetForm('dataForm')
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
  width: 100%;
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

  .el-table ::v-deep .cell {
    white-space: nowrap;
    width: fit-content;
  }
  // table -end
  .detail-dialog{
    ::v-deep  .el-dialog__body{
      padding: 0;
    }
    .detail-container {
      .grid-content{
        display: flex;
        width: 230px;
        padding: 0 15px;
        align-items: center;
        &.add-info{
          width: 500px;
          display: flex;
          flex-wrap:wrap ;
          align-items: center;
           > div{
              width: 230px;
             &:nth-of-type(2n){
               padding-left: 30px;
             }
            .label{
              width: 120px;
              height: 47px;
              display: inline-block;
              font-size: 16px;
              line-height: 47px;
              color: #666;
            }
            .content{
              display: inline-block;
              width: 50px;
              font-weight: 100;
              font-size: 16px;
              color: #666;
            }
          }
        }
        .label{
          width: 110px;
          height: 47px;
          display: inline-block;
          font-size: 16px;
          line-height: 47px;
          color: #666;
        }
        .content{
          display: inline-block;
          width: 130px;
          font-weight: 100;
          font-size: 16px;
          color: #666;
        }
      }
    }
  }
  .avatar {
    width: 50px;
    height:50px;
    img{
      width: 100%;
      height:100%;
      display: block;
    }
  }
  .filter-container{
    ::v-deep .date-picker{
    width: 260px;
  }
  }
  ::v-deep.el-form-item--medium .el-form-item__content{
    line-height: 40px;
  }
  .additionInfo{
    .select-item {
      margin-bottom: 10px;
    }
    .el-form-item__content{
      display: flex;
      position: relative;
      .el-select{
        width: 45%;
        margin-right: 10px;
      }
      .el-input{
        width: 45%;
        margin-right: 10px;
      }
      .el-icon-circle-plus-outline {
        position: absolute;
        right: -5px;
        bottom: 23px;
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
      width: 500px;
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
  }
}
</style>
