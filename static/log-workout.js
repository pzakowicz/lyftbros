// get elements
const addSetButton = document.getElementById("submit-set-button");
const workoutTable = document.getElementById("workout-table");
const exerciseDropdown = document.getElementById("lyft");
const weightInput = document.getElementById("weight");
const repsInput = document.getElementById("reps");
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
let workoutName = "Lyft session";


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


//create tables with historical lifts
function createLiftHistory() {

  //clear previous contents
  document.getElementById("History").innerHTML = "";

  //see if lift is in historical workouts
  userWorkouts.iterate(function (value, key) {
    for (let i = 0; i < value.length; i++) { 
      if (value[i][0] === exerciseDropdown.value) {
      let newWorkout = document.createElement("table");
      newWorkout.setAttribute("id", key);
      newWorkout.classList.add("lift-history");
      newWorkout.innerHTML = `
      <tr> 
        <th><a href="/workouts/${key}">${value[0][0]}</a></th>
        <th>${value[0][1].slice(0,10)}</th>
        <th></th>
      </tr>`;
      document.getElementById("History").appendChild(newWorkout);
      break
      }
    }

    for (let i = 0; i < value.length; i++) { 
      if (value[i][0] === exerciseDropdown.value) {
        let set = document.createElement("tr");
        set.innerHTML = `
        <td width="50%">${value[i][0]}</td>
        <td width="20%">${value[i][1]} kg</td>
        <td width="20%">${value[i][2]} reps</td>`;
        document.getElementById(key).appendChild(set);
      }
    }
    
});
}

//show new lyft tile
addNewLyftButton.addEventListener("click", ()=> {
  document.getElementById("log-training-container").style.display = "none";
  document.getElementById("add-lyft-container").style.display = "inline-block";
  document.getElementById("add-category").selectedIndex = categoryDropdown.selectedIndex;

})

//decrement weight
function removeWeight() {
  let weight = Number(weightInput.value);
  if (weight >= 2.5) {
    weight -= 2.5;
  }
  weightInput.value = weight;
}

//increment weight 
function addWeight() {
  let weight = Number(weightInput.value);
  weight += Number(2.5);
  weightInput.value = weight;
}

//decrement reps
function removeRep() {
  let reps = Number(repsInput.value);
  if (reps >= 1) {
  reps -= Number(1);
  };
  repsInput.value = reps;
}

//increment reps
function addRep() {
  let reps = Number(repsInput.value);
  reps += Number(1);
  repsInput.value = reps;
}

// add set to workout
addSetButton.addEventListener("click", async () => {
  let category = categoryDropdown.value;
  let lyft = exerciseDropdown.value;
  let weight = weightInput.value;
  let reps = repsInput.value;

  if (category && lyft && weight > 0 && reps > 0) {

  //add set to localforage
  let val = [];
  let exerciseId = 0;
  lifts.iterate(function (value, key1) {
    if (key1 === category) {
      value.forEach(element => {
        if (element[1] === lyft) {
          exerciseId = String(element[0]);
        }
      });
    }   
  })

  //set a key
  let key = "i";
  let keys = await workout.keys();

  if (keys[0]) {
    key =keys[keys.length-1]+"i";
  }

  //add to indexedDB
  val.push(exerciseId, category, lyft, weight, reps);
  await workout.setItem(key, val);

  //find if there is a lift of this name already added and at which row
  let insertIndex = 0;
  for (let i = 0; i < workoutTable.rows.length; i++) { 
    if (workoutTable.rows[i].cells[3].innerHTML === lyft) {
      insertIndex = i;
      break;
    } else {
      insertIndex = workoutTable.rows.length;
    }
  }

  //insert set next to an existing set of the same exercise
  let newSet = workoutTable.insertRow(insertIndex);
  newSet.setAttribute("onclick", "selectRow(this)");
  newSet.innerHTML = `
  <td class="hidden" width="0%">${key}</td>
  <td class="hidden" width="0%">${exerciseId}</td>
  <td class="hidden" width="0%">${category}</td>
  <td width="70%">${lyft}</td>
  <td width="10%"><span class="weight">${weight}</span><span class="unit"> kg</span></td>
  <td width="10%">${reps}</td>
  <td width="10%"></i><i class="fas fa-trash" onclick="deleteRow(this)"></i></td>`;
  workoutContainer.style.display = "block";


  
 }
});

//populate table from local storage
function populateTable() {
  //add all sets in the local storage
  workout.iterate(function (value, key) {

    let insertIndex = 0;
    for (let i = 0; i < workoutTable.rows.length; i++) { 
      if (workoutTable.rows[i].cells[3].innerHTML === value[2]) {
        insertIndex = i;
        break;
      } else {
        insertIndex = workoutTable.rows.length;
      }
    }
  
    //insert set next to an existing set of the same exercise
    let newSet = workoutTable.insertRow(insertIndex);
    newSet.setAttribute("onclick", "selectRow(this)");
    newSet.innerHTML = `
    <td class="hidden" width="0%">${key}</td>
    <td class="hidden" width="0%">${value[0]}</td>
    <td class="hidden" width="0%">${value[1]}</td>
    <td width="70%">${value[2]}</td>
    <td width="10%"><span class="weight">${value[3]}</span><span class="unit"> kg</span></td>
    <td width="10%">${value[4]}</td>
    <td width="10%"></i><i class="fas fa-trash" onclick="deleteRow(this)"></i></td>`;
    workoutContainer.style.display = "block";

  })

}



//delete set from workout
async function deleteRow(r) {
  //delete row from table
  let i = r.parentNode.parentNode.rowIndex;
  document.getElementById("workout-table").deleteRow(i);

  //delete set from local storage
  let key = r.parentNode.parentNode.children[0].innerHTML;
  await workout.removeItem(key);

};

//select row and populate logger with 
async function selectRow(r) {
  let setCategory = r.children[2].innerHTML;
  let setLift = r.children[3].innerHTML;
  let setWeight = r.children[4].children[0].innerHTML;
  let setReps = r.children[5].innerHTML;
  categoryDropdown.value = setCategory;
  await getExercisesForCategory();
  weightInput.value = setWeight;
  repsInput.value = setReps;
  exerciseDropdown.value = setLift;
}

//save workout helper function
async function saveWorkout() {
  const name = workoutName;
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
  //workoutId.innerHTML = json.workout[0].id;
  await localWorkout.setItem("id", json.workout[0].id)
  return response;
};

//save sets helper function
async function saveSets() {
  const data = {};
  data.sets = [];

  let id = await localWorkout.getItem("id");

  data.sets = [];
  for (let i = 1; i < workoutTable.rows.length; i++) { 
    data.sets.push([Number(workoutTable.rows[i].cells[1].innerHTML), Number(workoutTable.rows[i].cells[4].children[0].innerHTML), Number(workoutTable.rows[i].cells[5].innerHTML), id]);
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
  return response;
};

//remove sets and name from local storage helper function
async function removeSetsFromLocalStorage() {
   await workout.clear(function () {
    console.log("Sets cleared.")
  })

}

//POST workout
saveWorkoutButton.addEventListener("click", async () => {
  if ( await workout.key(0)) {
    workoutName = prompt("Give your workout a name", "Lyft session")
    if (workoutName) {
      saveWorkoutButton.innerHTML = "Saving...";
      saveWorkoutButton.disabled = true;
      let saveWorkoutResult = await saveWorkout();
      if (saveWorkoutResult.status === 201) {
        let saveSetsResult = await saveSets();
        if (saveSetsResult.status === 201) {
          await removeSetsFromLocalStorage();
          saveWorkoutButton.innerHTML = "Save";
          saveWorkoutButton.disabled = false;
          window.location.href = "/feed";
        } else {
          alert("Failed to save sets, try again.");
        }
        
      } else {
        alert("Failed to save workout, try again.");
      }
      
    };
    
  } else {
    alert("Add at least one set to save a workout.")
  }

});

//clear workout
clearWorkoutButton.addEventListener("click", () => {
  //remove sets from table
  if (confirm("Delete this workout?")) {
    for (let i = 1; i < workoutTable.rows.length;) { 
      workoutTable.deleteRow(i);
    }
    

    removeSetsFromLocalStorage()
  }
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



//save all exercises from mysql to indexedDB
async function getAllExercisesForLocalStorage() {
  await lifts.clear();
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
  await lifts.iterate( function (value, key) {
    if (key === category) {
      value.forEach(element => {
        let newExercise = document.createElement("option");
        newExercise.setAttribute("value", element[1]);
        newExercise.innerHTML = element[1];
        exerciseDropdown.appendChild(newExercise);
      });
    } 
  })
};

//get all of user historical workouts
async function getUserWorkouts() {
  await userWorkouts.clear();
  fetch(`/api/workouts/user`)
  .then(response => {
    return response.json();
  })
  .then(data => {
    let workoutArray = data.workout;

    let existingWorkout = [];
    for (let i = 0; i < workoutArray.length; i++) { 
      if (!existingWorkout.includes(workoutArray[i].id)) {
        existingWorkout.push(workoutArray[i].id);
        let key = String(workoutArray[i].id);
        let val = [];
        val.push([workoutArray[i].workout_name, workoutArray[i].date_time]);
        for (let j = 0; j < workoutArray.length; j++) { 
          if (String(workoutArray[j].id) === key) {
            val.push([workoutArray[j].lift_name, workoutArray[j].weight, workoutArray[j].reps]);
          }
        }
        userWorkouts.setItem(key, val);
      }
    }

  })
}

//show tab button
function openTab(tabName) {
  var i;
  var x = document.getElementsByClassName("tab");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  createLiftHistory();
  document.getElementById(tabName).style.display = "flex";
}

// setting up indexedDB with localforage
window.addEventListener("load", async function () {
  lifts = localforage.createInstance({ 'name': 'lifts'});
  workout = localforage.createInstance({ 'name': 'workout'});
  localWorkout = localforage.createInstance({ 'name': 'local'});
  userWorkouts = localforage.createInstance({'name': 'userWorkouts'});
  getAllExercisesForLocalStorage()
  userWorkouts = localforage.createInstance({'name': 'userWorkouts'});
  getUserWorkouts();
  populateTable();



})