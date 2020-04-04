// get elements
const exercisesButton = document.getElementById("exercises-button");
const logTrainingButton = document.getElementById("log-training-button");
const addSetButton = document.getElementById("submit-set-button");
const workoutTableContainer = document.getElementById("workout-table-container");
const workoutTable = document.getElementById("workout-table");
const exerciseDropdown = document.getElementById("lyft");
const workoutOwnerDropdown = document.getElementById("workout-owner");
const workoutName = document.getElementById("workout-name");
const changeWorkoutNameButton = document.getElementById("change-workout-name-button");
const saveWorkoutNameButton = document.getElementById("save-workout-name-button");
const changeWorkoutNameInput = document.getElementById("workout-name-input");

// get pages
exercisesButton.addEventListener('click', () => {
  window.location.href = "/exercises";
});

logTrainingButton.addEventListener('click', () => {
  window.location.href = "/log-training";
});

//GET all exercises and add them to dropdown as options
function getAllExercises() {
  fetch("/api/exercises")
  .then(response => {
    return response.json();
  })
  .then(data => {
    let exerciseArray = data.exercise;
    exerciseDropdown.innerHTML = "";
    exerciseArray.forEach(element => {
      const newExercise = document.createElement("option");
      newExercise.innerHTML = `${element.equipment} ${element.name}`; 
      exerciseDropdown.appendChild(newExercise);
    });
  });
};

//GET all users and add them to dropdown as options
function getAllUsers() {
  fetch("/api/users")
  .then(response => {
    return response.json();
  })
  .then(data => {
    let userArray = data.user;
    workoutOwnerDropdown.innerHTML = "";
    userArray.forEach(element => {
      const newUser = document.createElement("option");
      newUser.innerHTML = `${element.first_name} ${element.surname}`; 
      workoutOwnerDropdown.appendChild(newUser);
    });
  });
};


// add set to workout
addSetButton.addEventListener("click", () => {
  let lyft = document.getElementById("lyft").value;
  let weight = document.getElementById("weight").value;
  let reps = document.getElementById("reps").value;
  let newSet = document.createElement("tr");
  newSet.innerHTML = `
    <td>${lyft}</td>
    <td>${weight}</td>
    <td>${reps}</td>
    `;
  workoutTable.appendChild(newSet);
});

//change workout name
changeWorkoutNameButton.addEventListener("click", () => {
  changeWorkoutNameInput.style.display = "inline";
  changeWorkoutNameButton.style.display = "none";
  workoutName.style.display = "none";
  saveWorkoutNameButton.style.display = "inline";
})

//save new workout name
saveWorkoutNameButton.addEventListener("click", () => {
  if (changeWorkoutNameInput.value) {
    workoutName.innerHTML = changeWorkoutNameInput.value;
    changeWorkoutNameInput.style.display = "none";
    changeWorkoutNameButton.style.display = "";
    workoutName.style.display = "";
    saveWorkoutNameButton.style.display = "none";
  }
})



//main function
function main() {
  getAllExercises();
  getAllUsers();
};

main();
