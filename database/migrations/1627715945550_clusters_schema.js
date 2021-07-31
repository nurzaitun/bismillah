"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ClustersSchema extends Schema {
  up() {
    this.create("clusters", (table) => {
      table.increments();
      table.string("title");
      table.string("stemmed_title");
      table.integer("label");
      table.timestamps();
    });
  }

  down() {
    this.drop("clusters");
  }
}

module.exports = ClustersSchema;
