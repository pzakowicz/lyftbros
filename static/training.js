// get elements
const exercisesButton = document.getElementById("exercises-button");
const logTrainingButton = document.getElementById("log-training-button");
const addSetButton = document.getElementById("submit-set-button");
const workoutTableContainer = document.getElementById("workout-table-container");
const workoutTable = document.getElementById("workout-table");
const exerciseDropdown = document.getElementById("lyft");

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
}


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


//main function
function main() {
  getAllExercises();
};

main();
