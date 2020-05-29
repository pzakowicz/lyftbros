//imports 
import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';

//creating the master component
function Prs({thisUser, sets}) {

  const [loading, setLoading] = useState(true);
  const [prs, setPrs] = useState();

  const findPrs = () => {

    let addedLifts = [];
    let tempResult = {};
    for (let i = 0; i < sets.length; i++) {
      if (sets[i].user_id === thisUser.id && !addedLifts.includes(sets[i].lift_name))  {
          addedLifts.push(sets[i].lift_name);
          let maxFive = 0;
          let maxTen = 0;
          for (let j = 0; j < sets.length; j++) {
            if (sets[j].user_id === thisUser.id && sets[j].lift_name === sets[i].lift_name && sets[j].reps >= 5 && sets[j].weight > maxFive) {
                maxFive = sets[j].weight;
            }
            if (sets[j].user_id === thisUser.id && sets[j].lift_name === sets[i].lift_name && sets[j].reps >= 10 && sets[j].weight > maxTen) {
              maxTen = sets[j].weight;
            }
          }
          tempResult[sets[i].lift_name] = {
            lift_name: sets[i].lift_name,
            five_reps: maxFive,
            ten_reps: maxTen

          }
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