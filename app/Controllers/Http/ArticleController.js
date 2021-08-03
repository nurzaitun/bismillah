"use strict";

const axios = require("axios");
const cheerio = require("cheerio");

const minify = use("App/Helpers/Minify");
const Article = use("App/Models/Article");
const Author = use("App/Models/Author");
const Cluster = use("App/Models/Cluster");
const host = "http://127.0.0.1:8081";

class ArticleController {
  async index({ response, view }) {
    const authors = (await Author.all()).toJSON();
    const unscrapedAuthors = authors
      .filter((a) => !a.scraped)
      .map(async (author) => {
        const res = await axios.get(
          `https://scholar.google.com/citations?hl=id&user=${author.google_scholar_id}`
        );
        const $ = cheerio.load(res.data);
        const domPublications = $("#gsc_a_t .gsc_a_tr");
        const publications = [];
        if (domPublications.length > 0) {
          domPublications.each((idx) => {
            const domPublication = $.load(domPublications[idx]);
            const title = $.load(domPublication(".gsc_a_at")["0"]).text();
            const gs_gray = domPublication(".gs_gray");
            const authors = $.load(gs_gray["0"]).text();
            const venue = $.load(gs_gray["1"]).text();
            const citation = parseInt(
              $.load(domPublication(".gsc_a_ac")["0"]).text()
            );
            const year = parseInt(
              $.load(domPublication(".gsc_a_h")["0"]).text()
            );
            const publication = {
              title,
              authors,
              venue,
              citation: isNaN(citation) ? 0 : citation,
              year: isNaN(year) ? 0 : year,
            };
            publications.push(publication);
          });

          await Author.query("id", author.id).update({ scraped: true });
          return Promise.allSettled(
            publications.map(async (publication) => {
              return await Article.create({
                nidn: author.nidn,
                niy: author.niy,
                nama: author.nama,
                ...publication,
              });
            })
          );
        }
      });
    await Promise.allSettled(unscrapedAuthors);

    const articlesQ = await Article.all();
    const articles = articlesQ.toJSON();
    return minify(
      view.render("article/index", {
        title: "History",
        articles,
      })
    );
  }

  async create({ response, view }) {
    const authors = (await Author.all()).toJSON();

    return minify(
      view.render("article/create", {
        title: "Load Data",
        authors,
      })
    );
  }

  async edit({ request, response, view }) {
    const { id } = request.params;
    const author = (await Author.find(id)).toJSON();
    const authors = (await Author.all()).toJSON();

    return minify(
      view.render("article/edit", {
        title: "Load Data",
        author,
        authors,
      })
    );
  }

  async store({ request, response, session, view }) {
    const articleInput = request.all();
    try {
      const validation = await Author.validate(articleInput);
      if (validation.fails()) {
        session.withErrors(validation.messages()).flashExcept([]);
        throw Error();
      }
      await Author.create({
        nidn: articleInput.nidn,
        niy: articleInput.niy,
        nama: articleInput.nama,
        google_scholar_id: articleInput.google_scholar_id,
      });

      session.flash({ "article-success": "Berhasil menambah artikel." });
      return response.route("ArticleController.create");
    } catch (error) {
      console.log(error);
      session.withErrors([
        {
          message: "Gagal menyimpan.",
          field: "fail",
        },
      ]);
      return response.redirect("back");
    }
  }

  async update({ request, response, session, view }) {
    const { id } = request.params;
    const articleInput = request.all();
    try {
      const validation = await Author.validate(articleInput);
      if (validation.fails()) {
        session.withErrors(validation.messages()).flashExcept([]);
        throw Error();
      }

      await Author.query().where("id", id).update({
        nidn: articleInput.nidn,
        niy: articleInput.niy,
        nama: articleInput.nama,
        google_scholar_id: articleInput.google_scholar_id,
      });

      session.flash({ "article-success": "Berhasil mengubah data author." });
      return response.route("ArticleController.create");
    } catch (error) {
      console.log(error);
      session.withErrors([
        {
          message: "Gagal menyimpan.",
          field: "fail",
        },
      ]);
      return response.redirect("back");
    }
  }

  async destroy({ request, response, session, view }) {
    try {
      const { id } = request.params;
      const author = await Author.find(id);
      // await Author.query().where('id', id).delete();
      await Article.query().where("nidn", author.nidn).delete();
      await author.delete();
      session.flash({ "article-success": "Berhasil menghapus data author." });
      return response.route("ArticleController.create");
    } catch (error) {
      console.log(error);
      session.withErrors([
        {
          message: "Gagal menghapus.",
          field: "fail",
        },
      ]);
      return response.redirect("back");
    }
  }

  async preprocess({ session, response, view }) {
    const articlesQ = await Article.all();
    const articles = articlesQ.toJSON();

    const res = await axios.get(`${host}/preprocess`);
    const preprocess = res.data;

    const result = preprocess.map((article) => {
      const matchArticle = articles.filter((fa) => fa.id === article.id);
      return matchArticle.length > 0
        ? {
            ...article,
            ...matchArticle[0],
          }
        : article;
    });

    // console.log(session.all());
    return minify(
      view.render("article/preprocess", {
        title: "Hasil Preprocessing",
        articles: result,
      })
    );
  }

  async cluster({ response, view }) {
    await Cluster.truncate();
    const articlesQ = await Article.all();
    const articles = articlesQ.toJSON();

    const res = await axios.get(`${host}/clustering`);
    const clustering = res.data;

    if (res) {
      const cluster = res.data.map((title) => ({
        title: title.title,
        stemmed_title: title.stemmed_title,
        label: title.label,
      }));
      await Cluster.createMany(cluster);
    }

    const result = clustering.map((article) => {
      const matchArticle = articles.filter((fa) => fa.id === article.id);
      return matchArticle.length > 0
        ? {
            ...article,
            ...matchArticle[0],
          }
        : article;
    });

    return minify(
      view.render("article/cluster", {
        title: "Hasil Clustering",
        articles: result,
      })
    );
  }

  async clusterChart({ response, view }) {
    const articlesQ = await Article.all();
    const articles = articlesQ.toJSON();
    return minify(
      view.render("article/cluster-chart", {
        title: "Grafik Cluster",
        articles,
      })
    );
  }

  async knn({ session, response, view }) {
    const clusterJos = await Cluster.all();
    const cluster = clusterJos.toJSON();

    return minify(
      view.render("article/knn", {
        title: "Proses KNN",
        articles: cluster,
      })
    );
  }

  async knnResult({ response, view }) {
    const resLists = await axios.get(`${host}/knnprocesslist`);
    const resDescribe = await axios.get(`${host}/knnprocessdescribe`);
    const dataDescribe = resDescribe.data;
    const lists = resLists.data.map((item) => {
      return {
        akurasi: item.akurasi.toFixed(2),
        precision: item.precision.toFixed(2),
        recall: item.recall.toFixed(2),
        f1: item.f1.toFixed(2),
      };
    });
    const describe = {
      akurasi: {
        count: parseInt(dataDescribe.akurasi.count),
        mean: dataDescribe.akurasi.mean.toFixed(2),
        std: dataDescribe.akurasi.std.toFixed(2),
        min: dataDescribe.akurasi.min.toFixed(2),
        "25%": dataDescribe.akurasi["25%"].toFixed(2),
        "50%": dataDescribe.akurasi["50%"].toFixed(2),
        "75%": dataDescribe.akurasi["75%"].toFixed(2),
        max: dataDescribe.akurasi.max.toFixed(2),
      },
      precision: {
        count: parseInt(dataDescribe.precision.count),
        mean: dataDescribe.precision.mean.toFixed(2),
        std: dataDescribe.precision.std.toFixed(2),
        min: dataDescribe.precision.min.toFixed(2),
        "25%": dataDescribe.precision["25%"].toFixed(2),
        "50%": dataDescribe.precision["50%"].toFixed(2),
        "75%": dataDescribe.precision["75%"].toFixed(2),
        max: dataDescribe.precision.max.toFixed(2),
      },
      recall: {
        count: parseInt(dataDescribe.recall.count),
        mean: dataDescribe.recall.mean.toFixed(2),
        std: dataDescribe.recall.std.toFixed(2),
        min: dataDescribe.recall.min.toFixed(2),
        "25%": dataDescribe.recall["25%"].toFixed(2),
        "50%": dataDescribe.recall["50%"].toFixed(2),
        "75%": dataDescribe.recall["75%"].toFixed(2),
        max: dataDescribe.recall.max.toFixed(2),
      },
      f1: {
        count: parseInt(dataDescribe.f1.count),
        mean: dataDescribe.f1.mean.toFixed(2),
        std: dataDescribe.f1.std.toFixed(2),
        min: dataDescribe.f1.min.toFixed(2),
        "25%": dataDescribe.f1["25%"].toFixed(2),
        "50%": dataDescribe.f1["50%"].toFixed(2),
        "75%": dataDescribe.f1["75%"].toFixed(2),
        max: dataDescribe.f1.max.toFixed(2),
      },
    };
    return minify(
      view.render("article/knnResult", {
        title: "Hasil Proses KNN",
        lists,
        describe,
      })
    );
  }

  async about({ response, view }) {
    return minify(
      view.render("article/about", {
        title: "About",
      })
    );
  }
}

module.exports = ArticleController;
