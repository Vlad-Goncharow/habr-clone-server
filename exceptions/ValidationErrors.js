import { validationResult } from 'express-validator'
import ApiError from './ApiError.js'

export default (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
  }

  next()
}