'use strict';
import React from 'react';
import ReactDOM from 'react';
import {SearchBar} from './components/searchbar.js';
import {TestComp} from './components/testcomponent.js';
import {SongInfo} from './components/songinfo.js';

var socket = io.connect('http://localhost:3000');

var curString = "";
$(document).ready(function() {

	$('#queue').hide();
	$('#searchscreen').hide();
	$('#tabs').hide();

	$('#enter').click(function(event){
		$('#passcode').hide();
		$('#tabs').show();
		$('#searchscreen').show();
	});

	$('#searchTab').click(function(){
		$('#searchscreen').show();
		$('#queue').hide();
	});

	$('#queueTab').click(function(){
		$('#queue').show();
		$('#searchscreen').hide();
	});

	$('#clearbutton').click(function(event){
		event.preventDefault();
		var input = document.getElementById('search');
		input.value = '';
	})

	$('form').keydown(function(event){
		var input = document.getElementById('search');
		var search = input.value;
		var newStr = false;

		if(event.keyCode >= 48 && event.keyCode <= 90){
			search += String.fromCharCode(event.keyCode).toLowerCase();
			newStr = true;
		} else if(event.keyCode==8){
			search = search.substring(0, search.length-1);
			newStr = true;
		} else {
			event.preventDefault();
		}
		
		if(newStr) {


			socket.emit('searchChanged', search,
				function(tracks){
					var addTrack = function(){

					}
					var trackElems = tracks.map(function(song, i){
						return <SongInfo key={i} info={song}/>;

						/*(
							<li className="song">
								<h1>{song.song} </h1>
								<p> {song.artist + " : " + song.album}</p>
							</li>
						);*/
					});

					ReactDOM.render(<ul>{trackElems}</ul>, document.getElementById('searchRes'));
				});

		}

			

		//}
		
	});
});

var doSearch = function(search){
			socket.emit('searchChanged', search,
				function(tracks){
					var addTrack = function(){

					}
					var trackElems = tracks.map(function(song, i){
						return <SongInfo key={i} info={song}/>;

						/*(
							<li className="song">
								<h1>{song.song} </h1>
								<p> {song.artist + " : " + song.album}</p>
							</li>
						);*/
					});

					ReactDOM.render(<ul>{trackElems}</ul>, document.getElementById('searchRes'));
				});
}
/*
var toTest = (

	<div>
		<SearchBar/>
		<TestComp/>
	</div>
	
	);

React.render(
    toTest,
    document.getElementById('content')
);
*/
