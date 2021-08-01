from . import db
from . import preprocessor
from . import kmean
from . import knnprocess
from . import helperknn
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
import pandas as pd
import numpy as np
from sklearn.model_selection import KFold
from sklearn.metrics import f1_score
from sklearn.metrics import confusion_matrix
from sklearn.metrics import accuracy_score
from sklearn.metrics import recall_score
from sklearn.metrics import precision_score
import json

def preprocess():
  database = db.get_connection()
  articles = preprocessor.get_all_articles(database)
  articles_en = preprocessor.filter_by_title_lang(articles, 'en')
  tokenized_title = preprocessor.tokenize_title(articles_en)
  stemmed_title = preprocessor.stem_title(tokenized_title)
  return stemmed_title

def knnprocesslist():
  database = db.get_connection()
  cluster = knnprocess.get_all_cluster(database)
  XJudul = helperknn.df_stemmed_title(cluster)
  yJudul = helperknn.df_label(cluster)
  X = helperknn.tfidf(cluster).values.tolist()
  y = helperknn.df_label(cluster)
  xTrain, xTest, yTrain, yTest = train_test_split(X, y, test_size=0.1, random_state=None, shuffle=True, stratify=None)
  xTr, xTs, yTr, yTs = train_test_split(XJudul, yJudul, test_size=0.1, random_state=None, shuffle=True, stratify=None)  
  X = np.array(X)
  y = np.array(y)

  kf = KFold(n_splits=10)

  k = 5

  knn = KNeighborsClassifier(n_neighbors=k)

  list_akurasi = []
  list_precision = []
  list_recall = []
  list_f1 = []

  for train_index, test_index in kf.split(X):    
    X_train, X_test = X[train_index], X[test_index]
    y_train, y_test = y[train_index], y[test_index]
    
    knn.fit(X_train, y_train)
    y_pred = knn.predict(X_test)
    
    cm = confusion_matrix(y_test, y_pred)
    
    tp= cm[0,0]
    tn= cm[1,1]
    fp= cm[0,1]
    fn= cm[1,0]
  
    akurasi   = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, average='macro')
    recall    = recall_score(y_test, y_pred, average='macro')
    f1        = f1_score (y_test, y_pred, average='macro')

    list_akurasi.append(akurasi)
    list_precision.append(precision)
    list_recall.append(recall)
    list_f1.append(f1)
  dfCM = pd.DataFrame({'akurasi':list_akurasi, 'precision':list_precision, 'recall':list_recall, 'f1':list_f1})
  lists = json.dumps(dfCM.to_dict('records'))
  return lists

def knnprocessdescribe():
  database = db.get_connection()
  cluster = knnprocess.get_all_cluster(database)
  XJudul = helperknn.df_stemmed_title(cluster)
  yJudul = helperknn.df_label(cluster)
  X = helperknn.tfidf(cluster).values.tolist()
  y = helperknn.df_label(cluster)
  xTrain, xTest, yTrain, yTest = train_test_split(X, y, test_size=0.1, random_state=None, shuffle=True, stratify=None)
  xTr, xTs, yTr, yTs = train_test_split(XJudul, yJudul, test_size=0.1, random_state=None, shuffle=True, stratify=None)  
  X = np.array(X)
  y = np.array(y)

  kf = KFold(n_splits=10)

  k = 5

  knn = KNeighborsClassifier(n_neighbors=k)

  list_akurasi = []
  list_precision = []
  list_recall = []
  list_f1 = []

  for train_index, test_index in kf.split(X):    
    X_train, X_test = X[train_index], X[test_index]
    y_train, y_test = y[train_index], y[test_index]
    
    knn.fit(X_train, y_train)
    y_pred = knn.predict(X_test)
    
    cm = confusion_matrix(y_test, y_pred)
    
    tp= cm[0,0]
    tn= cm[1,1]
    fp= cm[0,1]
    fn= cm[1,0]
  
    akurasi   = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, average='macro')
    recall    = recall_score(y_test, y_pred, average='macro')
    f1        = f1_score (y_test, y_pred, average='macro')

    list_akurasi.append(akurasi)
    list_precision.append(precision)
    list_recall.append(recall)
    list_f1.append(f1)
  dfCM = pd.DataFrame({'akurasi':list_akurasi, 'precision':list_precision, 'recall':list_recall, 'f1':list_f1})
  describe = dfCM.describe().to_json()
  return describe