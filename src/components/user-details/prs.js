//imports 
import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';

//creating the master component
function Prs({thisUser, workouts, sets}) {

  const [loading, setLoading] = useState(true);
  const [prs, setPrs] = useState();

  const findPrs = () => {

    let tempResult = {}
    for(let { user_id, lift_name, weight, reps } of sets)
      if (user_id === thisUser.id) {
        tempResult[lift_name] = { 
            lift_name: lift_name, 
            five_reps: (tempResult[lift_name] &&  5 < reps < 10 ) ? Math.max(weight) : 0,
            ten_reps: (tempResult[lift_name] && reps >= 10) ? Math.max(weight) : 0
        }      
      }

    let result = Object.values(tempResult)
    result.sort((a,b) => (a.lift_name > b.lift_name) ? 1 : ((b.lift_name > a.lift_name) ? -1 : 0));
    setPrs(result);

  }

  useEffect(() => {
    findPrs();
    setLoading(false);
  },[])
  
  if (!loading && prs.length > 0) {
    return (
      <div>
      <h4>Bro's PRs</h4>
      <table>
        <thead>
        <tr>
          <th>Lyft</th>
          <th>5 reps</th>
          <th>10 reps</th>
        </tr>
        </thead>
        <tbody>

        {(!loading && prs.length > 0) && prs.map((pr, i) => {
          return (
            <tr key={i}>
              <td width="50%">{pr.lift_name}</td>
              <td width="25%">{pr.five_reps}<span className="unit"> kg</span></td>
              <td width="25%">{pr.ten_reps}<span className="unit"> kg</span></td>
            </tr> 

          )

        })}

            



          

        </tbody>
      </table>
    </div>

    )
  } else {
    return (
      <div>Loading...</div>
    )
  }
}

const mapStateToProps = state => ({
  sets: state.sets


});

export default connect(mapStateToProps)(Prs);