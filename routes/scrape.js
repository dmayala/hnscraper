var request = require('request');
var cheerio = require('cheerio');

function getFeed(req, res) {
	request('https://news.ycombinator.com', function (error, response, html) {
	  if (!error && response.statusCode === 200) {
	    var $ = cheerio.load(html);
	 	var fullMetadata = [];

	    // return json with
	    // rank, title, url, points, username, comments (#)
	    $('span.comhead').each(function (i, element) {
	      var a = $(this).prev();
	      var rank = a.parent().parent().text();
	      var title = a.text();
	      var url = a.attr('href');
	      var subtext = a.parent().parent().next().children('.subtext').children();
	      var points = $(subtext).eq(0).text();
	      var username = $(subtext).eq(1).text();
	      var comments = $(subtext).eq(2).text();

	      var metadata = {
	        // parseInt ignores chars
	        rank: parseInt(rank, 10),
	        title: title,
	        url: url,
	        points: parseInt(points, 10),
	        username: username,
	        comments: parseInt(comments, 10)
	      };
	      fullMetadata.push(metadata);
	    });
	    res.send(fullMetadata);
	  }
	});
} 


exports.fetch = function(req, res){
  getFeed(req, res);
};