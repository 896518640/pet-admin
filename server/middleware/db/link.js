const mongoose = require('mongoose')
const Schema = mongoose.Schema
const linkSchema = new Schema({
  // 名称
  name: String,
  // 首页
  home: String,
  // 图标
  logo: String,
  // 描述
  des: String
})

module.exports = mongoose.model('link', linkSchema)
