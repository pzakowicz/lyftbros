const usersContainer = document.getElementById("users-container");

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

function main() {
  getAllUsers();
}

main();
