// get elements
const usersContainer = document.getElementById("users-container");
const exercisesButton = document.getElementById("exercises-button");
const logTrainingButton = document.getElementById("log-training-button");
const feedContainer = document.getElementById("feed-container");

//GET all users
function getAllUsers() {
  fetch("/api/users")
    .then(response => {
      return response.json();
    })
    .then(data => {
      let userArray = data.user;
      usersContainer.innerHTML = "";
      userArray.forEach(element => {
        const newUser = document.createElement("div");
        newUser.innerHTML = `<a href="/users/${element.email}"><p class="user-list-item">${element.first_name} ${element.surname}</p></a>`;
        usersContainer.appendChild(newUser);
      });
    });
}


//GET JOINED TABLES for the feed
function getFeedData() {
  fetch("/api/feed")
  .then(response => {
    return response.json();
  })
  .then(data => {
    console.log(data);
    feedContainer.innerHTML = "";
    let workoutArray = data.workout;
    let existingWorkoutsArray = [];
    existingWorkoutsArray.push(workoutArray[0].id);
    console.log(existingWorkoutsArray);
    let newWorkout = document.createElement("div");
    newWorkout.innerHTML = `
    <div class="container-box tile">
      <h4 class="user-name">${workoutArray[0].first_name} ${workoutArray[0].surname}</h4>
      <p class="workout-date">${workoutArray[0].date_time}</p>
      <h3 class="workout-name">${workoutArray[0].workout_name}</h3>
      <table class= "sets-table" id="sets-table-${workoutArray[0].id}">
        <tr>
          <th>Lyft</th>
          <th>Weight</th>
          <th>Reps</th>
        </tr>
      </table>
    </div>
    `;
    feedContainer.appendChild(newWorkout);
    console.log("Added headings and first row");
    workoutArray.forEach(row => {
      if(existingWorkoutsArray.includes(row.id)) {
        console.log("add to existing workout");
        let newSet = document.createElement("tr");
        newSet.innerHTML = `
        <td width="60%">${row.lift_name}</td>
        <td width="20%">${row.weight}</td>
        <td width="20%">${row.reps}</td>
        `;
        document.getElementById(`sets-table-${row.id}`).appendChild(newSet);
      } else {
        console.log("create new workout");
        existingWorkoutsArray.push(row.id);
        let newWorkout = document.createElement("div");
        newWorkout.innerHTML = `
        <div class="container-box tile">
          <h4 class="user-name">${row.first_name} ${row.surname}</h4>
          <p class="workout-date">${row.date_time}</p>
          <h3 class="workout-name">${row.workout_name}</h3>
          <table class= "sets-table" id="sets-table-${row.id}">
            <tr>
              <th>Lyft</th>
              <th>Weight</th>
              <th>Reps</th>
            </tr>
          </table>
        </div>
        `;
        feedContainer.appendChild(newWorkout);
      }
    });
  });
};

//main function
function main() {
  getAllUsers();
  getFeedData();
}

//execute funcions
main();
