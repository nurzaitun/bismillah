'use strict'

const Hash = use('Hash')
const Model = use('Model')
const Const = use('App/Const')
const { validate } = use('Validator');

class User extends Model {
  static boot () {
    super.boot()
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  static async validate(input) {
    return await validate(input, {
      phone: 'required',
      password: 'required',
    }, {
      'phone.required': 'Nomor HP wajib diisi.',
      'password.required': 'Password wajib diisi.',
    });
  }

  async isPassword(pwd) {
    return await Hash.verify(pwd, this.password);
  }

  tokens () {
    return this.hasMany('App/Models/Token')
  }

}

module.exports = User
