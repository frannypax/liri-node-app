
var Twitter = require('twitter'); //importing twitter api
var keysFromTwitter = require('./keys.js');	//importing object from keys.js
var Spotify = require('node-spotify-api');
var request = require('request');
var file = require('file-system');
var fs = require('fs');

//....................................................................
//TWITTER
myTweets = function(){
	var client = new Twitter(keysFromTwitter); //making a new tweet object

	//you can get() or search requests by hashtag, location, by user etc 
	// you can post () i.e. tweeting
	// you can stream () i.e. be connected to the API and triggers an event,
	// which can be responded to by some code.  

	//making a get
	var params ={ //specifying the parameters of request
		screen_name: 'yaw_testing',
		count: 20
	};
	client.get('statuses/user_timeline',params, function(error, tweets, response) {
    	if(error){
    		console.log("Twitter Error", error);
    	}
    	if(!error && response.statusCode === 200){
    		console.log("Confirm Response status",response.statusCode); //just checking for 200 status
			//console.log(tweets);

			var tweetDetails=[];
			for(var i=1; i<tweets.length; i++){
				console.log("Tweet",i,tweets[i].text) //just asking twitter API to return only the text of the tweet

				tweetDetails.push({
					"Tweet" : tweets[i].text,
					'Date and Time tweeted': tweets[i].created_at
				});
			}
			console.log(tweetDetails);
			//writeToLog(data);
    	}
});
}
//myTweets();

//............................................................................
//SPOTIFY
//function that will be called to search a song 
var findSong = function(songName){
	if(songName === undefined){  // not working for double-worded songs
		songName = 'The Sign';
	}
	var spotify = new Spotify({
		id: 'cd47ca9807b343a4a3855c9e2492fe7d',
		secret: '297aefc20ebc46e1b3f2bbacd0117c37'
	});
	spotify.search({ //connect to spotify to SEARCH (used to fing artist, album, or track.)
		type: 'track', //can also be artist or album
		query: songName,//'All the small things',
		limit: 1
	}, function(err, data){
		if(err){
			return console.log('Spotify Error: ',err);
		}
		//https://api.spotify.com/v1/search?query=All+the+small+things&type=track&offset=0&limit=1

		if(!err){
			var songData = data.tracks.items;
			//console.log(songData);

			var songDataArray = [];

			for(var i=0; i<songData.length; i++){
				songDataArray.push({
					'Artist':songData[0].album.artists[0].name,
					'Song name':songData[0].name, 
					'Preview link':songData[0].preview_url,
					'Album': songData[0].album.name
				}	
				);
				
			}
			return console.log(songDataArray);
		}
	})
};
// findSong();
//..........................................................................................
//OMDB
//Connecting to OMDB to find movies using request -- request has already been imported (line7)

var findMovie = function(movieName){

	if(movieName === undefined){
		movieName = "Mr Nobody"
	};
	//if(movieName ===""){
	// var movieName = "";
	// for(var i=3; i<process.argv.length; i++){
	// movieName += process.argv[i] + " ";
	//}
	var movieUrl = "http://www.omdbapi.com/?t="+movieName+"&y=&plot=short&apikey=40e9cece"; 
	//create your own keys later
	console.log(movieUrl);
	
	request(movieUrl, function(error, response, body){
		if(error){
			console.log("Error is: ", error);
		}
		if(!error && response.statusCode===200){
			console.log("Request Successful - see statusCode",response.statusCode);

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
//findMovie();



//...............................................................................
//file system Read, Write
var readRandomFile = function(){
	fs.readFile('random.txt', 'utf8', function(err, data){
	if(err){
		return console.log("Read Error: ", err);
	}
	console.log("The file data is: ",data);
	var commandFromFile = data.split(',');
	console.log(commandFromFile);
	chooseAction(commandFromFile[0], commandFromFile[1]);

})

}
//readRandomFile();
//
var logCommand = function(){

	var inputs = process.argv.slice(2).join(" ");
	fs.appendFile('log.txt', '\nBash user inputs:'+ inputs , function(err){
	if(err){
		return console.log("Append Error: ", err);
	}
	//console.log(inputs);
	console.log("Entry logged!");

})

}
logCommand();



//.......................................................................

//CHOOSING A TWEET OR SONG OR MOVIE etc..

var action = process.argv[2];

var chooseAction = function(action, actionData) {
  switch (action) {
    case 'my-tweets':
      	myTweets();
      	break;
    case 'spotify-this-song':
    	if(actionData){
    		//console.log(actionData); this will always log process.argv[2]
    		findSong(actionData);
    	}
    	else{
    		if(process.argv[3] != null){
    			var songName = process.argv.slice(3).join('+');
    			findSong(songName);
    		}
    		else{
    			findSong('The Sign');
    		}
    	}
      	//findSong(actionData);
      	break;
    case 'movie-this':
    	findMovie(actionData);
      	break;
    case 'do-what-it-says':
      	readRandomFile();
      	break;
    default:
      	console.log('Enter a valid command');
  }
}
chooseAction(action);
	

