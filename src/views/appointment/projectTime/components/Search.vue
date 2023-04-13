<template>
  <div class="search-container">
    <el-form ref="form" class="searchForm" :model="searchParams" inline label-width="100px">
      <div class="form-line">
        <div class="left">
          <el-form-item label="预约项目">
            <el-select v-model="searchParams.projectId" placeholder="请选择预约项目">
              <el-option
                v-for="item in options.projectSearch"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="预约医生">
            <el-select v-model="searchParams.doctorId" placeholder="请选择预约医生">
              <el-option
                v-for="item in options.doctorSearch"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button v-if="typeof search === 'function'" v-waves icon="el-icon-search" type="primary" @click="handleSearch">查询</el-button>
            <el-button v-if="typeof exports === 'function'" v-waves type="warning" icon="el-icon-download" :loading="downloadLoading" plain @click="handleExport">导出</el-button>
            <el-button v-if="typeof add === 'function'" v-waves type="primary" icon="el-icon-plus" plain @click="handleAdd">新增</el-button>
          </el-form-item>
        </div>
      </div>
      <div class="form-line">
        <el-form-item label="可预约后">
          <el-input v-model="able_time" oninput="value=value.replace(/[^\de]/g,'')" class="able-time" placeholder="请输入可预约后几天号源" @blur="handleAbleChange" />天
        </el-form-item>
        <el-form-item>
          <el-button v-waves :type="isMul?'primary':'danger'" icon="el-icon-edit" :disabled="!isMul" @click="handleTime">统一预约时间</el-button>
          <el-button v-waves :type="isMul?'primary':'danger'" icon="el-icon-edit" :disabled="!isMul" @click="handleRepeat">统一重复周期</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { options } from '../config'
import waves from '@/directive/waves'
export default {
  name: 'Search',
  directives: {
    waves
  },
  props: {
    // 查询
    search: {
      type: Function,
      default: () => {}
    },
    // 导出
    exports: {
      type: Function,
      default: () => {}
    },
    // 新增
    add: {
      type: Function,
      default: () => {}
    },
    ableChange: {
      type: Function,
      default: () => {}
    },
    // 统一预约时间
    apTime: {
      type: Function,
      default: () => {}
    },
    isMul: {
      type: Boolean,
      default: false
    },
    // 统一重复时间
    repeatTime: {
      type: Function,
      default: () => {}
    },
    getOption: {
      type: Function,
      default: () => {}
    },
    downloadLoading: {
      type: Boolean,
      default: false
    },
    ableTime: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      // 搜索参数
      searchParams: {
        projectId: '',
        doctorId: ''
      },
      // 新增参数
      addParams: {
        projectName: '',
        precautions: []
      },
      options
    }
  },
  computed: {
    able_time: {
      set(val) {
        const res = val + ''
        this.$emit('update:ableTime', res)
      },
      get() {
        const res = this.ableTime + ''
        return res
      }
    }
  },
  mounted() {
    console.log('mounted', this.props)
    this.getOption()
  },
  methods: {
    handleSearch() {
      const params = Object.assign({}, {
        projectId: this.searchParams?.projectId,
        doctorId: this.searchParams?.doctorId
      })
      this.search(params)
    },
    handleExport() {
      this.exports()
    },
    handleAdd() {
      const params = Object.assign({}, {
        user: this.addParams?.user,
        phone: this.addParams?.phone
      })
      this.add(params)
    },
    handleAbleChange() {
      const params = {
        ableTime: this.ableTime
      }
      this.ableChange(params)
    },
    handleTime() {
      this.apTime()
    },
    handleRepeat() {
      this.repeatTime()
    }
  }
}
</script>

<style scoped lang="scss">
  .searchForm{
    .form-line{
      display: flex;
      justify-content: space-between;
      .able-time{
        width: 50px;
        margin-right: 10px;
      }
    }
  }
</style>
