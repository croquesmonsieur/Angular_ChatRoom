let socket = io.connect();
//let socket_private = ioPr.connect();
let chat_box_display = document.getElementById("output_chat");
let users_online_list = document.getElementById("list_users");
let user_name_input = document.getElementById("user_name");
let userArray = [];
let room = "Red Room";

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

document.getElementById("other_room").addEventListener("click", () => {

    console.log(user_name_input);
});



socket.on('displayMessageAll', (data) => {
    let output_tag = document.createElement('span');
    let output_msg = document.createTextNode(data.message);
    let span_tag = document.createElement('br');
    output_tag.style.color = data.color;
    output_tag.appendChild(output_msg);
    chat_box_display.appendChild(output_tag);
    chat_box_display.appendChild(span_tag);
});

socket.on('displayMessageMe', (data) => {
    let output_tag = document.createElement('span');
    let output_msg = document.createTextNode(data.message);
    let span_tag = document.createElement('br');
    output_tag.style.color = data.color;
    output_tag.appendChild(output_msg);
    chat_box_display.appendChild(output_tag);
    chat_box_display.appendChild(span_tag);
});

socket.on('announcements', (data) => {
    console.log('Got announcement:', data.message);
    chat_box_display.innerHTML += data.message + '<br>';
});

socket.on('Goodbye', (data) => {
    chat_box_display.innerHTML += data.message + '<br>';
})

socket.on('usersInfo', (users_chatbox) => {
    userArray = [...users_chatbox];
    let user_color = userArray[0]['color'];
    console.log(user_color);
});

socket.on('update_user_list', (users_chatbox) => {
    console.log(users_chatbox);
    users_online_list.innerHTML = '';
    for (let i = 0; i < users_chatbox.length; i++) {
        let span = document.createElement('span');
        let br_tag = document.createElement('br');
        let textNode = document.createTextNode(users_chatbox[i].username);
        span.appendChild(textNode);
        users_online_list.appendChild(span);
        users_online_list.appendChild(br_tag);
        //users_online_list.innerHTML += '<br>' + users_chatbox[i].username;
    }
});

socket.on('connectToRoom', (data) => {
    socket.emit('room', room);
    document.getElementById('private_output').innerHTML += data.message;
    console.log(data.message);
});
