<template>
  <div class="container">
    <!-- <div class="col-lg-4 offset-lg-4"> -->
    <div v-if="ready">
      <p v-for="(user, i) in info" :key="i">{{ user.username }} {{ user.type }}</p>
    </div>
    <!-- chat form  -->
    <h2 v-else>{{ username }}</h2>

    <div class="card bg-info" v-if="ready">
      <div class="card-header text-white">
        <h4>
          My Chat App
          <span class="float-right">{{ connections }} connections</span>
        </h4>
      </div>
      
      <div  class="overflow-auto " style="max-height:300px" id="ul_messages">
        <ul class="list-group list-group-flush text-right">
        <small v-if="typing" class="text-white">{{ typing }} is typing</small>
                   
          <li :class="{ 'list-group-item list-group-item-primary text-start': message.user === 'Me', 
          'list-group-item list-group-item-warning text-end': message.user !== 'Me'}"

           v-for="(message, i) in messages" :key="i">
            <span >
              {{ message.message }} <small>:{{ message.user }}</small>
            </span>
          </li>

        </ul>
      </div>
      

      <div class="card-body">
        <form @submit.prevent="send">
          <div class="form-group">
            <input type="text" class="form-control mt-2" v-model="newMessage" placeholder="Enter message here" />
          </div>
        </form>
      </div>
    </div>
    <!-- </div> -->
  </div>
</template>

<script>
import { ref, reactive, watch, onBeforeUnmount, inject, onMounted } from "vue"; //
// import SocketioService from "../services/socketio_service";
// import { io } from "socket.io-client";

export default {
  name: "ChatForm",
  props: ["userdata"],
  setup(props) {
    // const io = new SocketioService();
    //io.setupSocketConnection();
    //console.log("props :", props);

    let newMessage = ref(null);
    let typing = ref(false);
    let ready = ref(true);
    let info = reactive([]);
    const connections = ref();
    const messages = reactive([]);
    const username = ref(null);

    //const socket = io(process.env.VUE_APP_SOCKET_ENDPOINT); // start connection
    // const socket = soketio.connect(process.env.VUE_APP_SOCKET_NET_ADR, {
    //   forceNew: true,
    // }); // start connection

    const socket = inject("socket");

    //socket.emit("my message", "Chat Form setup....");
    socket.emit("users");

   // socket.on("list users")

    //server emit message
    socket.on("my-broadcast", (data) => {
      console.log(data);
    });

    socket.on("chat-message", (data) => {
      messages.push({
        message: data.message,
        type: 1,
        user: data.user,
      });
    });

    socket.on("joined", (data) => {
      info.push({
        username: data.name,
        type: "joined",
      });

      messages.push(...data.messages);

      setTimeout(() => {
        info.length = 0;
      }, 5000);
    });

    socket.on("typing", (data) => {
      typing.value = data;
    });

    socket.on("stopTyping", () => {
      typing.value = false;
    });

    socket.on("connections", (data) => {
      connections.value = data;
    });

    //works when the join button is clicked.
    function addUser() {
      ready.value = true;
      socket.emit("joined", username.value);
    }
    //works when the send message enter button is pressed.
    function send() {
      messages.push({
        message: newMessage.value,
        type: 0,
        user: "Me",
      });

      socket.emit("chat-message", {
        message: newMessage.value,
        user: username.value,
      });
      newMessage.value = null;

      var element = document.getElementById("ul_messages");
      element.scrollTop = element.scrollHeight-element.clientHeight;
      
    }

    onMounted(() => {
      username.value = props.userdata.username;
      ready.value = props.userdata.ready;
      connections.value = props.userdata.connections;//inject('connections');
      messages.push(props.userdata.messages);

      console.log("messages : ",messages);
      
    });

    watch(newMessage, (newMessage) => {
      //, preNewMessage
      // newMessage ? socket.emit("typing", username.value)  : socket.emit("stopTyping");
      if (newMessage) socket.emit("typing", username.value);
      else socket.emit("stopTyping");
    });

    onBeforeUnmount(() => {
      // io.disconnect();
      socket.disconnect();
    });

    return {
      addUser,
      send,
      newMessage,
      messages,
      typing,
      username,
      ready,
      info,
      connections,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
