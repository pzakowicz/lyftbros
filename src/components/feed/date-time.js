//imports 
import React from 'react';

//creating the master component
function DateTime({dateTime, className}) {

  const getDateTime = (dateTimeObject) => {

    let today = new Date();
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let offset = today.getTimezoneOffset();
    let todayDate = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
    let yesterdayDate = today.getDate()-1+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
    let workoutDateObject = new Date(Date.parse(dateTimeObject));
    let workoutDate = workoutDateObject.getDate()+'-'+(workoutDateObject.getMonth()+1)+'-'+workoutDateObject.getFullYear();
    let formattedDate = (months[workoutDateObject.getMonth()]) + ' ' + workoutDateObject.getDate()+', '+workoutDateObject.getFullYear()+' ';
    let workoutTime = (workoutDateObject.getHours()-(offset/60))+ ':' + (('0' + (workoutDateObject.getMinutes())).slice(-2));

    return (
          <span className={className}>
              {(workoutDate === todayDate) && 'Today '}
              {(workoutDate === yesterdayDate) && 'Yesterday ' }
              {(workoutDate !== todayDate && workoutDate !== yesterdayDate) && formattedDate + ''}
            @ {workoutTime}
          </span>
    )
  }

  return (
    getDateTime(dateTime)
  )

}

export default DateTime;