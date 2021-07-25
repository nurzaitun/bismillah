'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ArticleSchema extends Schema {
  up () {
    this.create('articles', (table) => {
      table.increments()
      table.string('nidn')
      table.string('niy')
      table.string('nama')
      table.string('google_scholar_id')
      table.string('title')
      table.string('authors')
      table.string('venue')
      table.string('citation')
      table.integer('year')
      table.timestamps()
    })
  }

  down () {
    this.drop('articles')
  }
}

module.exports = ArticleSchema
