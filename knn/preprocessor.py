import string
import pandas as pd
from langdetect import detect, detect_langs
import nltk
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer, WordNetLemmatizer
from nltk.corpus import stopwords
stopwords = stopwords.words('english')
punctuation = f'’{string.punctuation}'

def get_all_articles(db):
  cursor = db.cursor(dictionary=True)
  cursor.execute('SELECT id, title FROM articles')
  articles = cursor.fetchall()
  df=pd.DataFrame(articles)
  return df

def filter_by_title_lang(datum, lang):
  filter = lambda x: detect(x) == lang
  result = datum.loc[datum['title'].apply(filter)]
  return result

def tokenize_title(datum):
  def clean_string(text):
    text = ''.join([word for word in text if word not in punctuation])
    text = text.lower()  
    text = ' '.join([word for word in text.split() if word not in stopwords])
    return text
  cleaned_title = list(map(clean_string, datum['title'].values.tolist()))
  datum.insert(len(datum.columns), 'cleaned_title', cleaned_title)
  return datum

def stem_title(datum):
  result  = []
  # word_stemmer = PorterStemmer()
  lemma = WordNetLemmatizer()
  for title in datum['cleaned_title'].values.tolist():
    stem = [lemma.lemmatize(token) for token in title]
    result.append(''.join(stem))
  datum.insert(len(datum.columns), 'stemmed_title', result)
  return datum
