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
		console.log(passcodes);
		if(passcodes.hasOwnProperty(passcode)){
	  		console.log("%s is a valid passcode", passcode);

		} else {
	  		console.log("%s is not a valid passcode", passcode);

		}
		/*
	  	if(passcodes.indexOf(passcode) != -1){
	  	} else {
	  	}*/
	  	// ...
	});

}

/*
verifyPasscode(1234);
verifyPasscode(1434);
verifyPasscode(1124);
*/
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

var updates = {
	1234: { key:'val'}
};

firebase.database().ref('/parties/').update(updates);
//writeUserData("1234", "ryan", "ryh", "wot");







