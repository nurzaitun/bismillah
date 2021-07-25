'use strict'

const Route = use('Route')

Route.get('/', 'IndexController.index');
Route.get('/crud', 'IndexController.crud');

Route.group(() => {
  Route.on('404').render('error/404', {title: 'Not Found'}).as('404');
})
  .prefix('/error');

Route
  .group(() => {
    Route.get('preprocess', 'ArticleController.preprocess');
    Route.get('cluster', 'ArticleController.cluster');
    Route.get('cluster-chart', 'ArticleController.clusterChart');
    Route.get('knn', 'ArticleController.knn');
  })
  .prefix('/articles');
Route.get('articles/:id/delete', 'ArticleController.destroy');
Route.post('articles/:id/edit', 'ArticleController.update');
Route.resource('articles', 'ArticleController');