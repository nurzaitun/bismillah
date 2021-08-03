"use strict";

const Mode = use("App/Models/Mode");

const minify = use("App/Helpers/Minify");

class IndexController {
  index({ response, view }) {
    return minify(view.render("index"));
  }

  crud({ response, view }) {
    return minify(
      view.render("crud", {
        title: "CRUD",
      })
    );
  }

  async settingKnn({ response, view }) {
    const mode = await Mode.all();

    return minify(
      view.render("article/settingknn", {
        title: "Setting Knn",
        mode: mode.toJSON()[0].constant,
      })
    );
  }

  async updateSettingKnn({ request, response, view }) {
    const req = request.post();
    const { mode } = req;
    await Mode.query().where("id", 1).update({ constant: mode });
    response.redirect("/");
  }
}

module.exports = IndexController;
