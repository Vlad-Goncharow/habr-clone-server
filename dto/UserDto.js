export class UserDto {
  _id
  email
  password
  nickName
  avatar
  karma
  rating
  fullName
  description
  gender
  dayOfBirth
  yearOfBirth
  monthOfBirth
  country
  posts
  habSubscribers
  userSubscribers
  userSubscriptions
  register
  lastActive

  constructor(model) {
    this._id = model._id
    this.email = model.email
    this.password = model.password
    this.nickName = model.nickName
    this.avatar = model.avatar
    this.karma = model.karma
    this.rating = model.rating
    this.fullName = model.fullName
    this.description = model.description
    this.gender = model.gender
    this.dayOfBirth = model.dayOfBirth
    this.yearOfBirth = model.yearOfBirth
    this.monthOfBirth = model.monthOfBirth
    this.country = model.country
    this.register = model.register
    this.lastActive = model.lastActive
    this.favoritesPosts = model.favoritesPosts
    this.habSubscribers = model.habSubscribers
    this.userSubscribers = model.userSubscribers
    this.userSubscriptions = model.userSubscriptions
  }
}
