import React, {Component} from 'react';

export class SampleTrack extends Component {
/*
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

		  		<div className="tracks">

				  <div className="track">

				    <div className="track__art">

				      <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/7022/whenDarkOut.jpg" alt="When It's Dark Out" />

				    </div>

				    <div className="track__number">1</div>

				    <div className="track__added">

				      <i className="ion-checkmark-round added"></i>

				    </div>

				    <div className="track__title">Me, Myself & I</div>

				    <div className="track__explicit">

				      <span className="label">Explicit</span>

				    </div>

				    <div className="track__plays">147,544,165</div>

				  </div>

				</div>
		  	</li>
		);
	}
}
