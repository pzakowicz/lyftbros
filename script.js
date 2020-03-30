let users = [];


class User {
    constructor(name, surname, gender, email, password) {
        this.name = name;
        this.surname = surname;
        this.gender = gender;
        this.email = email;
        this.password = password;
    }
}


function createUser() {
    let user = {};
    user.name = document.getElementById('name').value;
    user.surname = document.getElementById('surname').value;
    user.email = document.getElementById('email-create').value;
    user.password = document.getElementById('password-create').value;
    users.push(user);
    console.log(users);
}

function printUser() {
    document.getElementById('created-user').innerHTML = user.name;
}

// listeners

let createUserButton = document.getElementById('create-user');