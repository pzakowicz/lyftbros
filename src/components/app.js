//imports 
import React, {Component} from 'react';
import Login from './login/login';
import Feed from './feed/feed';
import Header from './header/header';
import DetailedWorkout from './workout-details/detailed-workout';
import UserDetails from './user-details/user-details';
import {BrowserRouter, Route} from 'react-router-dom';
import { connect } from 'react-redux';
import { loadWorkouts, loadUser, loadFistBumps, loadSets } from '../redux/thunks';



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
    this.props.startLoadingSets();
  }


  render() {

    return (

        <BrowserRouter>
              <Route exact path="/" component={Login} />
              <Route path="/feed">
                  <Header />
                  <Feed />
              </Route>
              <Route path="/workouts/:workout_id">
                <Header/>
                <DetailedWorkout/>
              </Route>
              <Route path="/users/:user_id">
                <Header/>
                <UserDetails/>
              </Route>

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
  startLoadingSets: () => dispatch(loadSets()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);