//imports 
import React, {Component} from 'react';
import Login from './login/login';
import Feed from './feed/feed';
import DetailedWorkout from './workout-details/detailed-workout';
import {BrowserRouter, Route, Switch, Link} from 'react-router-dom';
import { connect } from 'react-redux';
import { loadWorkouts, loadUser, loadFistBumps } from '../thunks';


//creating the master component
class App extends Component {
  
  //setting state object for the master component
  state = { 
    loginFormVisible: true,
    showCreateAccountVisible: true,
    registerFormVisible: false
   }

  toggleForms = () => {
    this.setState(prevState => ({
      loginFormVisible: !prevState.loginFormVisible, 
      showCreateAccountVisible: !prevState.showCreateAccountVisible, 
      registerFormVisible: !prevState.registerFormVisible, 
    }))
  }

  componentDidMount() {
    this.props.startLoadingWorkouts();
    this.props.startLoadingUser();
    this.props.startLoadingFistBumps();
  }


  render() {

    return (

        <BrowserRouter>

              <Route exact path="/" component={Login} />
              <Route path="/feed" component={Feed} />
              <Route path="/workouts/:id" component={DetailedWorkout} />

        </BrowserRouter>


    )
  }

}



const mapStateToProps = state => ({
  
  isLoading: state.isLoading,
  workouts: state.workouts,
});

const mapDispatchToProps = dispatch => ({
  startLoadingWorkouts: () => dispatch(loadWorkouts()),
  startLoadingUser: () => dispatch(loadUser()),
  startLoadingFistBumps: () => dispatch(loadFistBumps()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);