import os
from dotenv import load_dotenv
load_dotenv()
import knn
from flask import Flask
import json

# import nltk
# nltk.download('wordnet')
# nltk.download('stopwords')

app = Flask(__name__)

@app.route("/preprocess")
def preprocess():
  print('preprocessing...')
  cleaned_data = knn.preprocess()
  response = cleaned_data.to_dict('records')
  return json.dumps(response)

@app.route("/clustering")
def clustering():
  print('clustering...')
  cleaned_data = knn.preprocess()
  labeled_title = knn.kmean.title_labeling(cleaned_data)
  response = labeled_title.to_dict('records')
  return json.dumps(response)

@app.route("/knnprocess")
def knnprocess():
  print('proses knn...')
  cluster = knn.knnprocessjos()
  return cluster
  # return json.dumps(cluster)

app.run(
  port=8081,
  debug=True
)

# print(labeled_title)
