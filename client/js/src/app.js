'use strict';
import React from 'react';
import ReactDOM from 'react';
import {SearchResult} from './components/searchresult.js';
import {Notification} from './components/notification.js';

//var socket = io.connect('http://localhost:3000');
var socket = io.connect('http://abgripple.herokuapp.com');

var roomId = 0;

var screen = "search";

var genCookie = function() {
	var cookieID = "";
	for (var i = 0; i < 10; i++) {
		var num = Math.floor ((Math.random()*10));
		cookieID += num.toString();
	}
	if (document.cookie.length == 0) {
		document.cookie = cookieID;
	}
}

var getCookie = function() {
	return document.cookie;
}

var delete_cookie = function(name) {
	document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

var addRoomToCookie = function(room){
	var now = new Date();
	now.setTime(now.getTime() + 1 * 3600 * 1000);
	document.cookie = "room=" + room + "; expires=" + now.toUTCString() + ";";
}

genCookie();
var cook = getCookie().substring(0,10);

//0162668620=; 0264571937=; 0296221873=; 3017802789=; 321094274610=; 6685739677=; 7983560417=
//delete_cookie("321094274610");
console.log("usercookie:%s", getCookie());



$(document).ready(function() {

	/*initial screen hiding*/
	$('#queue').hide();
	$('#searchscreen').hide();
	$('#tabs').hide();
	$('#circlebutton').hide();

	if(getCookie().indexOf("room") != -1){
		var index = getCookie().indexOf("room");
		var room = getCookie().substring(index+5, index+9);
		console.log("room:%s", room);
		roomId = room;
		enterRoom();
	}

	$('#box1').focus();

	$('.box').keydown(function(event){
		console.log(event.keyCode);
		if(event.keyCode != 8 && (event.keyCode < 48 || event.keyCode > 57)){
			event.preventDefault();
			return;
		}
	});

	$('.box').keyup(function(event){
		if (event.keyCode == 8) {
			return;
		}
		if (event.keyCode < 48 || event.keyCode > 57){
			event.preventDefault();
			return;
		}
		else {
			console.log(this.id);
			var int = parseInt(this.id.charAt(3));
			int++;
			if(int == 5){
				document.getElementById("joinButton").focus();
			} else {
				var newBox = "box" + int;
				document.getElementById(newBox).focus();
			}
			
		}
	});


	$('#circlebutton').click(function(){
		switchScreen();
	});

	//to be replace with passcode features
	$('#joinButton').click(function(event){

		var passcode = $("#box1").val() + $("#box2").val() + 
						$("#box3").val() + $("#box4").val();

		verifyPasscode(passcode);
		console.log("verifying: %s", passcode);

	});

	$('#clear').click(function(event){
		clearBoxes();
	});

	/*search functionality*/
	$('#search').on('keyup', function(){
		doSearch(this.value);
	});

	$('form').keydown(function(event){
		/*shud i disable other keys like tab?*/
		if(event.keyCode == 13){
			event.preventDefault();
		}
		
	});
});

/*does a search and displays the result in searchRes*/
var doSearch = function(search){
	var trackElems = [];
	if(search.length == 0){
		console.log("no entry");
		ReactDOM.render(<ul>{trackElems}</ul>, document.getElementById('searchRes'));
		return;
	}
	socket.emit('searchChanged', search,
		function(tracks){

			trackElems = tracks.map(function(song, i){
				return <SearchResult key={i} info={song} cb={addSong}/>;
			});

			ReactDOM.render(<ul>{trackElems}</ul>, document.getElementById('searchRes'));
		}
	);
}

var updateNotifs = function(cookie){
	var notifs = [];
	socket.emit('getNotifs', cookie,
		function(notifsres){
			notifs = notifsres.map(function(notif,i){
				return <Notification key={i} info={notif}/>;
			});

			ReactDOM.render(<ul>{notifs}</ul>, document.getElementById('queueRes'));
		}
	);
}


var addSong = function(song){
	var d = new Date();
    var hours = d.getHours();
    var mins = d.getMinutes();
    var timeOfDay = hours < 12 ? "AM" : "PM";
    if (hours == 0) {
        hours = 12;
    }
    else if (hours > 12) {
        hours = hours - 12;
    }

    var time = hours + ":" + mins + " " + timeOfDay;

	var addObject = {
		song_name: song.song_name,
		song_id: song.song_id,
		song_img: song.song_img,
		song_album: song.song_album,
		song_artist: song.song_artist,
		room: roomId,
		user: cook,
		time: time
	}

	socket.emit('addSong', addObject);
}

/*sends passcode to backend where it is verified*/
var verifyPasscode = function(passcode){
	socket.emit('verifyPass', passcode,
		function(result){
			if(result){
				roomId = passcode;
				enterRoom();
				addRoomToCookie(passcode);
			}
			else {
				alert("Invalid Passcode");
				clearBoxes();
			}

		}
	);
}

var clearBoxes = function() {
	for (var i = 1; i <= 4; i++) {
		var box = "box" + i;
		document.getElementById(box).value = "";				
	}
	document.getElementById("box1").focus();
}
/*enters room, need to add room saving functionality*/
var enterRoom = function(){
	$('#passcode').hide();
	$('#tabs').show();
	$('#searchscreen').show();
	$('#circlebutton').show();
}

var switchScreen = function(){
	if(screen == "search"){
		screen = "feed";
		$('#searchscreen').hide();
        $('#queue').show();
        $('#buttonval').html('S');
        updateNotifs(cook);
	} else {
		screen = "search";
		$('#searchscreen').show();
        $('#queue').hide();
        $('#buttonval').html('F');

	}
}









