import { Schema,model } from "mongoose";

const PostSchema = new Schema({
  title:{
    type:String,
    require:true
  },
  text:{
    type:String,
    require:true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  }],
  image:String,
  tags:Array,
  habs: [{
    type: Schema.Types.ObjectId,
    ref: 'Hab',
  }],
  category:String,
  postType: String,
  views: {
    type: Number,
    default: 0
  },
  favorites:{
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

export const PostModel = model('Post', PostSchema)