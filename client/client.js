let socket = io.connect();
let chat_box_display = document.getElementById("output_chat");
let users_online_list = document.getElementById("list_users");
let user_name_input = document.getElementById("user_name");


document.getElementById("add_user").addEventListener("click", function () {
    user_name_input = user_name_input.value;
    socket.emit('listUsers', (user_name_input));
});

document.getElementById("sent_it_all").addEventListener("click", function () {
    let message = document.getElementById("input_chat").value;
    socket.emit('sendToAll', (user_name_input + ': ' + message));
});

document.getElementById("sent_it_me").addEventListener("click", function () {
    let message = document.getElementById("input_chat").value;
    socket.emit('sendToMe', (user_name_input + ': ' + message));
});

socket.on('displayMessage', (message) => {
    chat_box_display.innerHTML += '<br>' + message;
});

socket.on('usersInfo', (users_chatbox) => {
    let user_color = users_chatbox[0]['color'];

    chat_box_display.style.color = user_color;
});

socket.on('update_user_list', (users_chatbox) => {
    console.log(users_chatbox);
    users_online_list.innerHTML = '';
    for (let i = 0; i < users_chatbox.length; i++) {
        users_online_list.innerHTML += '<br>' + users_chatbox[i].username;
    }
});


