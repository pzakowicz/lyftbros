let url = window.location.pathname;
let arr = url.split("/");
let email = arr.slice(-1)[0];
console.log(email);


//get user data by email
function getUserData() {

  let email = workoutOwnerDropdown.value;
  fetch(`/api/users/email/${email}`)
  .then(response => {
    return response.json();
  })
  .then(data => {
    console.log("User id is: " + data.user.id);
    userId.innerHTML = data.user.id;
  });
}
