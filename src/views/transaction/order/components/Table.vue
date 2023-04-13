<template>
  <el-table
    ref="multipleTable"
    v-loading="loading"
    :data="tableData"
    fit
    highlight-current-row
    header-cell-class-name="table-header"
    cell-class-name="table-cell"
    style="width: 3000px"
    tooltip-effect="dark"
    @sort-change="sortChange"
  >
    <el-table-column label="id" width="100" prop="id" />
    <el-table-column label="预约人" width="100" prop="user" />
    <el-table-column label="预约手机号" width="120" prop="phone" />
    <el-table-column label="预约日期" width="150" prop="date" />
    <el-table-column label="预约时间段" width="100" prop="time" />
    <el-table-column label="预约项目" width="100" prop="project" />
    <el-table-column label="预约医生" prop="doctor" />
    <el-table-column label="预约宠物" width="100" prop="pet" />
    <el-table-column label="年龄" width="100" prop="age" />
    <el-table-column label="疫苗信息" prop="vaccineInfo" />
    <el-table-column label="绝育信息" width="100" prop="neuteringInfo" />
    <el-table-column label="订单费用" width="100" prop="price" />
    <el-table-column label="订单状态" prop="status" width="120">
      <template slot-scope="{row}">
        <el-tag :type="row.status | statusFilter">
          {{ statusMap[row.status] }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作" fixed="right" width="200">
      <template slot-scope="{row}">
        <el-button type="text" icon="el-icon-edit" @click="handleEdit(row)">编辑</el-button>
        <el-button type="text" icon="el-icon-cancel" @click="handleDel(row)">取消订单</el-button>
      </template>
    </el-table-column>
  </el-table></template>
<script>
import { tableList } from '../config'
export default {
  name: 'Table',
  props: {
    tableData: {
      type: Array,
      required: true
    },
    sortChange: {
      type: Function,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    },
    status: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      tableList,
      list: []
    }
  },
  watch: {
    status(val) {
      this.status = val
    }
  },
  methods: {
    // 编辑
    handleEdit(row) {
      this.$emit('handleEdit', row)
    },
    // 退款
    handleDel(row) {
      this.$emit('handleDel', row)
    }
  }
}
</script>

<style scoped lang="scss">
::v-deep .recurrence{
  height:40px;
  .cell{
    display: flex;
    padding: 0 20px;
    width: 100%;
    .el-tag{
      margin: 0 5px;
    }
  }
}
</style>
