const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema({
  user: {
    type: String,
    required: true
  },
  pass: {
    type: String,
    required: true
  },
  // 头像
  photo: {
    type: String,
    default: '/file/photo/1.jpg'
  }
})

module.exports = mongoose.model('user', userSchema)
