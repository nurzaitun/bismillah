import string
import pandas as pd
from langdetect import detect, detect_langs
import nltk
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer, WordNetLemmatizer
from nltk.corpus import stopwords
import json

stopwords = stopwords.words("english")
punctuation = f"’{string.punctuation}"


def get_all_cluster(db):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT id, stemmed_title FROM clusters")
    clusters_all = cursor.fetchall()
    clusters = json.dumps(clusters_all)
    # print(articles)
    # df = pd.DataFrame(articles)
    # print(df)
    # return df
    return clusters