import {HabModel} from '../models/HabModel.js'
import PostService from './PostService.js';
import ApiError from '../exceptions/ApiError.js';
import { UserModel } from '../models/UserModel.js';

class HabService{
  async create(values){
    const hab = await HabModel.create({
      ...values,
    })

    return hab
  }
  async loadSideHabs(category){
    const habs = await HabModel.find({category})
    return habs
  }
  async checkAuthor(habName,userId){
    const data = await HabModel.findOne({title:habName,authors:{"$in":[userId]}})
    
    // ======== posts count +1
    await HabModel.findOneAndUpdate({
      title: habName
    }, {
      $inc:{
        'postsCount': + 1
      }
    })

    if (!data){
      await HabModel.findOneAndUpdate({
        title: habName
      }, {
        $push: {
          "authors": userId
        }
      })
    }
  }
  async getAllHabs(){
    const habs = await HabModel.find()
    return habs
  }
  async subscribe(userId, id) {
    const checkUser = await UserModel.findOne({_id:userId,habSubscribers:{"$in":[id]}})
    const checkCHab = await HabModel.findOne({_id:id,subscribers:{"$in":[userId]}})

    if (!checkUser && !checkCHab){
      await UserModel.findOneAndUpdate({
      _id: userId
      }, {
        $push: {
          "habSubscribers": id
        }
      })
      await HabModel.findOneAndUpdate({
        _id: id
      }, {
        $push: {
          "subscribers": userId
        },
        $inc:{
          "rating": + 0.1
        }
      },{
        new:true
      })
      return id
    } else {
      return new ApiError.BadRequest('Вы уже подписаны на этот Хаб')
    }
  }
  async unSubscribe(userId, id) {
    const checkUser = await UserModel.findOne({_id:userId,habSubscribers:{"$in":[id]}})
    const checkCHab = await HabModel.findOne({_id:id,subscribers:{"$in":[userId]}})

    if (checkUser && checkCHab) {
      await UserModel.findOneAndUpdate({
      _id: userId
      }, {
        $pull: {
          "habSubscribers": id
        }
      })
      await HabModel.findOneAndUpdate({
        _id: id,
      }, {
        $pull: {
          "subscribers": userId
        },
        $inc: {
          "rating": - 0.1
        }
      })
      return id
    } else {
      return new ApiError.BadRequest('Вы уже отписаны')
    }
  }
  async getOne(id) {
    const hab = await HabModel.findById(id).populate('authors', '-password').exec()
    return hab
  }
  async getHabsByCategory(category){
    if(category === 'all'){
      const habs = await HabModel.find()
      return habs
    } else {
      const habs = await HabModel.find({category})
      return habs
    }
  }
  async searchHabs(category,value) {
    if (category === 'all') {
      if(value !== 'all'){
        const habs = await HabModel.find({title:{$regex:value,$options: 'i'}})
        return habs
      } else {
        const habs = await HabModel.find()
        return habs
      }
    } else {
      if(value !== 'all'){
        const habs = await HabModel.find({category:category,title:{$regex:value,$options: 'i'}})
        return habs
      } else {
        const habs = await HabModel.find({category})
        return habs
      }
    }
  }
}

export default new HabService()