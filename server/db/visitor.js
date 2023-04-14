const mongoose = require('mongoose')
const Schema = mongoose.Schema
const visitorSchema = new Schema({
  // 用户id
  visitor: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'user'
  },
  // 日期
  date: {
    type: Number,
    default: Date.now()
  }
})

module.exports = mongoose.model('visitor', visitorSchema)
