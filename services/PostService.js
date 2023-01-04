import {PostModel} from '../models/PostModel.js'
import {CommentModel} from '../models/CommentModel.js'
import HabService from './HabService.js'
import UserService from './UserService.js'
import CommentsService from './CommentsService.js'
import AuthorsService from './AuthorsService.js'
import { HabModel } from '../models/HabModel.js'

class PostService {
  async createPost(values, userId) {
    
    values.habs.forEach(async (el) => {
      HabService.checkAuthor(el.title, userId)
      AuthorsService.addHabAuthors(el._id,userId)
    })

    await UserService.updateRating(userId, 10)
    await AuthorsService.addCategiryAuthors(values.category,userId)

    const post = await PostModel.create({
      ...values,
      user: userId
    })

    return post
  }
  async getPosts(category, type) {
    if (category === 'all') {
      if (type === 'all') {
        const posts = await PostModel.find().populate('user', '-password').exec()
        return posts
      }

      if (type === 'news') {
        const posts = await PostModel.find({
          postType: 'news'
        }).populate('user', '-password').exec()
        return posts
      }
    }

    if (category === 'develop' || category === 'admin' || category === 'design' || category === 'management' || category === 'marketing' || category === 'popsci') {
      if (type === 'all') {
        const posts = await PostModel.find({
          category: category
        }).populate('user', '-password').exec()
        return posts.filter(post => post.postType === 'post')
      }

      if (type === 'news') {
        const posts = await PostModel.find({
          category: category
        }).populate('user', '-password').exec()
        return posts.filter(el => el.postType === type)
      }
    }
  }
  async getOnePost(id) {
    const post = await PostModel.findOneAndUpdate({
      _id: id
    }, {
      $inc: {
        "views": +1
      }
    }).populate('user', '-password').populate('habs').populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: '-password'
      }
    })

    return post
  }
  async addComment(text, userId, postId) {
    //create new comment
    const data = await CommentsService.addComment({
      text: text,
      user: userId,
      post: postId
    })
    
    // ======== find and return new comment with user & post data
    const comment = await CommentsService.getCommentById(data._id)
    // ======== update post
    await PostModel.findOneAndUpdate({
      _id: postId,
    }, {
      $push: {
        "comments": data
      }
    })

    return comment
  }
  async addFavorite(id,userId){
    const user = await UserService.addFavorite(id,userId)

    if(user){
      const data = await PostModel.findOneAndUpdate({
        _id: id,
      }, {
        $inc: {
          "favorites": + 1
        }
      },{
        new:true
      })

      return data._id
    }
  }
  async getLastPopular(id){
    const items = await PostModel.find().sort({createdAt:-1}).sort({views:-1}).limit(5).exec()
    const posts = items.filter(item => item._id !== id)
    
    return posts
  }
  async getPostsByHab(id) {
    const posts = await PostModel.find({habs:{"$in":[id]}}).populate('user', '-password').exec()
    return posts
  }
  async getCategoryPopular(category) {
    if (category === 'all') {
      const items = await PostModel.find().sort({views:-1}).limit(5).exec()
      return items
    } else {
      const items = await PostModel.find({category}).sort({views:-1}).limit(5).exec()
      return items
    }
  }
  async getPostsByUserId(id) {
    const posts = await PostModel.find({user:id}).populate('user', '-password').exec()
    return posts
  }
  async removeFavorite(id, userId) {
    const user = await UserService.removeFavorite(id, userId)

    if(user){
      const data = await PostModel.findOneAndUpdate({
        _id: id,
      }, {
        $inc: {
          "favorites": - 1
        }
      },{
        new:true
      })

      return data._id
    }
  }
  async getHabPosts(id){
    const posts = await PostModel.find({habs:{"$in":[id]}}).populate('user', '-password').exec()
    return posts
  }
  async getHabAuthors(id) {
    const data = await HabModel.findById(id).populate('authors', '-password').exec()
    return data.authors
  }
  async getAuthorsByCategory(category) {
    if (category === 'all'){
      const data = await PostModel.find().populate('user', '-password').exec()
      const arr = data.map(el => el.user).filter((el, index, array) => index === array.indexOf(el))
      return arr
    } else {
      const data = await PostModel.find({category}).populate('user', '-password').exec()
      const arr = data.map(el => el.user).filter((el, index, array) => index === array.indexOf(el))
      return arr
    }
  }
  async postsSearch(title){
    const posts = await PostModel.find({title:{$regex:title,$options: 'i'}}).populate('user','-password')
    return posts
  }
}

export default new PostService()