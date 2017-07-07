// MODULES
const keys = require('./keys');
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');
const moment = require('moment');
const fs = require('fs');

// VARS
let userInput1 = process.argv[2];
let userInput2 = process.argv[3];

// INPUT EVALUATION
function letsGo () {
  if (userInput1) {
    if (userInput1 === "my-tweets") {
      if (!userInput2) {
        userInput2 = "nodemashups";
      }
      twit();
    }
    if (userInput1 === "spotify-this-song") {
      if (!userInput2) {
        userInput2 = "The Sign";
      }
      spot();
    }
    if (userInput1 === "movie-this") {
      if (!userInput2) {
        userInput2 = "Mr+Nobody";
      }
      omdb();
    }
    if (userInput1 === "do-what-it-says") {
      filesys();
    }
  }
  log();
}


function twit() {
  var client = new Twitter({
    consumer_key: keys.auth.twitterKeys.consumer_key,
    consumer_secret: keys.auth.twitterKeys.consumer_secret,
    access_token_key: keys.auth.twitterKeys.access_token_key,
    access_token_secret: keys.auth.twitterKeys.access_token_secret
  });

  var params = {
    screen_name: userInput2
  };
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      var cleanTweets = JSON.stringify(tweets, null, 2);
      var cleanResponse = JSON.stringify(response, null, 2);
      tweets.forEach(function(item) {
        console.log(moment(item.created_at, "ddd MMM DD HH:mm:ss SSSSS YYYY").utc().format("MM-DD-YYYY hh:mm") + " | " + item.text);
      })
    }
  });
}

function spot() {

  var spotify = new Spotify({
    id: keys.auth.spotifyKeys.id,
    secret: keys.auth.spotifyKeys.secret
  });

  spotify.search({
    type: 'track',
    query: userInput2
  }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    var cleanSpotify = JSON.stringify(data, null, 2);
    var theData = data.tracks.items;
    theData.forEach(function(item) {
      console.log(item.artists[0].name, item.name, item.album.name, item.external_urls.spotify);
    });
  });

}

function omdb() {
  var request = require('request');
  request('http://www.omdbapi.com/' + '?apikey=40e9cece&t=' + userInput2, function(error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received

    var cleanOMDB = JSON.parse(body, null, 2); // Print the HTML for the Google homepage

    console.log(cleanOMDB.Title, cleanOMDB.Year, cleanOMDB.Ratings[0].Value, cleanOMDB.Ratings[1].Value, cleanOMDB.Country, cleanOMDB.Language, cleanOMDB.Plot, cleanOMDB.Actors);
  });
}

function filesys () {
  fs.readFile('../random.txt', (err, data) => {
    if (err) throw err;
    var cleanRead = data.toString('utf8');
    console.log(cleanRead)
    var readSplit = cleanRead.trim().split(",");
    console.log(readSplit);

    userInput1 = readSplit[0];
    userInput2 = readSplit[1];

    letsGo();

  });
}

function log () {
  fs.appendFile('../log.txt', userInput1 + " " + userInput2 + "\n", (err) => {
    if (err) throw err;
    console.log('The "data to append" was appended to file!');
  });
}

letsGo();
