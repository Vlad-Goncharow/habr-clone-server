import {Schema,model} from 'mongoose'

const CommentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post:{
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  text:{
    type:String,
    require: true,
    required: true
  }
}, {
  timestamps: true
})

export const CommentModel = model('Comment', CommentSchema)