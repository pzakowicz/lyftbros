//get elements
const createUserButton = document.getElementById("create-user");
const loginButton = document.getElementById("login-button");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

//helper functions
function findGender() {
  let male = document.getElementById("male");
  let female = document.getElementById("female");
  if (male.checked) {
    return male.value;
  } else if (female.checked) {
    return female.value;
  }
}

function userCreatedMessage() {
  document.getElementById("create-form").style.display = "none";
  document.getElementById("user-created").style.display = "inline";
}

function userNotFoundMessage() {
  document.getElementById("user-not-found").style.display = "inline";
}

function emailTakenMessage() {
    document.getElementById("email-taken").style.display = "inline";
}

//Create user request
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
      userCreatedMessage();
    })
    .catch(error => {
      console.error("Error:", error);
    });
});

//Login request
loginButton.addEventListener("click", async () => {
  let email = emailInput.value;
  let password = passwordInput.value;
  let data = {
    email: email,
    password: password
  };
  if (data.email && data.password) {
    let response = await fetch(`/api/users/login/`,
    {
       method: "POST",
       headers: {
         "Content-Type": "application/json"
     },
     body: JSON.stringify(data)
   })
   console.log(response);
    if (response.status === 200) {
      console.log("login successfully");
      window.location.href = "/feed";
    } else if (response.status === 400){
      console.log("No matching user found");
      userNotFoundMessage();
    }

  }
});
