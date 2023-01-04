import {Router} from 'express'
import UserController from '../controllers/UserController.js'

import {registerValidation} from '../utils/validations.js'
import ValidationErrors from '../exceptions/ValidationErrors.js'
import PostController from '../controllers/PostController.js'
import HabController from '../controllers/HabController.js'

import checkAuth from '../utils/checkAuth.js'

import multer from 'multer'
import CommentsController from '../controllers/CommentsController.js'
import AuthorsController from '../controllers/AuthorsController.js'

const router = new Router()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 10 * 1024 * 1024
  },
});

router.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`
  })
})


router.post('/auth/register', registerValidation, ValidationErrors, UserController.register)
router.post('/auth/login', UserController.login)
router.get('/auth/refresh', UserController.refresh)
router.post('/auth/logout', checkAuth, UserController.logout)
router.post('/user/update', checkAuth, UserController.changeUserProfile)
router.post('/user/:id/subscribe', checkAuth, UserController.subscribe)
router.post('/user/:id/unSubscribe', checkAuth, UserController.unSubscribe)
router.get('/user/comments/:id', CommentsController.getUserComments)
router.get('/user/favorites/:id', UserController.getUserFavorites)
router.get('/user/profile/:id', UserController.getUserProfile)
router.get('/user/posts/:id', UserController.getUserPosts)
router.get('/user/subs/:id/:type', UserController.getUserSubs)


router.post('/posts/create', checkAuth, PostController.createPost)
router.post('/posts/search', PostController.postsSearch)
router.get('/posts/popular/:category', PostController.getCategoryPopular)
router.get('/posts/:category/:type', PostController.getPosts)
router.get('/post/:id', PostController.getOnePost)
router.post('/posts/addComment/:id', checkAuth, PostController.addComment)
router.post('/post/addFavorite/:id', checkAuth, PostController.addFavorite)
router.post('/post/removeFavorite/:id', checkAuth, PostController.removeFavorite)


router.get('/habs/search/:category/:value', HabController.searchHabs)
router.get('/habs/list/:category', HabController.getHabsByCategory)
router.get('/habs/one/:id', HabController.getOne)
router.get('/habs/posts/:id', PostController.getHabPosts)
router.post('/hab/create', checkAuth, HabController.create)
router.post('/hab/:id/subscribe', checkAuth, HabController.subscribe)
router.post('/hab/:id/unSubscribe', checkAuth, HabController.unSubscribe)
router.get('/habs/:category', HabController.loadSideHabs)

router.get('/habs/authors/:id/:title', AuthorsController.LoadHabAuthors)
router.get('/authors/search/:category/:title', AuthorsController.LoadCategoryAuthors)

router.get('/last/posts/:id', PostController.getLastPopular)

export default router

