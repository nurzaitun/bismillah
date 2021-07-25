from sklearn.cluster import KMeans
from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd

def title_labeling(datum):
  V = TfidfVectorizer()
  vectorized_title = V.fit_transform(datum['cleaned_title'].values.tolist())
  model = KMeans(n_clusters=4, init='k-means++', max_iter=200, n_init=10, random_state=0)
  model.fit(vectorized_title)
  labels = model.labels_
  datum.insert(len(datum.columns), 'label', labels)
  return datum
