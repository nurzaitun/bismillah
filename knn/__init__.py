from . import db
from . import preprocessor
from . import kmean
from . import knnprocess

def preprocess():
  database = db.get_connection()
  articles = preprocessor.get_all_articles(database)
  articles_en = preprocessor.filter_by_title_lang(articles, 'en')
  tokenized_title = preprocessor.tokenize_title(articles_en)
  stemmed_title = preprocessor.stem_title(tokenized_title)
  return stemmed_title

def knnprocessjos():
  database = db.get_connection()
  cluster = knnprocess.get_all_cluster(database)
  return cluster