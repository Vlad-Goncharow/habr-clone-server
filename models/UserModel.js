import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  email:{
    type:String,
    require:true
  },
  password:{
    type: String,
    require: true
  },
  nickName:{
    type: String,
    require: true
  },
  avatar: {
    type: String,
    default: '/uploads/default.png'
  },
  karma: {
    type: Number,
    default:0
  },
  rating: {
    type: Number,
    default: 0
  },
  fullName: {
    type: String,
    default: 'Не известно'
  },
  description: {
    type: String,
    default: 'Не известно'
  },
  gender: {
    type: String,
    default: 'Не известно'
  },
  dayOfBirth: {
    type: String,
    default: 'Не известно'
  },
  yearOfBirth: {
    type: String,
    default: 'Не известно'
  }, 
  monthOfBirth: {
    type: String,
    default: 'Не известно'
  },
  country: {
    type: String,
    default: 'Не известно'
  },
  register: {
    type:String,
    reqire:true
  }, 
  lastActive: {
    type: String,
    reqire: true
  },
  favoritesPosts:[{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }],
  habSubscribers: [{
    type: Schema.Types.ObjectId,
    ref: 'Hab'
  }],
  userSubscribers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  userSubscriptions: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
})

export const UserModel = model('User', UserSchema)