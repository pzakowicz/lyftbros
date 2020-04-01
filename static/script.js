//get elements
const createUserButton = document.getElementById('create-user');
const newUserContainer = document.getElementById('new-user');


//event listener
createUserButton.addEventListener('click', () => {
    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const email = document.getElementById('email-create').value;
    const password = document.getElementById('password-create').value;

    fetch(`/api/users?name=${name}&surname=${surname}&email=${email}&password=${password}`, { method: 'POST' })
    .then(response => response.json())
    .then(({user}) => {
        const newUser = document.createElement('div');
        newUser.innerHTML = `
        <h3>Congrats, your user was added!</h3>
        <div class="user-name">${user.name}</div>
        <div class="user-surname">- ${user.surname}</div>
        `
        newUserContainer.appendChild(newQuote);
    });

});