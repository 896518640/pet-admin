<template>
  <div class="search-container">
    <el-form ref="form" class="searchForm" :model="searchParams" inline label-width="100px">
      <div class="form-line">
        <el-form-item label="预约人">
          <el-input v-model="searchParams.user" placeholder="请输入预约人" />
        </el-form-item>
        <el-form-item label="预约手机号">
          <el-input v-model="searchParams.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="预约日期">
          <el-input v-model="searchParams.date" placeholder="请输入预约日期" />
        </el-form-item>
        <el-form-item label="预约项目">
          <el-input v-model="searchParams.project" type="text" placeholder="请输入预约项目" />
        </el-form-item>
        <el-form-item label="预约医生">
          <el-input v-model="searchParams.doctor" placeholder="请输入预约医生" />
        </el-form-item>
        <el-form-item>
          <el-button v-if="typeof search === 'function'" type="primary" @click="handleSearch">查询</el-button>
          <el-button v-if="typeof exports === 'function'" type="primary" @click="handleExport">导出</el-button>
          <el-button v-if="typeof add === 'function'" type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Search',
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
      default: null
    },
    apTime: {
      type: Function,
      default: () => {}
    },
    repeatTime: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      // 搜索参数
      searchParams: {
        user: '',
        phone: '',
        date: '',
        project: '',
        doctor: ''
      },
      // 新增参数
      addParams: {
        projectName: '',
        precautions: []
      }
    }
  },
  mounted() {
    console.log('mounted', this.props)
  },
  methods: {
    handleSearch() {
      const params = Object.assign({}, {
        user: this.searchParams?.user,
        phone: this.searchParams?.phone,
        date: this.searchParams?.date,
        project: this.searchParams?.project,
        doctor: this.searchParams?.doctor
      })
      this.search(params)
      // this.$emit('search', this.search)
    },
    handleExport() {
      this.exports()
      // this.$emit('export')
    },
    handleAdd() {
      const params = Object.assign({}, {
        user: this.addParams?.user,
        phone: this.addParams?.phone
      })
      this.add(params)
      // this.$emit('add')
    },
    handleTime() {
      this.apTime()
    },
    handleRepeat() {
      this.repeatTime()
    },
    handleAaa() {
      this.aaa()
    }
  }
}
</script>

<style scoped lang="scss">
  .searchForm{
    .form-line{
      //display: flex;
      //justify-content: space-between;
    }
  }
</style>
