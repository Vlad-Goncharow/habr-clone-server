import CommentsService from '../services/CommentsService.js'

class CommentsController {
  async getPostComments(req,res,next){
    try{
      const {id} = req.params

      const comments = await CommentsService.getPostComments(id)
      return res.json(comments)
    } catch(e){
      next(e)
    }
  }
  async getUserComments(req,res,next){
    try{
      const {id} = req.params

      const comments = await CommentsService.getUserComments(id)
      return res.json(comments)
    } catch(e){
      next(e)
    }
  }
}

export default new CommentsController()