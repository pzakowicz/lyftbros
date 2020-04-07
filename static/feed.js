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
        let content = "";
        content += element.first_name;
        content += " ";
        content += element.surname;
        newUser.innerHTML = content;
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
      <table class= "sets-table" id="sets-table-1">
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
    /*
    for (let i = 1; i < workoutArray.lenght; i++) {
      if (existingWorkoutsArray.includes(workoutArray[i].id)) {
        console.log("add to existing workout");
        let newSet = document.createElement("tr");
        newSet.innerHTML = `
        <td width="60%">${workoutArray[i].lift_name}</td>
        <td width="20%">${workoutArray[i].weight}</td>
        <td width="20%">${workoutArray[i].reps}</td>
        `;
        document.getElementById("sets-table-0").appendChild(newSet);
      } else {
        console.log("create new workout");
      }
    };
    */
    /*
    let workoutArray = data[0];
    feedContainer.innerHTML = "";
    const newWorkout = document.createElement("div");
    newWorkout.innerHTML = `
    <div class="container-box tile">
      <h4 class="user-name">${workoutArray[0].first_name} ${workoutArray[0].surname}</h4>
      <p class="workout-date">${workoutArray[0].date_time}</p>
      <h3 class="workout-name">${workoutArray[0].workout_name}</h3>
      <table class="sets-table">
        <tr>
          <th>Lyft</th>
          <th>Weight</th>
          <th>Reps</th>
        </tr>
        <tr>
          <td width="60%">${workoutArray[0].lift_name}</td>
          <td width="20%">${workoutArray[0].weight}</td>
          <td width="20%">${workoutArray[0].reps}</td>
        </tr>
        <tr>
          <td>${workoutArray[1].lift_name}</td>
          <td>${workoutArray[1].weight}</td>
          <td>${workoutArray[1].reps}</td>
        </tr>
        <tr>
          <td>${workoutArray[2].lift_name}</td>
          <td>${workoutArray[2].weight}</td>
          <td>${workoutArray[2].reps}</td>
        </tr>
      </table>
    </div>
    `;
    feedContainer.appendChild(newWorkout);
    */
  });
}



//Menu button event lsiteners
exercisesButton.addEventListener('click', () => {
  window.location.href = "/exercises";
})

logTrainingButton.addEventListener('click', () => {
  window.location.href = "/log-training";
})

//main function
function main() {
  getAllUsers();
  getFeedData();
}

//execute funcions
main();
