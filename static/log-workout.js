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
const clearWorkoutButton = document.getElementById("clear-workout-button");
const userId = document.getElementById("user-id");
const lyftId = document.getElementById("lyft-id");
const workoutId = document.getElementById("workout-id");
const addNewLyftButton = document.getElementById("add-new-lyft-button"); // button to get a form view
const saveNewLyftButton = document.getElementById("save-lyft-button");
const cancelNewLyftButton = document.getElementById("cancel-lyft-button");
const workoutContainer = document.getElementById("new-workout-container");
const categoryDropdown = document.getElementById("category");
const userWeight = document.getElementById("user-weight");
const category = document.getElementById("add-category").value;
const name = document.getElementById("add-name").value;


function fillUserWeight() {
  if (categoryDropdown.value === "Bodyweight") {
    weightInput.value = userWeight.innerHTML;
  } else {
    weightInput.value = 0;
  }
}
  

//change exercise list on category change
categoryDropdown.addEventListener("change", () => {
  getExercisesForCategory();
  fillUserWeight();
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
    lyftId.innerHTML = data.exercise[0].id;
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
addSetButton.addEventListener("click", async () => {
  let lyft = document.getElementById("lyft").value;
  let id = document.getElementById("lyft-id").textContent;
  let weight = document.getElementById("weight").value;
  let reps = document.getElementById("reps").value;

  if (lyft && id && weight > 0 && reps > 0) {

    /*
    let insertIndex = 0;
    for (let i = 0; i < workoutTable.rows.length; i++) { 
      if (workoutTable.rows[i].cells[0].innerHTML === lyft) {
        insertIndex = i;
        break;
      } else {
        insertIndex = workoutTable.rows.length;
      }
    }

    let newSet = workoutTable.insertRow(insertIndex);
    newSet.innerHTML = `
    <td width="70%">${lyft}</td>
    <td class="id" width="0%">${id}</td>
    <td width="10%" contenteditable='true'>${weight} <span class="unit">kg</span></td>
    <td width="10%" contenteditable='true'>${reps}</td>
    <td width="10%"></i><i class="fas fa-trash" onclick="deleteRow(this)"></i></td>`;
    workoutContainer.style.display = "block";
  } */
  //add set to localforage
  let val = [];
  let category = categoryDropdown.value;
  let exerciseId = 0;
  lifts.iterate(function (value, key) {
    if (key === category) {
      value.forEach(element => {
        if (element[1] === lyft) {
          exerciseId = String(element[0]);
        }
      });
    }   
  })

  let keys = await workout.keys();
  let key = "0";
  if (keys[0]) {
    key = String(Number(keys[keys.length-1])+1);
  }
  
  val.push(exerciseId, lyft, weight, reps);
  await workout.setItem(key, val);

  workout.iterate(function (value, key) {
    console.log(key, value);
  })

  let newSet = document.createElement("tr");
  newSet.innerHTML = `
  <td class="hidden" width="0%">${key}</td>
  <td width="70%">${lyft}</td>
  <td width="10%">${weight} <span class="unit">kg</span></td>
  <td width="10%">${reps}</td>
  <td width="10%"></i><i class="fas fa-trash" onclick="deleteRow(this)"></i></td>`;
  workoutTable.appendChild(newSet);




 }
});

//populate table based on local storage
function populateTable() {
  //add all sets in the local storage
  workout.iterate(function (value, key) {
    let newSet = document.createElement("tr");
    newSet.innerHTML = `
    <td class="hidden" width="0%">${key}</td>
    <td width="70%">${value[1]}</td>
    <td width="10%">${value[2]} <span class="unit">kg</span></td>
    <td width="10%">${value[3]}</td>
    <td width="10%"></i><i class="fas fa-trash" onclick="deleteRow(this)"></i></td>`;
    workoutTable.appendChild(newSet);
  })
  //update the workout name if there is one
  localName.getItem("workoutName").then( function(result) {
    if (result) {
      workoutName.innerHTML = result;
    }
  })
}

//add 

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

    //save name to local storage
    localName.setItem("workoutName", workoutName.innerHTML);
  }
})

//delete set
async function deleteRow(r) {
  //delete row from table
  var i = r.parentNode.parentNode.rowIndex;
  document.getElementById("workout-table").deleteRow(i);

  //delete set from local storage
  let key = r.parentNode.parentNode.children[0].innerHTML;
  await workout.removeItem(key);

  workout.iterate(function (value, key) {
    console.log(key, value);
  })
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
  console.log("Workout id:", json.workout[0].id);
  workoutId.innerHTML = json.workout[0].id;
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
  saveWorkoutButton.innerHTML = "Saving...";
  saveWorkoutButton.disabled = true;
  await saveWorkout();
  await saveSets();
  saveWorkoutButton.innerHTML = "Save";
  saveWorkoutButton.disabled = false;
  window.location.href = "/feed";
});

//clear workout
clearWorkoutButton.addEventListener("click", () => {
  //remove sets from table
  for (let i = 1; i < workoutTable.rows.length;) { 
    workoutTable.deleteRow(i);
  }

  //remove sets from localforage
  workout.iterate( function (value, key) {
    workout.removeItem(key);
  })
  
  //change workout name to default
  workoutName.innerHTML = "Lyft session";

  //remove workout name from local storage
  localName.removeItem("workoutName");

})

//save new exercise helper function
async function addNewLyft() {
  const category = document.getElementById("add-category").value;
  const name = document.getElementById("add-name").value;
  const data = {
    category: category,
    name: name
  };
  console.log(data);
  //add new exercise to local storage


  //add new exercise to database
  let response = await fetch(`/api/exercises/`,
  {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  console.log(response.statusText);
  return response;
}

//POST new exercise
saveNewLyftButton.addEventListener("click", async () => {
  const category = document.getElementById("add-category").value;
  const name = document.getElementById("add-name").value;
  document.getElementById("lyft-exists").style.display = "none";
  if (category && name) {
    saveNewLyftButton.innerHTML = "Adding...";
    saveNewLyftButton.disabled = true;
    let result = await addNewLyft();
    console.log(result);
    if (result.status === 201) {
      document.getElementById("log-training-container").style.display = "inline-block";
      document.getElementById("add-lyft-container").style.display = "none";
      saveNewLyftButton.innerHTML = "Add lyft";
      saveNewLyftButton.disabled = false;
      alert("Lyft added!");
      await getAllExercisesForLocalStorage();
      await getExercisesForCategory();
    } else if (result.status === 400) {
      document.getElementById("lyft-exists").style.display = "block";
      saveNewLyftButton.innerHTML = "Add lyft";
      saveNewLyftButton.disabled = false;
    }
  } else {
    alert("Name cannot be blank.")
  }

  
});

//cancel adding new exercise
cancelNewLyftButton.addEventListener("click", () => {
  document.getElementById("log-training-container").style.display = "inline-block";
  document.getElementById("add-lyft-container").style.display = "none"
})

// setting up indexedDB with localforage
window.addEventListener("load", function () {
  lifts = localforage.createInstance({ 'name': 'lifts'});
  workout = localforage.createInstance({ 'name': 'workout'});
  localName = localforage.createInstance({ 'name': 'local'});
  getAllExercisesForLocalStorage()
  populateTable();


})

//save all exercises from db to local storage
async function getAllExercisesForLocalStorage() {
  await fetch(`/api/exercises/`)
  .then(response => {
    return response.json();
  })
  .then(data => {
    let exerciseArray = data.exercises;
    let existingCategory = [];
    for (let i = 0; i < exerciseArray.length; i++) { 
      if (!existingCategory.includes(exerciseArray[i].category)) {
        existingCategory.push(exerciseArray[i].category);
        let key = exerciseArray[i].category;
        let val = [];
        for (let j = 0; j < exerciseArray.length; j++) { 
          if (exerciseArray[j].category === key) {
            val.push([exerciseArray[j].id, exerciseArray[j].name]);
          }
        }
        lifts.setItem(key, val);
      }
    }
  })
}


//udpdate exercise dropdown from local storage
async function getExercisesForCategory() {
  let category = categoryDropdown.value;
  exerciseDropdown.innerHTML = "";
  lifts.iterate( function (value, key) {
    if (key === category) {
      value.forEach(element => {
        let newExercise = document.createElement("option");
        newExercise.innerHTML = element[1];
        exerciseDropdown.appendChild(newExercise);
      });
    } 
  })
};

