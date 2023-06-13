import scrapy


class DetikSpider(scrapy.Spider):
    name = "detik"
    start_urls = ["https://www.detik.com/tag/kesehatan-gigi/?sortby=time&page=" + str(i + 1) for i in range(5)]

    def parse(self, res):
        links = res.css('.list-berita a::attr(href)').getall()
        
        for a in links:
            yield scrapy.Request(a, callback=self.parse_article)
    
    def parse_article(self, res):
        def get(css, css2=""):
            text = res.css(css).getall()
            if text:
                text = [t.strip() for t in text]
                return text[0] if len(text) == 1 else "".join(text)
            if css2:
                return get(css2)
            return ""
        
        yield {
            "title": get('h1::text'),
            "author": get('.detail__author::text', '.author::text'),
            "date": get('.detail__date::text', '.date::text'),
            "website": 'detik.com',
            "body": get('.detail__body-text p', '.detail_text p'),
        }
