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
    let workoutArray = data.workout;
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
