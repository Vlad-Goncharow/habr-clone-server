import HabService from '../services/HabService.js'

class HabController {
  async create(req,res,next){
    try{
      const values = req.body

      const hab = await HabService.create(values)

      return res.json(hab)
    } catch(e) {
      next(e)
    }
  }
  async loadSideHabs(req,res,next){
    try {
      const {category} = req.params
      const habs = await HabService.loadSideHabs(category)

      return res.json(habs)
    } catch(e){
      next(e)
    }
  }
  async subscribe(req,res,next) {
    try {
      const userId = req.userId

      const {id} = req.params

      const hab = await HabService.subscribe(userId,id)

      return res.json(hab)
    } catch(e){
      console.log(e);
      next(e)
    }
  }
  async unSubscribe(req, res, next) {
    try {
      const userId = req.userId
      const {id} = req.params
      const hab = await HabService.unSubscribe(userId, id)
      return res.json(hab)
    } catch(e){
      console.log(e);
      next(e)
    }
  }
  async getOne(req,res,next) {
    try {
      const {id} = req.params

      const data = await HabService.getOne(id)

      return res.json(data)
    } catch(e){
      next(e)
    }
  }
  async getHabsByCategory(req, res, next) {
    try {
      const {category} = req.params
      const habs = await HabService.getHabsByCategory(category)

      return res.json(habs)
    } catch(e){
      next(e)
    }
  }
  async searchHabs(req,res,next){
    try {
      const {category,value} = req.params
      const habs = await HabService.searchHabs(category,value)
      return res.json(habs)
    } catch(e){
      next(e)
    }
  }
}

export default new HabController()