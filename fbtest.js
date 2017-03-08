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

addSong(songreq);

function formatRooms(){
	firebase.database().ref('rooms/').set(

		[
		{
			history: ["song1", "song2"],
			requested: ["song3", "song4"],
			passcode: 1234
		},
		{
			history: ["song1", "song3"],
			requested: ["song2", "song4"],
			passcode: 4444
		},
		{
			history: ["song3", "song4"],
			requested: ["song1", "song2"],
			passcode: 5555
		}
		]
	);
	console.log("success");
}

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




