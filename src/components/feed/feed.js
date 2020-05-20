//imports 
import React, {Component} from 'react';
import UserStats from './user-stats';
import FeedMain from './feed-main';
import Leaderboard from './leaderboard';
import { connect } from 'react-redux';
import { loadWorkouts, loadUser, loadFistBumps, loadSets, loadLifts } from '../../redux/thunks';


//creating the master component
class Feed extends Component {

  componentDidMount() {
    this.props.startLoadingUser();
    this.props.startLoadingWorkouts();
    this.props.startLoadingFistBumps();
    this.props.startLoadingSets();
    this.props.startLoadingLifts();

  }

  



  render() {

    if (!this.props.isLoading){
      return (
            <main>
              <UserStats />
              <FeedMain />
              <Leaderboard />
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

const mapDispatchToProps = dispatch => ({

  startLoadingUser: () => dispatch(loadUser()),
  startLoadingWorkouts: () => dispatch(loadWorkouts()),

  startLoadingFistBumps: () => dispatch(loadFistBumps()),
  startLoadingSets: () => dispatch(loadSets()),
  startLoadingLifts: () => dispatch(loadLifts()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Feed);
