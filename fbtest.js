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

var SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId : '7bccf322d5644ad4905b43e7d0f61f7f',
  clientSecret : 'f29e679682c04d6b84f3e4aae6f5adae',
  redirectUri : 'http://www.example.com/callback'
});


// spotifyApi.getArtistAlbums("0VFXJrXtfuX2iqlnXpl4zD")
//   .then(function(data) {
//     console.log('Artist albums', data.body);
//   }, function(err) {
//     console.error(err);
//   });

/*
functions web:
-verifypasscode
-addsong to request list


functions android:
-make new room
*/

function verifyPasscode(passcode){
	firebase.database().ref('/parties').once('value').then(function(snapshot) {
		var passcodes = snapshot.val();
		
		if(passcodes.hasOwnProperty(passcode)){
	  		console.log("%s is a valid passcode", passcode);

		} else {
	  		console.log("%s is not a valid passcode", passcode);

		}

	});

}

/*
verifyPasscode(1234);
verifyPasscode(2345);
verifyPasscode(5555);
verifyPasscode(5566);
*/

/*
 * input, song request object:
 *	room: ex. 1234
 *	song: 
 *	user requesting:
 *
 *	control flow:
 *	1. find requests list unique key by looking up room
 *	2. go to songlists/room_request_id/songs
 *	3. load that array
 *	4. push to end of array
 *	5. update at that array position
 *
 */
function addSong(songRequest){
	var room_requests_list;
	var roomurl = 'parties/' + songRequest.room;
	firebase.database().ref(roomurl).once('value').then(function(snapshot) {
		room_requests_list = snapshot.val().request_list_id;
		console.log(room_requests_list);

		var songlisturl = 'songlists/' + room_requests_list + '/songs/';
		console.log(songlisturl);
		firebase.database().ref(songlisturl).once('value').then(function(snapshot2) {
			console.log(snapshot2.val());
			var newarr = snapshot2.val();
			var req = {
				requester: songRequest.user,
				songId: songRequest.song,
				status: 'valid'
			}

			newarr.push(req);

			firebase.database().ref(songlisturl).set(newarr);

		});

	});

}

var songreq = {
	room: 1234,
	song: "0VFXJrXtfuX2iqlnXpl4zD",
	user: "1m1pedm32p"
}

//addSong(songreq);



function addNotif(user, notif){
	var userurl = 'notifications/' + user;
	firebase.database().ref(userurl).once('value').then(function(snapshot) {
		//var newarr = [];
		var newarr = snapshot.val();
		newarr.push(notif);

		firebase.database().ref(userurl).set(newarr);
	});
}

var notif = {
	status: 'Accepted',
	song_name: "Break Yo Chest",
	song_img: "https://i.scdn.co/image/a78a681a35c1bbf6a3c45703ce73e6d3d415af9e",
	song_artist: "Star Cast",
	song_time: "8:15 PM"
}
//addNotif("1234567890", notif);

function newUserNotif(user, notif){
	var newarr = [];
	newarr.push(notif);
	firebase.database().ref('notifications/').child(user).set(newarr);

}

newUserNotif("1234567890", notif);



function writeUserData(userId, name, email, imageUrl) {
  firebase.database().ref('users/' + userId).set({
    username: name,
    email: email,
    profile_picture : imageUrl
  });
  console.log("success");
}

function makeSongs(){
	firebase.database().ref('/').set(
		{key: "value2"}

	);
}
/*
var updates = {
	1234: { key:'val'}
};

firebase.database().ref('/parties/').update(updates);*/
//writeUserData("1234", "ryan", "ryh", "wot");




