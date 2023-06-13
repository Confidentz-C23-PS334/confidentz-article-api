# About
Our prototype of Article Feature. We're showing news from Detik.com and Suara.com to our app. The news is first scraped using Scrapy and then Uploaded to Firebase Firestore using ExpressJs and the article is now ready to be consumed by our mobile application

# How to run
```bash
# on windows
git clone https://github.com/Confidentz-C23-PS334/confidentz-article-api.git
python -m venv .venv
.venv/Scripts/activate
pip install -r requirements.txt
scrapy crawl suara -o result/data.jsonl
scrapy crawl detik -o result/data.jsonl
node app.js # the data is now already on firestore
```