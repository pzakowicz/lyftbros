//imports 
import React from 'react';

//creating the master component
function Prs({thisUser, workouts}) {
  
  return (

    <div>
    <h4>Bro's PRs</h4>
    <table>
      <thead>
      <tr>
        <th>Lyft</th>
        <th>10 reps</th>
        <th>5 reps</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        {/* <%for (let i = 0; i < prs.length; i++) { %>
        </tr>
          <td width="50%"><%= prs[i].name %></td>
          <td width="25%"><%= prs[i].ten_reps %> <span className="unit">kg</span></td>
          <td width="25%"><%= prs[i].five_reps %> <span className="unit">kg</span></td>
        <tr>
        <% } %> */}
        
      </tr>
      </tbody>
    </table>
  </div>

  )
}

export default Prs;