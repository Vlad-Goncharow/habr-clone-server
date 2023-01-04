import UserService from '../services/UserService.js'

class UserController {
  async register(req,res,next) {
    try {
      const values = req.body
      const userData = await UserService.register(values)

      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true
      })

      return res.json(userData)
    } catch(e) {
      next(e)
    }
  }
  async login(req,res,next){
    try {
      const {email,password} = req.body

      const userData = await UserService.login(email, password)

      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true
      })

      res.json(userData)
    } catch(e) {
      next(e)
    }
  }
  async refresh(req,res,next) {
    try {
      const {refreshToken} = req.cookies
      const userData = await UserService.refresh(refreshToken)
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true
      })

      return res.json(userData)
    } catch(e) {
      next(e)
    }
  }
  async logout(req,res,next) {
    try {
      const userId = req.userId
      await UserService.logout(userId)

      res.clearCookie("refreshToken");
      res.json({success:true})
    } catch(e) {
      next(e)
    }
  }
  async subscribe(req,res,next){
    try {
      const userId = req.userId
      const {id,type} = req.params
      await UserService.subscribe(userId, id, type)

      return res.json(id)
    } catch(e){
      next(e)
    }
  }
  async unSubscribe(req,res,next){
    try {
      const userId = req.userId
      const {id,type} = req.params
      await UserService.unSubscribe(userId, id, type)

      return res.json(id)
    } catch(e){
      console.log(e);
      next(e)
    }
  }
  async getUserProfile(req,res,next){
    try {
      const {id} = req.params
      const user = await UserService.getUserProfile(id)

      return res.json(user)
    } catch(e){
      console.log(e)
      next(e)
    }
  }
  async getUserFavorites(req, res, next) {
    try {
      const {id} = req.params
      const posts = await UserService.getUserFavorites(id)

      return res.json(posts)
    } catch(e){
      console.log(e)
      next(e)
    }
  }
  async getUserSubs(req, res, next) {
    try {
      const {id,type} = req.params
      const posts = await UserService.getUserSubs(id, type)

      return res.json(posts)
    } catch(e){
      console.log(e)
      next(e)
    }
  }
  async getUserPosts(req,res,next){
    try {
      const {id} = req.params

      const posts = await UserService.getUserPosts(id)
      return res.json(posts)
    } catch(e){
      console.log(e);
      next(e)
    }
  }
  async changeUserProfile(req,res,next) {
    try{
      const values = req.body
      const userId = req.userId
      const user = await UserService.changeUserProfile(values,userId)
      return res.json(user)
    } catch(e){
      console.log(e);
      next(e)
    }
  }
}

export default new UserController()