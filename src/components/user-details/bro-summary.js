//imports 
import React from 'react';

//creating the master component
function BroSummary({thisUser}) {
  
  return (

    <div>
      <h4>Bro's summary</h4>
      <div className="flex-container list-item">
          <span>Name: </span><span className="value">{thisUser.first_name + ' ' + thisUser.surname}</span>
      </div>
      <div className="flex-container list-item">
        <span>Gender: </span><span className="value">{thisUser.gender}</span>
      </div>
    </div>

  )
}

export default BroSummary;
