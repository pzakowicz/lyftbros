//get elements
const exerciseTable = document.getElementById("exercise-table");
const exerciseRowContainer = document.getElementById("exercise-rows");

//helper functions

//GET exercises from db
function getAllExercises() {
  fetch("/api/exercises")
    .then(response => {
      return response.json();
    })
    .then(data => {
      let exerciseArray = data.exercise;
      exerciseRowContainer.innerHTML = "";
      exerciseArray.forEach(element => {
        const newExercise = document.createElement("tr");
        newExercise.innerHTML = `
        <td>${element.name}</td>
        <td>${element.equipment}</td>
        <td>${element.measurement}</td>
        `;
        exerciseTable.appendChild(newExercise);
      });
    });
}

function main() {
  getAllExercises();
}

//execute funcions
main();
