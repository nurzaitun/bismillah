'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const Const = use('App/Const')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('role', 255).notNullable().default(Const.ROLE_REGISTRANT)
      table.string('fullname', 80)
      table.string('username', 80)
      table.string('email', 254)
      table.string('phone', 20).notNullable().unique()
      table.string('password', 60).notNullable()
      table.integer('school_npsn').unsigned()
      table.timestamps()

      table.index('phone')
      table.index('school_npsn')
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
