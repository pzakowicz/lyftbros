//get elements
const createUserButton = document.getElementById("create-user");
const loginForm = document.getElementById("login-form");
const createForm = document.getElementById("create-form");
const cancelCreateAccount = document.getElementById("cancel-create-account");
const loginButton = document.getElementById("login-button");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const showCreateAccountForm = document.getElementById("show-create-account-form");
const userCreatedMessage = document.getElementById("user-created");

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

function showUserCreatedMessage() {
  document.getElementById("create-form").style.display = "none";
  userCreatedMessage.style.display = "block";
  userCreatedMessage.style.width = "100%";

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
  createUserButton.innerHTML = "Creating...";
  createUserButton.disabled = true;
  fetch(`/api/users/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      showUserCreatedMessage();
      loginForm.style.display = "";
      createUserButton.innerHTML = "Create";
      createUserButton.disabled = false;
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
    username: email,
    password: password
  };
  if (data.username && data.password) {
    loginButton.innerHTML = "Logging in...";
    loginButton.disabled = true;
    let response = await fetch(`/api/users/login/`,
    {
       method: "POST",
       credentials: "include",
       headers: {
         "Content-Type": "application/json"
     },
    body: JSON.stringify(data),
   })

   console.log(response);
    if (response.status === 200) {
      console.log("login successful");
      window.location.href = response.url;
      loginButton.innerHTML = "Login";
      loginButton.disabled = false;
    } else if (response.status === 401){
      console.log("Incorrect password or user");
      userNotFoundMessage();
      loginButton.innerHTML = "Login";
      loginButton.disabled = false;
    }

  }
});


//show create account form 
showCreateAccountForm.addEventListener("click", () => {
  createForm.style.display = "block";
  loginForm.style.display = "none";
  showCreateAccountForm.style.display = "none";

})

//cancel account creation
cancelCreateAccount.addEventListener("click", () => {
  createForm.style.display = "none";
  loginForm.style.display = "block";
  showCreateAccountForm.style.display = "block";
})