import React, {Component} from 'react';

export class Notification extends Component {

	constructor(props) {
	    super(props);
  	}
/*
	clicked (){
		var info = this.props.info;
		this.props.cb(info);
		alert (info.song + " added");
		this.setState({show: false});
	}
*/
	render () {
		//if(!this.state.show) return(<li></li>);

		/*
		<img src={this.props.info.art}/>
		  		<h1>{this.props.info.song}</h1>
		  		<p>{this.props.info.artist} - {this.props.info.album}</p>

		  		<button onClick={this.clicked.bind(this)}>Add</button>
		*/

		return (
			<li>

				<div className="track">

					<div className="track__art">

						<img src={this.props.info.song_img} />

					</div>

					<div className="track__songinfo">
						
						<div className="track__songinfo__title">{this.props.info.song_name}</div>

						<div className="track__songinfo__artist">{this.props.info.song_artist}</div>
					</div>

					<div className="track__songtime">{this.props.info.song_time}</div>


						<div className="track__status">

						<span className="label">{this.props.info.status}</span>

					</div>

				</div>

			</li>
		);
	}
}
