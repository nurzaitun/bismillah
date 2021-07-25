'use strict'

const fs = require('fs');
const path = require('path');
const Database = use('Database')

class Seeder {
  async run() {
    await Database.raw(fs.readFileSync(path.join(__dirname, 'data', 'authors.sql')).toString());
    await Database.raw(fs.readFileSync(path.join(__dirname, 'data', 'articles.sql')).toString());
  }
}

module.exports = Seeder
