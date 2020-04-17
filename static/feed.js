
//add fist bump helper function
async function addFistBump(e) {
  const workoutId = e.id;
  const data = {
    workoutId: workoutId
  };
  let response = await fetch(`/api/workouts/fist-bump/`,
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
    //let icon = e.childNodes[0];
    let icon = document.getElementById(`fist-${workoutId}`);
    icon.className = "fas fa-hand-rock";
  }
};
