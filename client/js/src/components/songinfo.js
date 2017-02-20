import React, {Component} from 'react';

export class SongInfo extends Component {

	constructor(props) {
	    super(props);
	    this.state = {
	      show: true
    	};
  	}

	clicked (){
		var info = this.props.info;
		this.props.cb(info);
		alert (info.song + " added");
		this.setState({show: false});
	}

	render () {
		if(!this.state.show) return(<li></li>);

		return (
			<li className="song">
				<img src={this.props.info.art}/>
		  		<h1>{this.props.info.song}</h1>
		  		<p>{this.props.info.artist} - {this.props.info.album}</p>

		  		<button onClick={this.clicked.bind(this)}>Add</button>
		  	</li>
		);
	}
}
