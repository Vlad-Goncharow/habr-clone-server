import { body } from 'express-validator'

export const registerValidation = [
  body('email','Некоректная почта').isEmail(),
  body('password','Пароль должен быть минимум 5 символов').isLength({min:5}),
  body('nickName','Никней должен быть минимум 5 символов').isLength({min:5})
]