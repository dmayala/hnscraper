var ScrapeHandler = require('./scrape');

module.exports = exports = function(app){
  var scrapeHandler = new ScrapeHandler(app);

  app.get('/api/scrape', scrapeHandler.fetch);
}