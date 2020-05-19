//imports 
import React, {Component} from 'react';
import { connect } from 'react-redux';
import Logger from './logger';
import History from './history';


//creating the master component
class LogWorkout extends Component {
  
  state = {
    loggerVisible: true,
  }

  toggleTabs = () => {
    this.setState(prevState => ({
      loggerVisible: !prevState.loggerVisible, 
    }))
  }


  render() {

    if (!this.props.isLoading){
      return (
        

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
