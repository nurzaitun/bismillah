from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_extraction.text import CountVectorizer
import pandas as pd

def df_label(df):
  return df['label'].tolist()

def df_stemmed_title(df):
  return df['stemmed_title'].tolist()

def tfidf(datum):
  V = TfidfVectorizer()
  title =  df_stemmed_title(datum)
  vectorized_title =  V.fit_transform(title)
  feature_names = V.get_feature_names()
  dense = vectorized_title.todense()
  denselist = dense.tolist()
  result = pd.DataFrame(denselist, columns=feature_names)
  return result



