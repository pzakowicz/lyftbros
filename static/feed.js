


//add fist bump helper function
async function saveFistBump(e) {
  const workoutId = e.id;
  const data = {
    workoutId: workoutId
  };
  console.log(data);
  let response = await fetch(`/api/workouts/fist-bump/`,
   {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  let json = await response.json();
  console.log("Fist bump added: ", json);

};



function addFistBump(e) {
  saveFistBump(e)
  let id = e.id;
  //let newIcon = document.createElement("i");
  //newIcon.classList.add("fas fa-hand-rock");
  //e.replaceChild(newIcon, e.childNodes[0]);
  //document.getElementById("id").style.background-color = "black";
  document.getElementById(`comment-summary-${id}`).innerHTML = "1 fist bump";
};