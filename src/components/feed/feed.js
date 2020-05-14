//imports 
import React, {Component} from 'react';
import UserStats from './user-stats';
import FeedMain from './feed-main';
import Leaderboard from './leaderboard';
import { connect } from 'react-redux';


//creating the master component
class Feed extends Component {
  



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

export default connect(mapStateToProps)(Feed);
