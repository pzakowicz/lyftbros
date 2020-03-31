//imports

function createUser() {
    let user = {};
    user.name = document.getElementById('name').value;
    user.surname = document.getElementById('surname').value;
    user.email = document.getElementById('email-create').value;
    user.password = document.getElementById('password-create').value;
    users.push(user);
    console.log(users);
}


//CREATE USER
const xhr = new XMLHttpRequest();
const url = 



// listeners

let createUserButton = document.getElementById('create-user');