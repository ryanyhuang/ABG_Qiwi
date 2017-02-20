'use strict';
import React from 'react';
import ReactDOM from 'react';
import {SearchBar} from './components/searchbar.js';
import {TestComp} from './components/testcomponent.js';
import {SongInfo} from './components/songinfo.js';

var socket = io.connect('http://localhost:3000');

var roomId = 0000;

$(document).ready(function() {

	$('#box1').focus();

	$('.box').keydown(function(event){
		if(event.keyCode < 48 || event.keyCode > 57){
			event.preventDefault();
			return;
		}
	});

	$('.box').keyup(function(event){
		if(event.keyCode < 48 || event.keyCode > 57){
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

	/*initial screen hiding*/
	$('#queue').hide();
	$('#searchscreen').hide();
	$('#tabs').hide();

	//to be replace with passcode features
	$('#joinButton').click(function(event){

		var passcode = $("#box1").val() + $("#box2").val() + 
						$("#box3").val() + $("#box4").val();

		verifyPasscode(passcode);
		console.log("verifying: %s", passcode);

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
			var addTrack = function(){

			}
			trackElems = tracks.map(function(song, i){
				return <SongInfo key={i} info={song} cb={addSong}/>;
			});

			ReactDOM.render(<ul>{trackElems}</ul>, document.getElementById('searchRes'));
		}
	);
}

var addSong = function(song){
	console.log(song.song);
	console.log(song.id);

	socket.emit('addSong', song);
}

/*sends passcode to backend where it is verified*/
var verifyPasscode = function(passcode){
	socket.emit('verifyPass', passcode,
		function(result){
			if(result){
				roomId = passcode;
				alert("Valid passcode! entering room: " + passcode);
				enterRoom();
			}
			else {
				alert("Invalid Passcode");
				document.getElementById('box1').value = "";
				document.getElementById('box2').value = "";
				document.getElementById('box3').value = "";
				document.getElementById('box4').value = "";
				$('#box1').focus();
			}

		}
	);
}

/*enters room, need to add room saving functionality*/
var enterRoom = function(){
	$('#passcode').hide();
	$('#tabs').show();
	$('#searchscreen').show();
}


