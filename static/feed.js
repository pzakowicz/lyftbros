//get elements
const modal = document.getElementById("commentModal");
const closeButton = document.getElementsByClassName("close")[0];
const modalContent = document.getElementsByClassName("modal-content")[0];
const fistBumpsTable = document.getElementById("fist-bumps-table");

//add fist bump
async function addFistBump(e) {
  const workoutId = e.id;
  const data = {
    workoutId: workoutId
  };
  let response = await fetch(`/api/workouts/fist-bumps/add/`,
   {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  // check if fist bump has been added
  if (response.status === 201) {
    console.log("Fist bump added");
    let elementToUpdate = document.getElementById(`fist-bump-count-${workoutId}`);
    if (elementToUpdate) {  //check if a counter element already exists
      //increment counter
      let currentCount = Number(document.getElementById(`fist-bump-count-${workoutId}`).innerHTML);
      currentCount ++;
      document.getElementById(`fist-bump-count-${workoutId}`).innerHTML = currentCount;
    } else {   // add new counter
      let newCount = document.createElement("span");
      newCount.setAttribute("id", `fist-bump-count-${workoutId}`)
      newCount.innerHTML = "1";
      let newText = document.createElement("span");
      newText.innerHTML = " fist bumps!";
      let container = document.getElementById(`comment-summary-${workoutId}`);
      container.innerHTML = "";
      container.appendChild(newCount);
      container.appendChild(newText);
    }
    //update the icon button
    let icon = document.getElementById(`fist-${workoutId}`);
    icon.className = "fas fa-hand-rock";
  }
};

//show comment modal
async function showModal(e) {
  fistBumpsTable.innerHTML = "";
  let tableHeader = document.createElement("tr");
  tableHeader.innerHTML = `<th>Fist bumps</th>`;
  fistBumpsTable.appendChild(tableHeader);
  //get data about bros who gave bumps
  let elementId = e.id;
  let idArray = elementId.split("-");
  let workoutId = idArray[2];
  let response = await fetch(`/api/workouts/fist-bumps/${workoutId}`);
  let json = await response.json();
  let fistBumpArray = json.bumps;
  fistBumpArray.forEach(element => {
    let newFistBump = document.createElement("tr");
    newFistBump.innerHTML = `<td><a href="/users/${element.email}">${element.first_name} ${element.surname}</a></td>`
    fistBumpsTable.appendChild(newFistBump);
  });
  modal.style.display = "block";
}



//close the modal with a button
closeButton.onclick = function() {
  modal.style.display = "none";
}


// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

