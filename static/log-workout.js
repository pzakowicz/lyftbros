// get elements
const addSetButton = document.getElementById("submit-set-button");
const workoutTable = document.getElementById("workout-table");
const exerciseDropdown = document.getElementById("lyft");
const weightInput = document.getElementById("weight");
const repsInput = document.getElementById("reps");
const workoutName = document.getElementById("workout-name");
const changeWorkoutNameButton = document.getElementById("change-workout-name-button");
const saveWorkoutNameButton = document.getElementById("save-workout-name-button");
const changeWorkoutNameInput = document.getElementById("workout-name-input");
const saveWorkoutButton = document.getElementById("save-workout-button");
const userId = document.getElementById("user-id");
const lyftId = document.getElementById("lyft-id");
const workoutId = document.getElementById("workout-id");
const addNewLyftButton = document.getElementById("add-new-lyft-button"); // button to get a form view
const saveNewLyftButton = document.getElementById("save-lyft-button");
const cancelNewLyftButton = document.getElementById("cancel-lyft-button");
const workoutContainer = document.getElementById("new-workout-container");
const categoryDropdown = document.getElementById("category");

function getExercisesForCategory() {
  let category = categoryDropdown.value;
  fetch(`/api/exercises/category/${category}`)
  .then(response => {
    return response.json();
  })
  .then(data => {
    console.log("Received exercises: " + data.exercises);
    let exerciseArray = data.exercises;
    exerciseDropdown.innerHTML = "";
    for (let i = 1; i < exerciseArray.length; i++) { 
      let newExercise = document.createElement("option");
      newExercise.innerHTML = exerciseArray[i].name;
      exerciseDropdown.appendChild(newExercise);
    }

  });
}

//change exercise list on category change
categoryDropdown.addEventListener("change", () => {
  getExercisesForCategory();
})


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

//show new lyft tile
addNewLyftButton.addEventListener("click", ()=> {
  document.getElementById("log-training-container").style.display = "none";
  document.getElementById("add-lyft-container").style.display = "inline-block";
})

//remove weight
function removeWeight() {
  let weight = Number(weightInput.value);
  if (weight >= 2.5) {
    weight -= 2.5;
  }
  weightInput.value = weight;
}

//add weight 
function addWeight() {
  let weight = Number(weightInput.value);
  weight += Number(2.5);
  weightInput.value = weight;
}


//remove reps
function removeRep() {
  let reps = Number(repsInput.value);
  if (reps >= 1) {
  reps -= Number(1);
  };
  repsInput.value = reps;
}

//add reps
function addRep() {
  let reps = Number(repsInput.value);
  reps += Number(1);
  repsInput.value = reps;
}

// add set to workout
addSetButton.addEventListener("click", () => {
  let lyft = document.getElementById("lyft").value;
  let id = document.getElementById("lyft-id").textContent;
  let weight = document.getElementById("weight").value;
  let reps = document.getElementById("reps").value;
  if (lyft && id && weight > 0 && reps > 0) {
    let newSet = document.createElement("tr");
    newSet.innerHTML = `
    <td width="70%">${lyft}</td>
    <td class="id" width="0%">${id}</td>
    <td width="10%" contenteditable='true'>${weight}</td>
    <td width="10%" contenteditable='true'>${reps}</td>
    <td width="10%"></i><i class="fas fa-trash" onclick="deleteRow(this)"></i></td>
    `;
    workoutTable.appendChild(newSet);
    workoutContainer.style.display = "block";
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
  const data = {
    name: name
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
async function saveSets() {
  const data = {};
  data.sets = [];
  for (let i = 1; i < workoutTable.rows.length; i++) { 
    data.sets.push([Number(workoutTable.rows[i].cells[1].innerHTML), Number(workoutTable.rows[i].cells[2].innerHTML), Number(workoutTable.rows[i].cells[3].innerHTML), Number(workoutId.textContent)]);
  };
  console.log("Sets to be saved: ", data);
  let response = await fetch(`/api/sets/`,
  {
     method: "POST",
     headers: {
       "Content-Type": "application/json"
   },
   body: JSON.stringify(data)
 })
  let json = await response;
  console.log("Sets", json.statusText);
};


//POST workout
saveWorkoutButton.addEventListener("click", async () => {
  await saveWorkout();
  saveSets();
  window.location.href = "/feed";
});

//save new exercise helper function
async function addNewLyft() {
  const category = document.getElementById("category").value;
  const name = document.getElementById("name").value;
  const data = {
    category: category,
    name: name
  };
  console.log(data);
  let response = await fetch(`/api/exercises/`,
  {
     method: "POST",
     headers: {
       "Content-Type": "application/json"
   },
   body: JSON.stringify(data)
 })
  console.log(response.statusText);
  return response.statusCode
}

//get all lifts helper function
async function getAllExercises() {
  let response = await fetch("/api/exercises");
  let json = await response.json();
  console.log(json);
  let exerciseArray = json.exercises;
  exerciseDropdown.innerHTML = "";
  exerciseArray.forEach(element => {
    const newExercise = document.createElement("option");
    newExercise.innerHTML = `${element.name}`; 
    exerciseDropdown.appendChild(newExercise);
  });
  lyftId.innerHTML = exerciseArray[0].id;
};

//POST new exercise
saveNewLyftButton.addEventListener("click", async () => {
  await addNewLyft();
  getExercisesForCategory();
  document.getElementById("log-training-container").style.display = "inline-block";
  document.getElementById("add-lyft-container").style.display = "none";
});

//cancel adding new exercise
cancelNewLyftButton.addEventListener("click", () => {
  document.getElementById("log-training-container").style.display = "inline-block";
  document.getElementById("add-lyft-container").style.display = "none"
})