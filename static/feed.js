// get elements
const usersContainer = document.getElementById("users-container");
const exercisesButton = document.getElementById("exercises-button");
const logTrainingButton = document.getElementById("log-training-button");

//functions
function getAllUsers() {
  fetch("/api/users")
    .then(response => {
      return response.json();
    })
    .then(data => {
      let userArray = data.user;
      usersContainer.innerHTML = "";
      userArray.forEach(element => {
        const newUser = document.createElement("div");
        let content = "";
        content += element.first_name;
        content += " ";
        content += element.surname;
        newUser.innerHTML = content;
        usersContainer.appendChild(newUser);
      });
    });
}

exercisesButton.addEventListener('click', () => {
  window.location.href = "/exercises";
})

logTrainingButton.addEventListener('click', () => {
  window.location.href = "/log-training";
})

function main() {
  getAllUsers();
}

//execute funcions
main();
