<template>
  <div class="app-container">
    <div class="header card">
      <Search :add="handleAdd" :is-mul="isMul" :able-time.sync="ableTime" :download-loading="downloadLoading" :get-option="getOption" :able-change="handleAbleChange" :search="handleSearch" :exports="handleExport" :ap-time="handleTime" :repeat-time="handleRepeat" />
    </div>
    <div class="main card">
      <Table ref="tableChild" :get-data="getTableData" :is-mul.sync="isMul" :table-data.sync="tableData" :sort-change="sortChange" :loading="loading" @active="active" @handleEdit="handleEdit" @handleDel="handleDel">
        <template v-slot:recurrence="{row}">
          <template v-if="row.recurrence.length">
            <el-tag v-for="tag of row.recurrence" :key="tag">
              {{ tag | tagMap }}
            </el-tag>
          </template>
        </template>
      </Table>
      <Pagination v-show="total>0" style="text-align:center" :current.sync="listQuery.current" :size.sync="listQuery.size" :total="total" @pagination="getTableData" />
    </div>

    <Dialog width="30%" top="100px" :visible.sync="visible">
      <template v-slot:title>
        <h4>{{ dialogMap[dialogStatus] }}</h4>
      </template>
      <template>
        <el-form ref="tempForm" inline label-width="100px" class="tempForm">
          <!-- 新增 ｜ 编辑 -->
          <template v-if="dialogStatus==='add'||dialogStatus==='edit'">
            <el-form-item label="预约医生" prop="doctor">
              <!-- 编辑 -->
              <el-select v-model="temp.doctorId" placeholder="请选择">
                <el-option
                  v-for="item in options.doctor"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="预约项目" prop="name">
              <!-- 编辑 -->
              <el-select v-model="temp.projectId" placeholder="请选择">
                <el-option
                  v-for="item in options.project"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="预约时间段" prop="time">
              <el-time-picker
                v-model="time"
                is-range
                range-separator="至"
                start-placeholder="开始"
                end-placeholder="结束"
                value-format="HH:mm:ss"
                placeholder="选择时间范围"
              />
            </el-form-item>
            <el-form-item label="预约号源" prop="number">
              <el-input v-model="temp.number" type="text" />
            </el-form-item>
            <el-form-item label="预约周期" prop="duration">
              <el-select v-model="temp.duration" placeholder="请选择">
                <el-option
                  v-for="item in options.duration"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="重复周期" prop="recurrence">
              <el-checkbox-group v-model="temp.recurrence">
                <el-checkbox v-for="item in week" :key="item.value" :label="item.value">{{ item.label }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </template>
          <template v-else-if="dialogStatus==='time'">
            <el-form-item label="预约时间段">
              <el-time-picker
                v-model="temp.time"
                is-range
                range-separator="至"

                start-placeholder="开始"
                end-placeholder="结束"
                value-format="HH:mm:ss"
                placeholder="选择时间范围"
              />
            </el-form-item>
          </template>
          <template v-else-if="dialogStatus==='repeat'">
            <el-form-item label="重复周期">
              <el-checkbox-group v-model="temp.recurrence">
                <el-checkbox v-for="item in week" :key="item.value" :label="item.value">{{ item.label }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </template>
        </el-form>
      </template>
      <template v-slot:footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button v-if="dialogStatus==='add'||dialogStatus==='edit'" type="primary" @click="dialogStatus==='add'?addConfirm():editConfirm()">确定</el-button>
        <el-button v-if="dialogStatus==='time'||dialogStatus==='repeat'" type="primary" @click="dialogStatus==='time'?timeConfirm():repeatConfirm()">确定</el-button>
      </template>
    </Dialog>
  </div>
</template>

<script>
import Search from './components/Search'
import Table from './components/Table'
import Dialog from '@/components/Dialog/BasicDialog.vue'
import Pagination from '@/components/Pagination'

import api from '@/api/appointment/projectTime'
import { employee, department } from '@/api/merchant/index.js'

import { tableList, options, week } from './config'
import { parseTime } from '@/utils'
export default {
  name: 'ProjectIndex',
  components: {
    Search, Table, Dialog, Pagination
  },
  filters: {
    tagMap(key) {
      const map = week.filter(item => item.value === key)
      return map[0].label
    }
  },
  data() {
    return {
      activeList: [],
      downloadLoading: false,
      listLoading: false,
      tableData: [],
      tableList,
      loading: false,
      dialogStatus: '',
      visible: false,
      dialogMap: {
        edit: '编辑项目',
        add: '新增项目',
        time: '统一预约时间',
        repeat: '统一重复周期'
      },
      temp: {
        id: '',
        doctorId: '张医生',
        departmentId: '骨科',
        projectId: '',
        availableStartTime: '',
        availableEndTime: '',
        number: '',
        duration: '',
        recurrence: []
      },
      time: ['', ''],
      options,
      week,
      listQuery: {
        current: 1,
        size: 10,
        condition: {},
        sort: []
      },
      total: 0,
      ableTime: '0',
      isMul: false
    }
  },
  watch: {
    time: {
      deep: true,
      handler(n, o) {
        console.log(n)
        this.temp.availableStartTime = n[0]
        this.temp.availableEndTime = n[1]
      }
    }
  },
  created() {
    this.getTableData()
    this.getOption()
    this.getAbleTime()
  },
  methods: {
    // 获取选项
    async getOption() {
      const params = {
        current: 1,
        size: 1000,
        condition: {},
        sort: []
      }

      const empRes = await employee.employee(params)
      const depRes = await department.department(params)
      if (empRes.code || depRes.code) return
      const empList = empRes.data.list
      const depList = depRes.data.list

      this.options.doctor = empList.map(item => {
        return {
          label: item.name,
          value: item.id
        }
      })

      this.options.project = depList.map(item => {
        return {
          label: item.name,
          value: item.id
        }
      })

      this.options.doctorSearch = [
        {
          label: '全部',
          value: ''
        },
        ...this.options.doctor
      ]
      this.options.projectSearch = [
        {
          label: '全部',
          value: ''
        },
        ...this.options.project
      ]
    },
    sortDoctor(a, b) {
      return b.doctorId - a.doctorId
    },
    sortProject(a, b) {
      return b.projectId - a.projectId
    },
    // 获取table数据
    async getTableData() {
      this.loading = true

      const params = Object.assign({}, this.listQuery)
      const dataRes = await api.getData(params)

      if (dataRes.code) {
        this.loading = false
        return
      }
      const { list, total } = dataRes.data

      list.sort(this.sortProject)
      list.sort(this.sortDoctor)

      this.tableData = list
      this.total = total
      this.loading = false
    },
    // 统一预约时间
    handleTime() {
      this.dialogStatus = 'time'
      this.temp = {
        recurrence: [],
        time: ['', '']
      }
      this.visible = true
    },
    async timeConfirm() {
      const idList = this.activeList.map((item) => item.id)
      const params = {
        time: this.temp.time,
        all: false,
        idList
      }
      const batRes = await api.batchTime(params)

      if (batRes.code) {
        this.visible = false
        return
      }
      this.visible = false
      this.$notify({
        message: '修改成功',
        type: 'success'
      })

      this.getTableData()
    },
    // 统一重复时间
    handleRepeat() {
      this.dialogStatus = 'repeat'
      this.temp = {
        recurrence: [],
        time: ['', '']
      }
      this.visible = true
    },
    async repeatConfirm() {
      const idList = this.activeList.map(item => item.id)
      const params = {
        recurrence: this.temp.recurrence,
        idList
      }
      const batRes = await api.batchCircle(params)

      if (batRes.code) {
        this.visible = false
        return
      }

      this.$notify({
        message: '修改成功',
        type: 'success'
      })
      this.visible = false

      this.getTableData()
    },
    // 更新选中列表
    active(active) {
      this.activeList = active
    },
    // 新增
    handleAdd() {
      this.temp = {
        recurrence: []
      }
      this.time = ['', '']
      this.visible = true
      this.dialogStatus = 'add'
    },
    // 查询
    handleSearch(params) {
      this.listQuery.current = 1
      this.listQuery.condition = params

      this.getTableData()
    },
    // 导出
    handleExport() {
      console.log('导出')
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        // 导出表格
        const tHeader = ['预约医生', '预约项目', '预约时间段', '预约号源', '预约周期', '重复周期']
        const filterVal = ['doctor', 'name', 'time', 'number', 'duration', 'recurrence']
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
      return this.tableData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    // 修改可预约后几天的时间
    async handleAbleChange(params) {
      console.log('修改可预约几天后的时间', params)
      const { ableTime } = params
      const tenantId = this.$store.getters.tenantId
      const query = {
        ableTime,
        tenantId
      }

      const ableRes = await api.setAbleTime(query)

      if (ableRes.code) {
        return
      }

      this.$notify({
        message: '修改成功',
        type: 'success'
      })
    },
    async getAbleTime() {
      console.log('查询可预约几天后的时间')
      const tenantId = this.$store.getters.tenantId
      const params = {
        tenantId
      }
      const ableRes = await api.getAbleTime(params)
      if (ableRes.code) return
      this.ableTime = ableRes.data
    },
    sortChange() {
      console.log('sortChange')
    },
    // 编辑
    handleEdit(row) {
      console.log('编辑', row)
      this.time = ['', '']
      this.temp = row
      this.time[0] = row.availableStartTime
      this.time[1] = row.availableEndTime
      this.visible = true
      this.dialogStatus = 'edit'
    },
    addConfirm() {
      const params = Object.assign({}, this.temp)
      console.log('addConfirm', params)
      api.add(params).then(data => {
        this.getTableData()
        this.$notify({
          message: '添加成功',
          type: 'success'
        })
        this.visible = false
      })
    },
    editConfirm() {
      const params = Object.assign({}, this.temp)
      params.availableStartTime = this.time[0]
      params.availableEndTime = this.time[1]
      console.log('editConfirm', params)
      api.edit(params).then(data => {
        // true
        this.getTableData()
        this.$notify({
          message: '修改成功',
          type: data.success === true ? 'success' : 'error'
        })
        this.visible = false
      })
    },
    // 删除
    handleDel({ id }) {
      console.log('删除', id)
      api.del(id).then(data => {
        // true
        this.getTableData()
        this.$notify({
          message: '删除成功',
          type: 'success'
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .header{
    margin-bottom:10px;
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
</style>
