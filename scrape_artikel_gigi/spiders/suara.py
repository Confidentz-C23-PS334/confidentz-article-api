import scrapy


class SuaraSpider(scrapy.Spider):
    name = "suara"
    # start_urls = ["https://www.detik.com/tag/kesehatan-gigi/?sortby=time&page=1", "https://www.detik.com/tag/kesehatan-gigi/?sortby=time&page=2"]
    start_urls = ["https://www.suara.com/tag/kesehatan-gigi-dan-mulut?page=" + str(i + 1) for i in range(3)]

    def parse(self, res):
        links = res.css('#main-content a.ellipsis2::attr(href)').getall()
        
        for a in links:
            yield scrapy.Request(a, callback=self.parse_article)
    
    def parse_article(self, res):
        def get(css):
            return res.css(css).get().strip()

        yield {
            "title": get('h1::text'),
            "author": get('author::text'),
            "date": get('time::text'),
            "website": 'suara.com',
            "body": "".join(res.css('article p').getall()),
        }