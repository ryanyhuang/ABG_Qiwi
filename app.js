//express default setup stuff==============================
var express = require('express');
var path = require('path');
var http = require('http');
var fs = require('fs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.engine('jade', require('jade').__express);
app.use(express.static(path.join(__dirname, 'client')));

app.get("/", function(req, res){
    res.render("index");
});

/*
app.get("/test", function(req, res){
    res.render("test");
});
*/

//=========================================================
var SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId : '7bccf322d5644ad4905b43e7d0f61f7f',
  clientSecret : 'f29e679682c04d6b84f3e4aae6f5adae',
  redirectUri : 'http://www.example.com/callback'
});

//=========================================================
var firebase = require("firebase");

var config = {
    apiKey: "AIzaSyAsPT8glXqwLVhWhFYCziwS--d6p-Aowkw",
    authDomain: "qiwi-abg.firebaseapp.com",
    databaseURL: "https://qiwi-abg.firebaseio.com",
    storageBucket: "qiwi-abg.appspot.com"
  };
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();

//=========================================================

var server = http.createServer(app);
var io = require('socket.io').listen(server);

//sockets listening========================================
io.sockets.on('connection', function(socket){
	console.log('user connected');

	socket.on('searchChanged', function(data, fn){
		
		var retTracks = [];

        spotifyApi.searchTracks("album:" + data, { 'limit': 15 })
            .then(function(res) {                  
                
				for (var i = 0; i < 15; i++) {
					//if(res==undefined) continue;
					//if(res.body.tracks.item[i] == undefined) continue;
					var songInfo = {
						song_album: res.body.tracks.items[i].album.name,
						song_name: res.body.tracks.items[i].name,
						song_artist: res.body.tracks.items[i].artists[0].name,
						song_id: res.body.tracks.items[i].id,
						song_img: res.body.tracks.items[i].album.images[2].url

					};
					//console.log("name: %s, id: %s", songInfo.song_name, songInfo.song_id);
					retTracks.push(songInfo);

				}

        		fn(retTracks);


            }, function(err) {
            	console.error("error happened");
                console.error(err);
            }
        );

    });

    socket.on('verifyPass', function(data, fn){
    	var passcode = data;

		firebase.database().ref('/parties').once('value').then(function(snapshot) {
			var passcodes = snapshot.val();
			
			if(passcodes.hasOwnProperty(passcode)){
		  		fn(true);

			} else {
		  		fn(false);

			}

		});

    });


   	socket.on('addSong', function(data){
   		console.log("adding song: %s", data.song_name);
   		console.log("with the id: %s", data.song_id);
   		console.log("from the room: %s", data.room);
   		console.log("from the user: %s", data.user);

   		var songRequest = data;

		var roomurl = 'parties/' + songRequest.room;



		firebase.database().ref(roomurl).once('value').then(function(snapshot) {
			var room_requests_list = snapshot.val().request_list_id;
			console.log(room_requests_list);

			var isemptyurl = 'songlists/' + room_requests_list + "/empty";
			var isempty = false;

			firebase.database().ref(isemptyurl).once('value').then(function(snapshot3){
				console.log("snapshotvalue:%s", snapshot3.val());
				if(snapshot3.val() == true) isempty = true;

				var songlisturl = 'songlists/' + room_requests_list + '/songs/';
				console.log(songlisturl);
				firebase.database().ref(songlisturl).once('value').then(function(snapshot2) {
					console.log(snapshot2.val());
					var newarr = [];

					if(!isempty){
						newarr = snapshot2.val();
					}
					
					var req = {
						requester: songRequest.user,
						songId: songRequest.song_id,
						status: 'valid'
					}

					newarr.push(req);

					var listurl = 'songlists/' + room_requests_list;
					firebase.database().ref(listurl).child('songs').set(newarr);
					firebase.database().ref(isemptyurl).set(false);

				});
			});
		});

		firebase.database().ref('notifications/').once('value').then(function(snapshot) {
			var usernotifs = snapshot.val();

			var time = "8:15 PM"

			var notif = {
				status: 'Requested',
				song_name: songRequest.song_name,
				song_img: songRequest.song_img,
				song_artist: songRequest.song_artist,
				song_time: time
			}
			/*new Date();
			console.log(time.getHours());*/
			
			if(!usernotifs.hasOwnProperty(data.user)){
				console.log("new user!");
				var newarr = [];
				newarr.push(notif);
				firebase.database().ref('notifications/').child(data.user).set(newarr);

			} else {
				console.log("existing user");

				firebase.database().ref('notifications/' + data.user).once('value').then(function(snapshot2){
					var arr = snapshot2.val();
					arr.push(notif);
					firebase.database().ref('notifications/' + data.user).set(arr);

				});

			}

		});


   	});

   	socket.on('getNotifs', function(data, fn){
   		var userurl = 'notifications/' + data;
		firebase.database().ref(userurl).once('value').then(function(snapshot) {
			var newarr = snapshot.val();
			if(newarr != null) newarr = newarr.reverse();
			fn(newarr);

		});

   	});

	/*
	 * when a commanded is entered, execute it as a child process
	 * analyze whether it gave an error or not and send back the output
	 *
	socket.on('comEnt', function(data, fn){
		
		exec(data, (error, stdout, stderr) => {
			if (error) {
			 	var err = (`${error}`).split('\n')[1].replace("/bin/sh", "-bash");
		    	fn(err);
		    	return;
		    } else {
		    	fn(stdout);
		    }
		    
		});
	}) */

});


server.listen(process.env.PORT || 3000);

module.exports = app;
