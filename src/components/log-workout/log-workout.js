//imports 
import React, {Component} from 'react';
import { connect } from 'react-redux';
import Logger from './logger';


//creating the master component
class LogWorkout extends Component {
  
  state = {
    loggerVisible: true,
  }




  render() {

    if (!this.props.isLoading){
      return (
        <main id="training-main">
          <div className="w3-bar w3-black" id="tabs-container">
            <button className="w3-bar-item tab-button" onClick={this.toggleTabs}>Log</button>
            <button className="w3-bar-item tab-button" onClick={this.toggleTabs}>History</button>
          </div>
          <Logger />  
        </main>

      )
    } else {
      return (
        <div className="flex-container">
          <h5>Loading..</h5>
        </div>
      )

    }


  }

}



const mapStateToProps = state => ({
  isLoading: state.isLoading
});

export default connect(mapStateToProps)(LogWorkout);
