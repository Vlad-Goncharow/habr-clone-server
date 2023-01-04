import {CategoryAuthorsModel} from '../models/CategoryAuthorsModel.js'
import { HabAuthorsModel } from '../models/HabAuthorsModel.js'

class AuthorsService {
  async LoadCategoryAuthors(category,title){
    if(category !== 'all'){
      const data = await CategoryAuthorsModel.findOne({category:category}).populate('authors', '-password').exec()
      if(title === 'all'){
        return data !== null ? data.authors : []
      } else {
        const arr = data !== null ? data.authors.filter(el => el.nickName.includes(title)) : []
        return arr
      }

    } else {
      const data = await CategoryAuthorsModel.find().populate('authors', '-password').exec()
      const arr = []
      data.forEach(el => {
        arr.push(...el.authors)
      })
      if (title === 'all') {
        return arr.filter((el, index, array) => index === array.indexOf(el))
      } else {
        return arr.filter((el, index, array) => index === array.indexOf(el)).filter(el => el.nickName.includes(title))
      }
    }
  }
  async addCategiryAuthors(category,userId){
    const findCategory = await CategoryAuthorsModel.findOne({category:category})
    if (!findCategory){
      await CategoryAuthorsModel.create({
        category,
        authors:[userId]
      })
    } else {
      const check = await CategoryAuthorsModel.findOne({category:category, authors:{"$in":[userId]}})
      if(!check){
        await CategoryAuthorsModel.findOneAndUpdate({
          category: category
        }, {
          "$push": {
            authors: userId
          }
        }, {
          new: true
        })
      } 
    }
  }

  async LoadHabAuthors(id,title){
    if(title === 'all'){
      const data = await HabAuthorsModel.findOne({hab:id}).populate('authors','-password')
      return data !== null ? data.authors : []
    } else {
      const data = await HabAuthorsModel.findOne({hab:id}).populate('authors','-password')
      return data !== null ? data.authors.filter(el => el.nickName.includes(title)) : []
    }
  }
  async addHabAuthors(habId,userId){
    const findCategory = await HabAuthorsModel.findOne({hab:habId})
    if (!findCategory){
      await HabAuthorsModel.create({
        hab:habId,
        authors:[userId]
      })
    } else {
      const check = await HabAuthorsModel.findOne({hab:habId, authors:{"$in":[userId]}})
      if(!check){
        await HabAuthorsModel.findOneAndUpdate({
          hab: habId
        }, {
          "$push": {
            authors: userId
          }
        }, {
          new: true
        })
      } 
    }
  }
}

export default new AuthorsService()