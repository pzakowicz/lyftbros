function addFistBump(e) {
  let id = e.id;
  //let newIcon = document.createElement("i");
  //newIcon.classList.add("fas fa-hand-rock");
  //e.replaceChild(newIcon, e.childNodes[0]);
  //document.getElementById("id").style.background-color = "black";
  document.getElementById(`comment-summary-${id}`).innerHTML = "1 fist bump";
};