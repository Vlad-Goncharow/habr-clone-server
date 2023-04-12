import AuthorsService from "../services/AuthorsService.js"

class AuthorsController{
  async LoadCategoryAuthors(req,res,next){
    try {
      const {category,title,page} = req.params

      const authors = await AuthorsService.LoadCategoryAuthors(category, title, page)
      return res.json(authors)
    } catch(e){
      console.log(e);
      next(e)
    }
  }
  async LoadHabAuthors(req,res,next){
    try {
      const {id,title,page} = req.params
      const authors = await AuthorsService.LoadHabAuthors(id, title, page)
      return res.json(authors)
    } catch(e) {
      console.log(e);
      next(e)
    }
  }
}

export default new AuthorsController()