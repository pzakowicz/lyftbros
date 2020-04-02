const getAllUsers = document.getElementById("get-users");
const usersContainer = document.getElementById("users-container");

const getUserByNameInput = document.getElementById("first-name");
const getUserByNameButton = document.getElementById("get-user");
const userContainer = document.getElementById("user-container");

getAllUsers.addEventListener("click", () => {
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
});

getUserByNameButton.addEventListener("click", () => {
  let name = getUserByNameInput.value;
  fetch(`/api/users/${name}`)
    .then(response => {
      return response.json();
    })
    .then(data => {
      console.log(data.user);
      userContainer.innerHTML = "";
      let name = data.user.first_name;
      let surname = data.user.surname;
      let content = name + " " + surname;
      userContainer.innerHTML = content;
    });
});
