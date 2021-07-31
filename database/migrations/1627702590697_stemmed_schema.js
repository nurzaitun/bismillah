"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class StemmedSchema extends Schema {
  up() {
    this.create("stemmeds", (table) => {
      table.increments();
      table.string("title");
      table.timestamps();
    });
  }

  down() {
    this.drop("stemmeds");
  }
}

module.exports = StemmedSchema;
