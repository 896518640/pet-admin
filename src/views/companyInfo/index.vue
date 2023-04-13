<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="title clearfix">
        <h3>企业信息 <span class="title-info">我的企业名片</span></h3>
      </div>
      <div class="avatar">
        <img src="" alt="">
      </div>
      <el-form ref="form" class="company-form" :model="sizeForm" label-position="top" label-width="80px">
        <el-form-item label="企业/组织名称">
          <el-input v-model="sizeForm.name" />
        </el-form-item>
        <el-form-item label="企业专属域名">
          <el-input v-model="sizeForm.name" />
        </el-form-item>
        <el-form-item label="团队规模">
          <el-select v-model="sizeForm.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai" />
            <el-option label="区域二" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属行业">
          <el-select v-model="sizeForm.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai" />
            <el-option label="区域二" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="sizeForm.name" />
        </el-form-item>
        <el-form-item label="公司地址">
          <el-input v-model="sizeForm.name" />
        </el-form-item>
        <el-form-item size="small">
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'CompanyInfo',
  data() {
    return {
      sizeForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!')
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container{
  width: 100%;
  height: 100%;
  background-color: #fafafa;
  .title{
    h3{
      font-weight: 400;
      .title-info{
        color: #666;
        margin-left: 50px;
      }
    }
  }
  .avatar{
    margin-bottom: 20px;
    img{
      width: 100px;
      height: 100px;
      border: 1px solid #ddd;
    }

  }
  .company-form{
    .el-form-item{
      width: 30%;
    }
  }
}
::v-deep .el-card__header{
  padding: 0 0 0 20px;
  height: 30px;
}
::v-deep label.el-form-item__label{
  font-weight: normal;
  color: #111;
  padding-bottom: 5px;
}
</style>
