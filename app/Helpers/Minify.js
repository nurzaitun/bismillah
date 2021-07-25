const minify = require('html-minifier').minify;

module.exports = (HTML) => {
  return minify(HTML, {
    removeComments: true,
    removeEmptyAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    sortAttributes: true,
    sortClassName: true,
    collapseWhitespace: true,
    minifyJS: true,
  });
};