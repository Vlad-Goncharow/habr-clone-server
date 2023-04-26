export class UserDto {
  _id
  email
  nickName

  constructor(model) {
    this._id = model._id
    this.email = model.email
    this.nickName = model.nickName
  }
}
