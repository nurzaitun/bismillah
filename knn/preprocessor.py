import string
import pandas as pd
from langdetect import detect, detect_langs
import nltk
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer, WordNetLemmatizer
from nltk.corpus import stopwords
import re
import fasttext

regex = re.compile('[^a-zA-Z]')
stopwords = stopwords.words("english")
punctuation = f"’{string.punctuation}"
PRETRAINED_MODEL_PATH = '/home/hdinjos/Documents/learn/aha/lid.176.bin'
model = fasttext.load_model(PRETRAINED_MODEL_PATH)

def get_all_articles(db):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT id, title FROM articles")
    articles = cursor.fetchall()
    df = pd.DataFrame(articles)
    return df


def filter_by_title_lang(datum, lang):
    filter = lambda x: model.predict(x.lower())[0][0][9:] == lang
    result = datum.loc[datum["title"].apply(filter)]
    # result = datum[datum["title"].isin(title_en)]
    return result


def tokenize_title(datum):
    def clean_string(text):
        text = "".join([word for word in text if word not in punctuation])
        text = text.lower()
        clean_number = re.sub(r"\d+", "", text.lower())
        clean_char = regex.sub(" ", clean_number)
        text = " ".join([word for word in clean_char.split() if word not in stopwords])
        return text

    cleaned_title = list(map(clean_string, datum["title"].values.tolist()))
    datum.insert(len(datum.columns), "cleaned_title", cleaned_title)
    return datum


def stem_title(datum):
    result = []
    word_stemmer = PorterStemmer()
    lemma = WordNetLemmatizer()
    for title in datum["cleaned_title"].values.tolist():
        list_jos = list(title.split(" "))
        stem = []
        for token in list_jos:
            stem.append(word_stemmer.stem(token))
            lemma.lemmatize(token, pos="v")
        result.append(' '.join(stem))
    datum.insert(len(datum.columns), "stemmed_title", result)
    return datum
