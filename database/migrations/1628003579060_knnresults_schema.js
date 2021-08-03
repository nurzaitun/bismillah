"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class KnnresultsSchema extends Schema {
  up() {
    this.create("knnresults", (table) => {
      table.increments();
      table.string("akurasi");
      table.string("precision");
      table.string("recall");
      table.string("f1");
      table.timestamps();
    });
  }

  down() {
    this.drop("knnresults");
  }
}

module.exports = KnnresultsSchema;
