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

var server = http.createServer(app);
var io = require('socket.io').listen(server);

//sockets listening
io.sockets.on('connection', function(socket){
	console.log('user connected');

	socket.on('searchChanged', function(data, fn){
		
		var retTracks = [];

        spotifyApi.searchTracks("album:" + data, { 'limit': 5 })
            .then(function(res) {                  
                
				for (var i = 0; i < 5; i++) {
					//if(res==undefined) continue;
					//if(res.body.tracks.item[i] == undefined) continue;
					var songInfo = {
						album: res.body.tracks.items[i].album.name,
						song: res.body.tracks.items[i].name,
						artist: res.body.tracks.items[i].artists[0].name,
						id: res.body.tracks.items[i].id,
						art: res.body.tracks.items[i].album.images[2].url

					};

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
    	if(data == 1234){
    		fn(true);
    	}
  		else {
  			fn(false);
  		}
    });


   	socket.on('addSong', function(data){
   		console.log("adding song: %s", data.name);
   		console.log("with the id: %s", data.id);
   		console.log("from the room: %s", data.room);
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
