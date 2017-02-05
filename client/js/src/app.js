'use strict';
import React from 'react';
import {SearchBar} from './components/searchbar.js';
import {TestComp} from './components/testcomponent.js';

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
