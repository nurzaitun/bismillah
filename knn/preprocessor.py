import string
import pandas as pd
from langdetect import detect, detect_langs
import nltk
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer, WordNetLemmatizer
from nltk.corpus import stopwords
import gcld3
import re
import spacy
from spacy_langdetect import LanguageDetector
from spacy.language import Language

detector = gcld3.NNetLanguageIdentifier(min_num_bytes=0,max_num_bytes=1000)
regex = re.compile('[^a-zA-Z]')
stopwords = stopwords.words("english")
punctuation = f"’{string.punctuation}"

nlp = spacy.load('en_core_web_sm')

@Language.factory('language_detector')
def language_detector(nlp, name):
    return LanguageDetector()

nlp.add_pipe('language_detector', last=True)


def get_all_articles(db):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT id, title FROM articles")
    articles = cursor.fetchall()
    df = pd.DataFrame(articles)
    return df


def filter_by_title_lang(datum, lang):
    list_title = datum['title'].values.tolist()
    title_en=[]
    for title in list_title:
        doc = nlp(title.lower())
        if (doc._.language["language"]) == 'en':
            title_en.append(title)
    filter = lambda x: detector.FindLanguage(text=x.lower()).language == lang
    # result = datum.loc[datum["title"].apply(filter)]
    result = datum[datum["title"].isin(title_en)]
    # print("ini filter result", result)
    return result


def tokenize_title(datum):
    def clean_string(text):
        text = "".join([word for word in text if word not in punctuation])
        text = text.lower()
        clean_number = re.sub(r"\d+", "", text.lower())
        clean_char = regex.sub(" ", clean_number)
        # print("BAABABA  ", clean_char)
        text = " ".join([word for word in clean_char.split() if word not in stopwords])
        return text

    cleaned_title = list(map(clean_string, datum["title"].values.tolist()))
    # print(cleaned_title)
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
