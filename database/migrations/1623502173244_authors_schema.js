'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AuthorsSchema extends Schema {
  up () {
    this.create('authors', (table) => {
      table.increments()
      table.string('niy');
      table.string('nidn');
      table.string('nama');
      table.string('google_scholar_id');
      table.boolean('scraped');
      table.timestamps()
    })
  }

  down () {
    this.drop('authors')
  }
}

module.exports = AuthorsSchema
