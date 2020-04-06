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
const saveWorkoutButton = document.getElementById("save-workout-button");
const userId = document.getElementById("user-id");
const lyftId = document.getElementById("lyft-id");
const workoutId = document.getElementById("workout-id");

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
      newExercise.innerHTML = `${element.name}`; 
      exerciseDropdown.appendChild(newExercise);
    });
    lyftId.innerHTML = exerciseArray[0].id;
  });
};

//change exerciseId on dropdown change
exerciseDropdown.addEventListener("change", () => {
  let name = exerciseDropdown.value;
  fetch(`/api/exercises/${name}`)
  .then(response => {
    return response.json();
  })
  .then(data => {
    console.log("User id is: " + data.exercise.id);
    lyftId.innerHTML = data.exercise.id;
  });
})




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
      newUser.innerHTML = `${element.email}`; 
      workoutOwnerDropdown.appendChild(newUser);
    });
    userId.innerHTML = userArray[0].id;
  });
};


//change userId in box on change
workoutOwnerDropdown.addEventListener("change", () => {
  let email = workoutOwnerDropdown.value;
  fetch(`/api/users/${email}`)
  .then(response => {
    return response.json();
  })
  .then(data => {
    console.log("User id is: " + data.user.id);
    userId.innerHTML = data.user.id;
  });
})


// add set to workout
addSetButton.addEventListener("click", () => {
  let lyft = document.getElementById("lyft").value;
  let id = document.getElementById("lyft-id").textContent;
  let weight = document.getElementById("weight").value;
  let reps = document.getElementById("reps").value;
  if (lyft && id && weight && reps) {
    let newSet = document.createElement("tr");
    newSet.innerHTML = `
    <td width="40%">${lyft}</td>
    <td width="10%">${id}</td>
    <td width="20%" contenteditable='true'>${weight}</td>
    <td width="20%" contenteditable='true'>${reps}</td>
    <td width="10%"></i><i class="fas fa-trash" onclick="deleteRow(this)"></i></td>
    `;
    workoutTable.appendChild(newSet);
  }
});

//change workout name
changeWorkoutNameButton.addEventListener("click", () => {
  changeWorkoutNameInput.style.display = "inline";
  changeWorkoutNameInput.value = workoutName.innerHTML;
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

//delete set
function deleteRow(r) {
  var i = r.parentNode.parentNode.rowIndex;
  document.getElementById("workout-table").deleteRow(i);
};


//save workout helper function
async function saveWorkout() {
  const name = workoutName.textContent;
  const id = userId.textContent;
  const data = {
    name: name,
    userId: id
  };
  console.log(data);
  let response = await fetch(`/api/workouts/`,
   {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  let json = await response.json();
  console.log("Created workout: ", json);
  workoutId.innerHTML = json.workout.id;
};

//save sets helper function
function saveSets() {
  const data = {};
  data.workoutId = workoutId.textContent;
  /*for (let i = 0, row; row = workoutTable.rows[i]; i++) {
   //iterate through rows, rows would be accessed using the "row" variable assigned in the for loop
   data.set = {
     exerciseId: row[1],
     weight: row[2],
     reps: row[3]
   };
   //for (let j = 0, col; col = row.cells[j]; j++) {
     //iterate through columns, columns would be accessed using the "col" variable assigned in the for loop
   //}  
  }
  let exerciseId;
  let weight;
  let reps; 
*/
  console.log("Workoutid to save in Sets table: ", data);
}


//POST save workout
saveWorkoutButton.addEventListener("click", async () => {
  await saveWorkout();
  saveSets();
});


//main function
function main() {
  getAllExercises();
  getAllUsers();
};

main();
