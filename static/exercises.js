//get elements
const exerciseTable = document.getElementById("exercise-table");
const exerciseRowContainer = document.getElementById("exercise-rows");
const addExerciseButton = document.getElementById("add-exercise-button");

//helper functions
function findEquipment() {
  let equipmentList = document.getElementById("equipment");
  let selected = equipmentList.options[equipmentList.selectedIndex].text;
  return selected
}

function findMeasurement() {
  let measurementList = document.getElementById("measurement");
  let selected = measurementList.options[measurementList.selectedIndex].text;
  return selected
}


//GET all exercises 
function getAllExercises() {
  fetch("/api/exercises")
    .then(response => {
      return response.json();
    })
    .then(data => {
      let exerciseArray = data.exercise;
      exerciseTable.innerHTML = "";
      const tableHeader = document.createElement("tr");
      tableHeader.innerHTML = `
      <th>Name</th>
      <th>Equipment</th>
      <th>Measurement</th>
      `;
      exerciseTable.appendChild(tableHeader);
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

//POST new exercise
addExerciseButton.addEventListener("click", () => {
  const name = document.getElementById("name").value;
  const equipment = findEquipment();
  const measurement = findMeasurement();
  const data = {
    name: name,
    equipment: equipment,
    measurement: measurement,
  };
  console.log(data);
  fetch(`/api/exercises/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      console.log(data.exercise);
    })
    .catch(error => {
      console.error("Error:", error);
    });
    getAllExercises();
});

function main() {
  getAllExercises();
}

//execute funcions
main();
