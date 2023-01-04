import {model, Schema} from 'mongoose'

const CategoryAuthorsSchema = new Schema({
  category: {
    type:String,
    require:true
  },
  authors: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
}, {
  timestamps: true
})



export const CategoryAuthorsModel = model('CategoryAuthors', CategoryAuthorsSchema)