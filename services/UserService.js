import ApiError from '../exceptions/ApiError.js'
import {UserModel} from '../models/UserModel.js'
import bcrypt from 'bcrypt'
import { UserDto } from '../dto/UserDto.js'
import TokenService from './TokenService.js'
import { TokenModel } from '../models/TokenModel.js'
import { PostModel } from '../models/PostModel.js'

class UserService{
  async register(values) {
    const userIsFind = await UserModel.findOne({email:values.email})
    if (userIsFind) {
      throw ApiError.BadRequest("Пользователь с такой почтой зарегестрирован")
    }
    
    const passwordHash = await bcrypt.hash(values.password,3)

    const user = await UserModel.create({
      ...values,
      register: String(new Date().toJSON()),
      password: passwordHash
    })

    const userDto = new UserDto(user)

    const tokens = await TokenService.generateTokens({...userDto})

    await TokenService.saveToken(userDto._id, tokens.refreshToken)

    return {
      ...tokens,
      ...userDto
    }
  }
  async login(email,password) {
    const user = await UserModel.findOne({email})

    if(!user){
      throw ApiError.BadRequest('При авторизации произошла ошибка')
    }

    const checkPass = await bcrypt.compare(password, user.password)

    if (!checkPass) {
      const error = [
        {
          param:'password',
          msg:'Неверный пароль'
        }
      ]
      throw ApiError.BadRequest('Неверный пароль', error)
    }

    const userDto = new UserDto(user)

    const tokens = await TokenService.generateTokens({...userDto})
    
    await TokenService.saveToken(userDto._id, tokens.refreshToken)

    return {
      ...userDto,
      ...tokens
    }
  }
  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnathorizedError()
    }
    //после валидации нам необходимо проверить находится ли этот токен в базе данных
    const userData = await TokenService.validateRefreshToken(refreshToken)

    const tokenFromDb = await TokenService.fidnToken(refreshToken)
    //делаем проверку что валидации и пойск в базе данных у нас прошли
    if (!userData || !tokenFromDb) {
      throw ApiError.UnathorizedError()
    }
    const user = await UserModel.findById(userData._id)

    const userDto = new UserDto(user);
    //генерируем токены
    const tokens = TokenService.generateTokens({...userDto})
    //рефреш токен необходимо сохрнить в бд
    await TokenService.saveToken(userDto._id, tokens.refreshToken)

    return {
      ...tokens,
      ...userDto
    }
  }
  async logout(userId) {
    await TokenModel.deleteOne({user:userId}).exec()
  }
  async updateRating(userId,count) {
    await UserModel.findOneAndUpdate({
      _id: userId
    }, {
      $inc: {
        "rating": + count
      }
    })
  }
  async subscribe(userId, id) {
    const checkCurrentUser = await UserModel.findOne({_id:userId,userSubscriptions:{"$in":[id]}})
    const checkChoseuser = await UserModel.findOne({_id:id,userSubscribers:{"$in":[userId]}})
    
    if (checkCurrentUser && checkChoseuser){
      return new ApiError.BadRequest('Вы уже подписаны на этот профиль')
    } else {
      await UserModel.findOneAndUpdate({
        _id: userId,
      }, {
        $push: {
          "userSubscriptions": id
        }
      })
      await UserModel.findOneAndUpdate({
        _id: id,
      }, {
        $push: {
          "userSubscribers": userId
        },
        $inc: {
          'rating': +1
        }
      })
    }
  }
  async unSubscribe(userId, id) {
    const checkCurrentUser = await UserModel.findOne({_id:userId,userSubscriptions:{"$in":[id]}})
    const checkChoseuser = await UserModel.findOne({_id:id,userSubscribers:{"$in":[userId]}})

    if (!checkCurrentUser && !checkChoseuser){
      return new ApiError.BadRequest('Вы уже отписаны с этого профиля')
    } else {
      await UserModel.findOneAndUpdate({
      _id: userId,
      }, {
        $pull: {
          "userSubscriptions": id
        }
      })
      await UserModel.findOneAndUpdate({
        _id: id,
      }, {
        $pull: {
          "userSubscribers": userId
        },
        $inc: {
          'rating': - 1
        }
      })
    }
  }
  async addFavorite(id,userId){
    const check = await UserModel.findOne({_id:userId,favoritesPosts:{"$in":[id]}})
    if (!check){
      const data = await PostModel.findById(id)
      const qwe = await UserModel.findOneAndUpdate({
        _id: data.user,
      }, {
        $inc: {
          'rating': + 1
        }
      })
      const user = await UserModel.findOneAndUpdate({
        _id: userId,
      }, {
        $push: {
          "favoritesPosts": id
        }
      })

      return user
    }
  }
  async removeFavorite(id, userId) {
    const check = await UserModel.findOne({_id:userId,favoritesPosts:{"$in":[id]}})

    if (check){
      const data = await PostModel.findById(id)
      const qwe = await UserModel.findOneAndUpdate({
        _id: data.user,
      }, {
        $inc: {
          'rating': - 1
        }
      })

      const user = await UserModel.findOneAndUpdate({
        _id: userId,
      }, {
        $pull: {
          "favoritesPosts": id
        }
      })

      return user
    }
  }
  async getUserProfile(id){
    const user = await UserModel.findById(id)
      .populate('habSubscribers')
      .populate('userSubscribers')
      .populate('userSubscriptions')
      .exec()
    const {password,...data} = user._doc
    return data
  }
  async getUserFavorites(id) {
    const user = await UserModel.findById(id)
    .populate({
      path: 'favoritesPosts',
      populate: {
        path: 'user',
        select: '-password'
      }
    }).exec()

    return user.favoritesPosts
  }
  async getUserSubs(id,type) {
    if (type === 'subscribers') {
      const user = await UserModel.findById(id)
        .populate('userSubscribers')

      return user.userSubscribers
    }

    if (type === 'subscriptions') {
      const user = await UserModel.findById(id)
        .populate('userSubscriptions')

      return user.userSubscriptions
    }
  }
  async getUserPosts(id){
    const posts = await PostModel.find({user:id}).populate('user', '-password').exec()
    return posts
  }
  async changeUserProfile(values,userId){
    // console.log(values);
    const user = await UserModel.findOneAndUpdate({
      _id: userId,
    }, {
      "avatar": values.avatar,
      "description": values.description,
      "fullName": values.fullName,
      "gender": values.gender,
      "dayOfBirth": values.dayOfBirth,
      "yearOfBirth": values.yearOfBirth,
      "monthOfBirth": values.monthOfBirth,
      "country": values.country,
      },{
        new:true
      })
    return user
  }
}

export default new UserService()