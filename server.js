const request = require('request')
const crypto = require('crypto')
const OAuth = require('oauth-1.0a')
var express = require('express')
var app = express()
var cors = require('cors');

app.use(cors({origin: 'http://localhost:63342'}));
var config = require('./config')

function hash_function_sha1(base_string, key) {
  return crypto.createHmac('sha1', key).update(base_string).digest('base64');
}

const oauth = OAuth({
  consumer: {
    key: config.twitterAuth.consumerKey,
    secret: config.twitterAuth.consumerSecret
  },
  signature_method: 'HMAC-SHA1',
  hash_function(base_string, key) {
    return crypto.createHmac('sha1', key).update(base_string).digest('base64');
  }
});

// // Note: The token is optional for some requests
const token = {
  key: config.twitterAuth.userKey,
  secret: config.twitterAuth.userSecret
};



app.get('/twitterAPI', function(req, res) {
  var twitterHandle = req.query.user
  const request_data = {
    url: 'https://api.twitter.com/1.1/search/tweets.json?q=' + twitterHandle +  '&count=50&result_type=popular&tweet_mode=extended',
    method: 'GET'
  }
  console.log(request_data.url)

  request({
    url: request_data.url,
    method: request_data.method,
    form: request_data.data,
    headers: oauth.toHeader(oauth.authorize(request_data, token))
  }, function(error, response, body) {
    // Process your data here
    console.log(body)
    res.json(JSON.parse(body));
  })

});

app.listen(process.env.PORT || 8080, () => {
    console.log('meow')
})
