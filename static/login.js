//get elements
const createUserButton = document.getElementById("create-user");

function findGender() {
  let male = document.getElementById("male");
  let female = document.getElementById("female");
  if (male.checked) {
    return male.value;
  } else if (female.checked) {
    return female.value;
  }
}

//event listener
createUserButton.addEventListener("click", () => {
  const name = document.getElementById("name").value;
  const surname = document.getElementById("surname").value;
  const gender = findGender();
  const email = document.getElementById("email-create").value;
  const password = document.getElementById("password-create").value;
  const data = {
    first_name: name,
    surname: surname,
    gender: gender,
    email: email,
    password: password
  };
  console.log(data);
  fetch(`/api/users/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      console.log(data.user);
    })
    .catch(error => {
      console.error("Error:", error);
    });
});
