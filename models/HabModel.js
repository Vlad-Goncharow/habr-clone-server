import {model, Schema} from 'mongoose'

const HabSchema = new Schema({
  title: {
    type:String,
    require:true
  },
  descr: {
    type:String,
    require:true
  },
  image: String,
  rating: {
    type:Number,
    default:0
  },
  authors: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  category:{
    type:String,
    require:true
  },
  subscribers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  postsCount:{
    type:Number,
    default:0
  }
}, {
  timestamps: true
})



export const HabModel = model('Hab', HabSchema)