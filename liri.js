
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
		count: 21
	};
	client.get('statuses/user_timeline',params, function(error, tweets, response) {
    	if(error){
    		console.log("Twitter Error", error);
    	}
    	if(!error && response.statusCode === 200){
    		console.log("Confirm Response status",response.statusCode); //just checking for 200 status
			//console.log(tweets);

			//var tweetDetails=[];
			for(var i=1; i<tweets.length; i++){
				var tweet_text = "Tweet "+ i + ". "+ tweets[i].text;
				var tweet_time = "Date and Time: "+ tweets[i].created_at;
				// console.log(tweet_text);
				// console.log(tweet_time);
				
				var tweetDetails = tweet_text + "\n" + tweet_time + "\n\n";

				console.log(tweetDetails);
				logCommand(tweet_text);
				logCommand(tweet_time);

		

				//return console.log(tweetDetails);

				// tweetDetails.push({
				// 	"Tweet" : tweets[i].text,
				// 	'Date and Time tweeted': tweets[i].created_at
				// });
			};

			//return console.log(tweetDetails);
			
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
	}, function(error, data){
		if(error){
			console.log('Spotify Error: ',error);
		}
		//https://api.spotify.com/v1/search?query=All+the+small+things&type=track&offset=0&limit=1

		if(!error){
			var songData = data.tracks.items;
			//console.log(songData);

			var songDataArray = [];

			for(var i=0; i<songData.length; i++){
				songDataArray.push({
					'Artist':songData[0].album.artists[0].name,
					'Song name':songData[0].name, 
					'Preview link':songData[0].preview_url,
					'Album': songData[0].album.name
				});	
			}
				console.log(songDataArray);
				logCommand(songData);
		}
	});
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
	var movieUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece"; 
	//create your own keys later
	console.log(movieUrl);
	
	request(movieUrl, function(error, response, body){
		if(error){
			console.log("Error is: ", error);
		}
		if(!error && response.statusCode==200){
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
				'Actors':movieData.Actors
			});

			//console.log(movieDataArray);
			
			
			console.log(movieDataArray);
			logCommand(movieData);
		}
	});
};
//findMovie();



//...............................................................................
//file system Read, Write
var readRandomFile = function(){
	fs.readFile('random.txt', 'utf8', function(error, data){
	if(error){
		return console.log("Read Error: ", error);
	}
	//console.log("The file data is: ",data);
	var commandFromFile = data.split(',');
	console.log(commandFromFile);

	if(commandFromFile.length == 2){
		chooseAction(commandFromFile[0], commandFromFile[1]);
	}else if(commandFromFile.length == 1){
		chooseAction(commandFromFile[0]);
	}
	});
}
//readRandomFile();

var logCommand = function(data){

	fs.appendFile("log.txt", "\r\n")
	fs.appendFile('log.txt', JSON.stringify(data), function(error){
	if(error){
		return console.log("Append Error: ", error);
	}

	return true;
	//return console.log("Entry logged!");

	})
}
//logCommand();



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
    	if(actionData){
    		findMovie(actionData);
    	}else{
    		if(process.argv[3] != null){
    			var movieName = process.argv.slice(3).join('+');
    			findMovie(movieName);
    		}
    		else{
    			findMovie('Mr Nobody');
    		}
    	}
    	//findMovie()
      	break;
    case 'do-what-it-says':	
      	// var text = readRandomFile(); //assume this returns text
      	// return text;
      	readRandomFile();
      	break;
    default:
      	console.log('Enter a valid command:'+'my-tweets or spotify-this-song or movie-this');
  }
}
chooseAction(action);
	

