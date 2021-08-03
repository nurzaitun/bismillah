"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class RecallSchema extends Schema {
  up() {
    this.create("recalls", (table) => {
      table.increments();
      table.integer("count");
      table.string("mean");
      table.string("std");
      table.string("min");
      table.string("25%");
      table.string("50%");
      table.string("75%");
      table.string("max");
      table.timestamps();
    });
  }

  down() {
    this.drop("recalls");
  }
}

module.exports = RecallSchema;
