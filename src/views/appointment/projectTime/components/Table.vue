<template>
  <el-table
    ref="multipleTable"
    v-loading="loading"
    :data="list"
    fit
    :span-method="objectSpanMethod"
    highlight-current-row
    header-cell-class-name="table-header"
    cell-class-name="table-cell"
    style="width: 3000px"
    tooltip-effect="dark"
    width="100%"
    @sort-change="sortChange"
    @select-all="selectAll"
    @selection-change="handleSelectionChange"
  >
    <el-table-column label="id" min-width="100" prop="id" />
    <el-table-column label="预约医生" min-width="100" prop="doctorName" />
    <el-table-column label="预约项目" min-width="100" prop="projectName" />
    <el-table-column label="预约时间段" min-width="150" prop="time">
      <template slot-scope="{row}">
        {{ row.availableStartTime }}--{{ row.availableEndTime }}
      </template>
    </el-table-column>
    <el-table-column label="预约号源" min-width="100" prop="number" />
    <el-table-column label="预约周期" min-width="100" prop="duration" />
    <el-table-column label="重复周期" min-width="300" prop="recurrence" class-name="recurrence">
      <template slot-scope="{row}">
        <slot name="recurrence" :row="row" />
      </template>
    </el-table-column>
    <el-table-column label="操作" fixed="right" width="200">
      <template slot-scope="{row}">
        <el-button v-waves type="text" icon="el-icon-edit" style="margin-right:10px;" @click="handleEdit(row)">编辑</el-button>
        <el-popconfirm
          title="确定删除吗？"
          @onConfirm="handleDel(row)"
        >
          <el-button slot="reference" type="text" icon="el-icon-delete">删除</el-button>
        </el-popconfirm>
      </template>
    </el-table-column>
    <el-table-column
      fixed="right"
      type="selection"
      width="55"
    />
  </el-table>
</template>
<script>
import { tableList } from '../config'
import waves from '@/directive/waves'
export default {
  name: 'Table',
  directives: {
    waves
  },
  props: {
    tableData: {
      type: Array,
      required: true
    },
    isMul: {
      type: Boolean,
      default: false
    },
    getData: {
      type: Function,
      required: true
    },
    sortChange: {
      type: Function,
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      tableList,
      list: [],
      multipleSelection: [],
      gruopRow: [],
      newTableData: []
    }
  },
  watch: {
    tableData: {
      immediate: true,
      handler(val) {
        this.dataHandler('combineKey')
      }
    }
  },
  mounted() {
    this.dataHandler('combineKey')
  },
  methods: {
    // 多选方法
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.$emit('active', this.multipleSelection)
      if (this.multipleSelection.length) {
        this.$emit('update:isMul', true)
      } else {
        this.$emit('update:isMul', false)
      }
      console.log(this.multipleSelection)
    },
    // 编辑
    handleEdit(row) {
      this.$emit('handleEdit', row)
    },
    // 删除
    handleDel(row) {
      this.$emit('handleDel', row)
    },
    // 处理和并列数据
    combineData(data) {
      return data.map((item, index) => {
        const { doctorId, projectId } = item
        item.combineKey = `${doctorId}-${projectId}`
        return item
      })
    },
    // 处理数据
    dataHandler(key) {
      this.list = this.combineData(this.tableData)
      // 重复计算
      for (const i in this.list) {
        // 初始化需要合并的行数和列数量
        this.$set(this.list[i], 'row', 0)
        this.$set(this.list[i], 'column', 0)
        // 过滤重复数据以及计算重复数量(得出需要往下合并行数)
        const r = this.contains(this.gruopRow, this.list[i], key)
        // 如果重复数据则不修改合并数,保持为0,如果不重复为该类型第一行则加入数组
        if (!r) {
          this.gruopRow.push({ [key]: this.list[i][key], 'num': 1 })
          this.list[i].row = 1
          this.list[i].column = 1
        }
      }
      // 合并计算
      for (const i in this.list) {
        for (let j = 0; j < this.gruopRow.length; j++) {
          // 如果该行为本类型第一行,则赋值
          if (this.gruopRow[j][key] === this.list[i][key]) {
            const num = this.gruopRow[j].num
            this.list[i].row = num
            this.list[i].column = 1
            this.gruopRow.splice(j, 1)
          }
        }
      }
      // console.log(this.list)
      this.newTableData = this.list
      console.log('this.newTableData', this.newTableData)
    },
    // 判断是否包含
    contains(arr, obj, key) {
      let i = arr.length
      while (i--) {
        if (arr[i][key] === obj[key]) {
          arr[i].num = arr[i].num + 1
          return true
        }
      }
      return false
    },

    // 合并单元格
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // 判断是否为第一列
      if (columnIndex === 0) {
        return {
          rowspan: row.row,
          colspan: 1
        }
      } else if (columnIndex === 1) {
        return {
          rowspan: row.row,
          colspan: 1
        }
      } else if (columnIndex === 2) {
        return {
          rowspan: row.row,
          colspan: 1
        }
      }
    },
    selectAll() {

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
