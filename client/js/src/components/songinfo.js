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

		/*
		<img src={this.props.info.art}/>
		  		<h1>{this.props.info.song}</h1>
		  		<p>{this.props.info.artist} - {this.props.info.album}</p>

		  		<button onClick={this.clicked.bind(this)}>Add</button>
		*/

		return (
			<li>

				<div className="tracks">

					<div className="track">

						<div className="track__art">

							<img src={this.props.info.art}/>

						</div>

					<div className="track__title">{this.props.info.song}</div>

					<div className="track__length">{this.props.info.artist}</div>

					<div className="track__divider">|</div>

						<div className="track__status">

							<span className="label"><button onClick={this.clicked.bind(this)}>Add</button></span>

						</div>

					</div>

				</div>

			</li>
		);
	}
}
