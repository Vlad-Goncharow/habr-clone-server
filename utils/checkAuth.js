import ApiError from "../exceptions/ApiError.js"
import jwt from "jsonwebtoken"

import dotenv from 'dotenv'
dotenv.config()

export default (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, '')
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_ACCESS)
      req.userId = decoded._id
      next()
    } catch (e) {
      throw ApiError.UnathorizedError()
    }
  } else {
    throw ApiError.UnathorizedError()
  }
}