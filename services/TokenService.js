import jwt from 'jsonwebtoken'
import {TokenModel} from '../models/TokenModel.js'

import dotenv from 'dotenv'
dotenv.config()


class TokenService{
  generateTokens(payload){
    const accessToken = jwt.sign(payload, process.env.SECRET_ACCESS,{expiresIn:'30m'})
    const refreshToken = jwt.sign(payload, process.env.SECRET_REFRESH,{expiresIn:'30d'})

    return {
      accessToken,
      refreshToken
    }
  }
  

  async saveToken(userId,refreshToken){
    const data = await TokenModel.findOne({user:userId})

    if (data) {
      data.refreshToken = refreshToken
      return data.save()
    }

    const token = await TokenModel.create({
      user:userId,
      refreshToken
    })

    return token
  }

  async validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.SECRET_REFRESH)
      return userData
    } catch(e) {
      return null
    }
  }

  async fidnToken(refreshToken) {
    const tokenData = await TokenModel.findOne({refreshToken})
    return tokenData
  }
}

export default new TokenService()