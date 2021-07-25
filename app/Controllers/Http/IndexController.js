'use strict'

const minify = use('App/Helpers/Minify');

class IndexController {

  index({ response, view }) {
    return minify(view.render('index'));
  }

  crud({ response, view }) {
    return minify(view.render('crud', {
      title: 'CRUD'
    }));
  }

}

module.exports = IndexController
