

var Twitter = require('twitter'); //importing twitter api
	var keysFromTwitter = require('./keys.js');  //importing object from keys.js
	//console.log(keysFromTwitter);
var Spotify = require('node-spotify-api');
var request = require('request');
var file = require('file-system');
var fs = require('fs');
// var omdbApi = require('omdb-client'); not needed
// var omdb = require('omdb'); not needed

//....................................................................
//TWITTER
var client = new Twitter(keysFromTwitter); //making a new tweet object

//you can get() or search requests by hashtag, location, by user etc 
// you can post () i.e. tweeting
// you can stream () i.e. be connected to the API and triggers an event,
// which can be responded to by some code.  

//making a get
var params ={ //specifying the parameters of request
	q: '@yaw_testing',
	count: 20
}
client.get('search/tweets', params, gotData);

function gotData(err, data, response){
	console.log(data);  //gives tweets with all date

	var tweets = data.statuses;
	for (var i = 0; i<tweets.length; i++){
		console.log(tweets[i].text); // give only the text of the tweet
	}
}
//............................................................................
//SPOTIFY
//connecting to spotify to SEARCH (used to fing artist, album, or track.)
var spotify = new Spotify({
	id: 'cd47ca9807b343a4a3855c9e2492fe7d',
	secret: '297aefc20ebc46e1b3f2bbacd0117c37'
});
spotify.search({
	type: 'track',
	query: 'All the small things',
	limit: 4
}, function(err, data){
	if(err){
		return console.log('Error is: ',err);
	}

	console.log(data);
})
//..........................................................................................
//OMDB
//Connecting to OMDB to find movies using request -- request has already been imported (line7)

var findMovie = function(movieName){

	if(movieName == undefined){
		movieName = "Mr Nobody";
	}
	var movieUrl = "http://www.omdbapi.com/?t="+movieName+"&y=&plot=short&apikey=40e9cece"; 
	//create your own keys later
	console.log(movieUrl);
	
	request(movieUrl, function(error, response, body){
		if(error){
			console.log("Error is: ", error);
		}else{
			console.log("Status code: ", response.statusCode);

			var movieData = JSON.parse(body);
			// console.log(movieData);

			var movieDataArray = [];
			movieDataArray.push({ //adding {} to make movieDataArray an oblect
				'Title':movieData.Title,
				'Release Year':movieData.Year,
				'IMDB Rating':movieData.imdbRating,
				'Rotten Tomatoes rating':movieData.Ratings[1].Value,
				'Country':movieData.Country,
				'Language':movieData.Language,
				'Plot':movieData.Plot,
				'Actors':movieData.Actors});

			console.log(movieDataArray);
			//writeToLog(movieDataArray); depends on fs
			
			return movieDataArray;
		}
	});
};
findMovie();
//...............................................................................
//file system Read, Write
fs.readFile('random.txt', 'utf8', function(err, data){
	if(err){
		return console.log("Read Error: ", err);
	}
	console.log("The file data is: ",data);

})
fs.appendFile('log.txt', ' FRANKONERO ', function(err){
	if(err){
		return console.log("Append Error: ", err);
	}
	console.log("saved !");

})


