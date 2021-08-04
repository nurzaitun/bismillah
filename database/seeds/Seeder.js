"use strict";

const fs = require("fs");
const path = require("path");
const Database = use("Database");

class Seeder {
  async run() {
    await Database.raw(
      fs.readFileSync(path.join(__dirname, "data", "authors.sql")).toString()
    );
    await Database.raw(
      fs.readFileSync(path.join(__dirname, "data", "articles.sql")).toString()
    );
    await Database.raw(
      fs.readFileSync(path.join(__dirname, "data", "knnresults.sql")).toString()
    );
    await Database.raw(
      fs.readFileSync(path.join(__dirname, "data", "modes.sql")).toString()
    );
    await Database.raw(
      fs.readFileSync(path.join(__dirname, "data", "precisions.sql")).toString()
    );
    await Database.raw(
      fs.readFileSync(path.join(__dirname, "data", "recalls.sql")).toString()
    );
    await Database.raw(
      fs.readFileSync(path.join(__dirname, "data", "akurasis.sql")).toString()
    );
    await Database.raw(
      fs.readFileSync(path.join(__dirname, "data", "f_1_s.sql")).toString()
    );
  }
}

module.exports = Seeder;
