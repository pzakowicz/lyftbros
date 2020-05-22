//imports 
import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';
import { loadFistBumps } from '../../redux/thunks';
import { Link } from 'react-router-dom';
import CommentForm from './comment-form';

//creating the master component
function FistBumpSection({fistBumps, user, workout_id, startLoadingFistBumps, comments}) {

  const [fistBumpsCount, setFistBumpsCount] = useState(0);
  const [userHasBumped, setUserHasBumped] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [commentVisible, setCommentVisible] = useState(false);

  const toggleComment = () => {
    setCommentVisible(prevState => !prevState)
  }


  const toggleModal = () => {
    setModalVisible(prevState => !prevState)
  }

  const countFistBumps = () => {
    for (let i = 0; i < fistBumps.length; i++) {
      if (fistBumps[i].workout_id === Number(workout_id)) {
        setFistBumpsCount(fistBumps[i].count);
        break
      }
    }
  }

  const countComments = () => {
    let count = 0
    for (let i = 0; i < comments.length; i++) {
      if (comments[i].workout_id === Number(workout_id)) {
        count ++
      }
    }
    setCommentCount(count);
  }

  const hasUserBumped = () => {
    for (let i = 0; i < fistBumps.length; i++) {
      if (fistBumps[i].workout_id === workout_id && fistBumps[i].user_id === user.id) {
        setUserHasBumped(true);
      }
    }
  }

  async function addFistBump(e) {
    const data = {
      workoutId: workout_id
    };
    let response = await fetch(`/api/fist-bumps/add/`,
    {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    console.log("requested to add fist bump:", data);
    // check if fist bump has been added
    if (response.status === 201) {
      console.log("Fist bump added");
      startLoadingFistBumps();
      setFistBumpsCount(fistBumpsCount + 1);
      setUserHasBumped(true);


    }
  };
 

  useEffect(() => {
    countFistBumps();
    countComments();
    hasUserBumped();

  }, []);

  return (
    <div>

      <div className="flex-container comment-section">
        <span>
          { fistBumpsCount === 0 && <span>Be the first one to bump your bro</span>}
          { fistBumpsCount === 1 && <span className="link" onClick={toggleModal}>{fistBumpsCount} fist bump</span>}
          { fistBumpsCount > 1 && <span className="link" onClick={toggleModal}>{fistBumpsCount} fist bumps</span> }        
          { commentCount === 1 && <span><span>  |  </span><span className="link" onClick={toggleComment}>{commentCount} comment</span></span>}
          { commentCount > 1 && <span><span>  |  </span><span className="link" onClick={toggleComment}>{commentCount} comments</span></span>}
        </span>
        <div id="button-container">
          <button type="button" className="comment-button"  onClick={addFistBump}>
            { userHasBumped ? <i className="fas fa-hand-rock"></i> 
              : <i className="far fa-hand-rock"></i> }
          </button>
          <button type="button" className="comment-button" id="comment" onClick={toggleComment}><i className="far fa-comment"></i></button>
        </div>
      </div>  
      {commentVisible && <CommentForm workout_id={workout_id} comments={comments} />} 

      { modalVisible ? 
        <div id="commentModal" className="modal">
          <div className="modal-content">
            <span className="close" onClick={toggleModal}>&times;</span>
            <table id="fist-bumps-table">
              <thead>
                <tr>
                  <th>Fist bumps</th>
                </tr>
              </thead>
              <tbody>
              {fistBumps.map((fistBump, i) => {
                return fistBump.workout_id === workout_id ? 
                <tr key={i}>
                  <td><Link to={"/users/"+ fistBump.user_id}>{fistBump.first_name} {fistBump.surname}</Link></td>
                </tr> 
                : null
              })}
              </tbody>
            </table>
          </div>
        </div> 
      : null}

    </div>
  )

}

const mapDispatchToProps = dispatch => ({
  startLoadingFistBumps: () => dispatch(loadFistBumps()),

});

const mapStateToProps = state => ({
  comments: state.comments,
});


export default connect(mapStateToProps, mapDispatchToProps)(FistBumpSection);