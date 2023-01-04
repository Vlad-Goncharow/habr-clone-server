import ApiError from '../exceptions/ApiError.js'

export const ErrorMiddleWare = (err,req,res,next) =>{
  if (err instanceof ApiError) {
    return res.status(err.status).json({message:err.message,error:err.errors})
  }

  return res.status(500).json({
    message: 'Непредвиденная ошибка'
  })
}