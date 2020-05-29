//imports 
import React, {Component} from 'react';
import UserStats from './user-stats';
import FeedMain from './feed-main';
import Leaderboard from './leaderboard';
import { connect } from 'react-redux';

//creating the master component
class Feed extends Component {

  render() {


      return (
            <main>
              <UserStats />
              <FeedMain />
              <Leaderboard />
            </main>

      )
  }

}

const mapStateToProps = state => ({
  isLoading: state.isLoading,
  user: state.user,
  workouts: state.workouts,
  comments: state.comments,
  fistBumps: state.fistBumps,

});

export default connect(mapStateToProps)(Feed);
