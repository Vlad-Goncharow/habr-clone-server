import PostService from "../services/PostService.js"

class PostController {
  async createPost(req, res, next) {
    try {
      const values = req.body

      const userId = req.userId
      const post = await PostService.createPost(values, userId)

      return res.json(post)
    } catch (e) {
      next(e)
    }
  }
  async getPosts(req, res, next) {
    try {
      const {
        category,
        type,
        page
      } = req.params

      const posts = await PostService.getPosts(category, type, page)
      return res.json(posts)
    } catch (e) {
      console.log(e);
      next(e)
    }
  }
  async getOnePost(req, res, next) {
    try {
      const id = req.params.id
      const post = await PostService.getOnePost(id)
      return res.json(post)
    } catch (e) {
      console.log(e);
      next(e)
    }
  }
  async addComment(req, res, next) {
    try {
      const userId = req.userId
      const id = req.params.id

      const {
        text
      } = req.body

      const comment = await PostService.addComment(text, userId, id)

      return res.json(comment)
    } catch (e) {
      next(e)
    }
  }
  async addFavorite(req, res, next) {
    try {
      const {id} = req.params
      const userId = req.userId

      const post = await PostService.addFavorite(id, userId)
      return res.json(post)
    } catch (e) {
      next(e)
    }
  }
  async getLastPopular(req, res, next) {
    try {
      const {
        id
      } = req.params
      const posts = await PostService.getLastPopular(id)

      return res.json(posts)
    } catch (e) {
      next(e)
    }
  }
  async getCategoryPopular(req, res, next) {
    try {
      const {category} = req.params
      const posts = await PostService.getCategoryPopular(category)

      return res.json(posts)
    } catch (e) {
      next(e)
    }
  }
  async removeFavorite(req, res, next) {
    try {
      const {
        id
      } = req.params
      const userId = req.userId

      const post = await PostService.removeFavorite(id, userId)
      return res.json(post)
    } catch (e) {
      next(e)
    }
  }
  async getHabPosts(req, res, next) {
    try {
      const {
        id,
        page
      } = req.params
      const posts = await PostService.getHabPosts(id, page)
      return res.json(posts)
    } catch (e) {
      console.log(e)
      next(e)
    }
  }
  async getHabAuthors(req, res, next) {
    try {
      const {
        id
      } = req.params
      const posts = await PostService.getHabAuthors(id)
      return res.json(posts)
    } catch (e) {
      next(e)
    }
  }
  async getAuthorsByCategory(req, res, next) {
    try {
      const {
        category
      } = req.params

      const authors = await PostService.getAuthorsByCategory(category)
      return res.json(authors)
    } catch (e) {
      next(e)
    }
  }
  async postsSearch(req,res,next){
    try{
      const {title,page} = req.params

      const posts = await PostService.postsSearch(title, page)
      return res.json(posts)
    } catch(e){
      console.log(e)
      next(e)
    }
  }
}

export default new PostController()