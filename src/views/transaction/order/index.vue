<template>
  <div class="app-container">
    <div class="header card">
      <Search :search="handleSearch" :exports="handleExport" />
    </div>
    <div class="main card">
      <Table :table-data.sync="tableData" :status="statusMap" :sort-change="sortChange" :loading="loading" @handleEdit="handleEdit" @handleDel="handleCancel" />
      <Pagination v-show="total>0" style="text-align:center" :current.sync="listQuery.current" :limit.sync="listQuery.size" :total="total" @pagination="getTableData" />
    </div>

    <Dialog width="50%" top="100px" :visible.sync="visible">
      <template v-slot:title>
        <h4>{{ dialogMap[dialogStatus] }}</h4>
      </template>
      <template>
        <el-form ref="tempForm" inline label-width="100px" class="tempForm">
          <!-- 新增 ｜ 编辑 -->
          <template v-if="dialogStatus!=='repeat'">
            <el-form-item label="订单id" prop="user">
              <el-input v-model="temp.id" type="text" />
            </el-form-item>
            <el-form-item label="预约日期" prop="date">
              <el-date-picker
                v-model="temp.date"
                type="date"
                placeholder="选择时间范围"
              />
            </el-form-item>
            <el-form-item label="预约时间段" prop="time">
              <el-time-picker
                v-model="temp.time"
                is-range
                range-separator="至"
                start-placeholder="开始"
                end-placeholder="结束"
                value-format="hh:mm"
                placeholder="选择时间范围"
              />
            </el-form-item>
            <el-form-item label="预约项目" prop="project">
              <el-select v-model="temp.project" placeholder="请选择">
                <el-option
                  v-for="item in options.circle"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="预约医生" pro="doctor">
              <el-input v-model="temp.doctor" type="text" />
            </el-form-item>
            <el-form-item label="订单状态" prop="status">
              <el-select v-model="temp.status" placeholder="请选择">
                <el-option
                  v-for="item in options.project"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </template>
        </el-form>
      </template>
      <template v-slot:footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="editConfirm()">确定</el-button>
      </template>
    </Dialog>
  </div>
</template>

<script>
import Search from './components/Search'
import Table from './components/Table'
import Dialog from '@/components/Dialog/BasicDialog.vue'
import api from '@/api/transaction/order'
import { tableList, options, week } from './config'
import Pagination from '@/components/Pagination'
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
      listLoading: false,
      list: [],
      tableData: [],
      tableList,
      loading: false,
      dialogStatus: '',
      visible: false,
      dialogMap: {
        edit: '编辑项目',
        add: '新增项目',
        repeat: '重复周期'
      },
      temp: {
        id: 'aaa',
        date: '',
        time: [],
        project: '',
        doctor: '',
        status: ''
      },
      options,
      week,
      total: 1,
      listQuery: {
        current: 1,
        size: 0,
        condition: {},
        sort: []
      },
      statusMap: {}
    }
  },
  mounted() {
    this.getTableData()

    api.getStatus().then(res => {
      if (res.code) {
        return this.$notify({
          type: 'fail',
          message: res.message
        })
      }
      const data = res.data
      data.forEach(element => {
        this.statusMap = {
          ...this.statusMap,
          [element.index]: element.title
        }
      })
    })
  },
  methods: {
    // 获取table数据
    getTableData() {
      this.loading = true
      const params = Object.assign({}, this.listQuery)
      console.log('getTableData', params, api)
      api.getData(params).then(({ data }) => {
        const { list } = data
        this.tableData = list
        this.total = data.total
        setTimeout(() => {
          this.loading = false
        }, 2000)
      })
    },
    editConfirm() {
      const params = Object.assign({}, this.temp)
      console.log('editConfirm', params)
      api.edit(params).then(data => {
        this.getTableData()
        this.$notify({
          message: data.message,
          type: data.success === true ? 'success' : 'error'
        })
        this.visible = false
      })
    },
    // 查询
    handleSearch(params) {
      console.log('handleSearch', params)
      this.listQuery.condition = params
      this.getTableData()
    },
    // 导出
    handleExport() {
      console.log('handleExport')
    },
    sortChange() {
      console.log('sortChange')
    },
    // 编辑
    handleEdit(row) {
      console.log('handleEdit', row)
      this.temp = row
      console.log(this.temp)
      this.visible = true
      this.dialogStatus = 'edit'
    },
    // 删除
    handleCancel(row) {
      console.log('handleCancel', row)
      const id = row.id
      api.cancel(id).then(data => {
        // true
        this.getTableData()
        // toast
        this.$notify({
          type: data.success === true ? 'success' : 'fail',
          message: data.message
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .header {
    margin-bottom: 10px;
  }
  ::v-deep .el-form.tempForm{
    background: #fff;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    .el-form-item{
      flex: 0 0 45%;
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
