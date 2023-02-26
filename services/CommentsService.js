import {CommentModel} from '../models/CommentModel.js'

class CommentsService{
  async addComment(values){
    const comment = await CommentModel.create({...values})

    return comment
  }
  async getCommentById(id){
    const comment = await CommentModel.findOne({_id:id}).populate('user', '-password').exec()
    return comment
  }
  async getPostComments(id){
    const comments = await CommentModel.find({post:id})
      .populate('user','-password')
      .exec()

    return comments
  }
  async getUserComments(id,page){
    const data = await CommentModel.find({user:id});
    const comments = await CommentModel.find({user:id})
      .populate('post')
      .populate('user','-password')
      .skip(page > 1 ? ((page - 1) * 8) : 0)
      .limit(8)
      .exec()

    return {
      length:data.length,
      comments: comments
    }
  }
}

export default new CommentsService()