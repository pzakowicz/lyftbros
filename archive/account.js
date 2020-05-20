//get elements

const userName = document.getElementById("user-name");
const userNameInput = document.getElementById("user-name-input");
const userSurname = document.getElementById("user-surname");
const userSurnameInput = document.getElementById("user-surname-input");
const userEmail = document.getElementById("user-email");
const userEmailInput = document.getElementById("user-email-input");
const userGender = document.getElementById("user-gender");
const userGenderInput = document.getElementById("user-gender-input");
const userDateOfBirth = document.getElementById("user-dob");
const userDateOfBirthInput = document.getElementById("user-dob-input");
const userWeight = document.getElementById("user-weight");
const userWeightInput = document.getElementById("user-weight-input");
const editAccountButton = document.getElementById("edit-account-button");
const saveAccountButton = document.getElementById("save-account-button");
const cancelChangesButton = document.getElementById("cancel-changes-button");


//edit account
editAccountButton.addEventListener("click", () => {
  userName.style.display = "none";
  userNameInput.style.display = "inline";
  userNameInput.value = userName.innerHTML;
  userSurname.style.display = "none";
  userSurnameInput.style.display = "inline";
  userSurnameInput.value = userSurname.innerHTML;
  userEmail.style.display = "none";
  userEmailInput.style.display = "inline";
  userEmailInput.value = userEmail.innerHTML;
  userGender.style.display = "none";
  userGenderInput.style.display = "inline";
  userGenderInput.value = userGender.innerHTML;
  userDateOfBirth.style.display = "none";
  userDateOfBirthInput.style.display = "inline";
  userDateOfBirthInput.value = userDateOfBirth.innerHTML;
  userWeight.style.display = "none";
  userWeightInput.style.display = "inline";
  userWeightInput.value = userWeight.innerHTML;
  editAccountButton.style.display = "none";
  saveAccountButton.style.display = "inline";
  cancelChangesButton.style.display = "inline";
});

//cancel changes
cancelChangesButton.addEventListener("click", () => {
  userName.style.display = "";
    userNameInput.style.display = "";
    userSurname.style.display = "";
    userSurnameInput.style.display = "";
    userEmail.style.display = "";
    userEmailInput.style.display = "";
    userGender.style.display = "";
    userGenderInput.style.display = "";
    userDateOfBirth.style.display = "";
    userDateOfBirthInput.style.display = "";
    userWeight.style.display = "";
    userWeightInput.style.display = "";
    editAccountButton.style.display = "inline";
    saveAccountButton.style.display = "none";
    cancelChangesButton.style.display = "none";
})

//update account helper function
async function updateAccount() {
  const name = userNameInput.value;
  const surname = userSurnameInput.value;
  const email = userEmailInput.value;
  const gender = userGenderInput.value;
  const dob = userDateOfBirthInput.value;
  const weight = userWeightInput.value;

  const data = {
    name: name,
    surname: surname,
    email: email,
    gender: gender,
    dob: dob,
    weight: weight
  };
  console.log(data);
  
  let response = await fetch(`/api/users/`,
   {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  let json = await response.json();
  console.log("Account updated: ", json);
};


//save account changes
saveAccountButton.addEventListener("click", async () => {
  if (userNameInput.value && userSurnameInput.value && userEmailInput.value && userGenderInput.value && userDateOfBirthInput.value && userWeightInput.value ) {
    saveAccountButton.innerHTML = "Saving...";
    saveAccountButton.disabled = true;
    await updateAccount();
    userName.innerHTML = userNameInput.value;
    userSurname.innerHTML = userSurnameInput.value;
    userEmail.innerHTML = userEmailInput.value;
    userGender.innerHTML = userGenderInput.value;
    userDateOfBirth.innerHTML = userDateOfBirthInput.value;
    userWeight.innerHTML = userWeightInput.value;
    userName.style.display = "";
    userNameInput.style.display = "";
    userSurname.style.display = "";
    userSurnameInput.style.display = "";
    userEmail.style.display = "";
    userEmailInput.style.display = "";
    userGender.style.display = "";
    userGenderInput.style.display = "";
    userDateOfBirth.style.display = "";
    userDateOfBirthInput.style.display = "";
    userWeight.style.display = "";
    userWeightInput.style.display = "";
    editAccountButton.style.display = "";
    saveAccountButton.style.display = "";
    cancelChangesButton.style.display = "";
    saveAccountButton.innerHTML = "Save";
    saveAccountButton.disabled = false;
  } else {
    alert("All fields must be filled out.")
  }
});