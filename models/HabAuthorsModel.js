import {model, Schema} from 'mongoose'

const HabAuthorsSchema = new Schema({
  hab: {
    type: Schema.Types.ObjectId,
    ref: 'Hab'
  },
  authors: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
}, {
  timestamps: true
})



export const HabAuthorsModel = model('HabAuthors', HabAuthorsSchema)