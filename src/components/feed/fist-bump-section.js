//imports 
import React, {useState, useEffect} from 'react';
import { connect } from 'react-redux';
import { loadFistBumps } from '../../redux/thunks';
import { Link } from 'react-router-dom';

//creating the master component
function FistBumpSection({fistBumps, user, workout_id, startLoadingFistBumps}) {

  const [fistBumpsCount, setFistBumpsCount] = useState(0);
  const [userHasBumped, setUserHasBumped] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);


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
    hasUserBumped();

  }, []);

  return (
    <div>

      <div className="flex-container comment-section">
        <span onClick={toggleModal}>
          { fistBumpsCount === 0 && <span>Be the first one to bump your bro!</span>}
          { fistBumpsCount === 1 && <span>{fistBumpsCount} fist bump!</span>}
          { fistBumpsCount > 1 && <span>{fistBumpsCount} fist bumps!</span> }        
        </span>
        <div id="button-container">
          <button type="button" className="comment-button"  onClick={addFistBump}>
            { userHasBumped ? <i className="fas fa-hand-rock"></i> 
              : <i className="far fa-hand-rock"></i> }
          </button>
          <button type="button" className="comment-button" id="comment"><i className="far fa-comment"></i></button>
        </div> 
      </div>  

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

export default connect(null, mapDispatchToProps)(FistBumpSection);