import pandas as pd

def get_all_cluster(db):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT id, stemmed_title, label FROM clusters")
    clusters_all = cursor.fetchall()
    df = pd.DataFrame(clusters_all)
    return df
