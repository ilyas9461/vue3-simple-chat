<template>
  <div class="card text-white bg-secondary mb-3 text-center">
    <div class="card-header">
      <img src="../assets/logo.png" alt="logo" width="90" />
      <h4>VUE3 SIMPLE CHAT</h4>
    </div>
    <div class="card-body">
      <form @submit.prevent="addUser">
        <div class="form-group input-group-sm">
          <div class="col">
            <input type="text" class="form-control" v-model="username" placeholder="Enter username here" required />
          </div>
          <div class="col mt-2">
            <input type="password" class="form-control" v-model="password" placeholder="Password" required />
          </div>

          <!-- <span data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-content="Click JOIN chat App." data-bs-placement="right"> -->
          <div class="col d-grid gap-2 mt-3 p-2">
            <input type="submit" :value="joinBtnText" class="btn btn-info btn-md" />
          </div>
          <!-- </span> -->
        </div>
      </form>
      <div v-if="!registerUserState" class="col-8">
        <button type="button" @click="registerUser()" class="btn btn-link text-warning">or register ...</button>
      </div>
    </div>
    <div class="card-footer fst-italic fs-6 text-reset">
      Design by
      <a href="https://github.com/ilyas9461" target="_blank" class="text-warning list-group-item-action card-link">ilyas9461</a>
    </div>

   

  </div>
</template>

<script>
import { ref, inject } from "vue";
// import BCollapse from "@/components/BCollapse.vue";
export default {
  components: {
    // BCollapse
  },
  setup(props, { emit }) {
    const ready = ref(false);
    const username = ref(null);
    const password = ref(null);
    const connections = ref(0);

    const joinBtnText = ref("Join");
    const registerUserState = ref(false);
    const socket = inject("socket");

    //server dan gelen soket mesajları
    socket.on("register", (data) => {
      if (password.value === data.password) {
        console.log("register=", data);
        ready.value = true;
        let eventData = {
          username: data.name,
          ready: ready.value,
          connections: data.connectCount,
        };
        emit("join-click", eventData);
      }
    });

    socket.on("joined", (data) => {
      if (password.value === data.password) {
        console.log("joined=", data);

        ready.value = true;
        let eventData = {
          username: data.name,
          ready: ready.value,
          connections: data.connectCount,
          messages:data.messages,
        };

        connections.value = data.connectCount;

        emit("join-click", eventData); //tıklama olayı
      }
    });

    function addUser() {
      //console.log("join-click");

      let data = {
        username: username.value,
        password: password.value,
      };

      if (registerUserState.value) {
        //console.log("register", data);
        socket.emit("register", data);
        registerUserState.value = false;
      } else {
        // socket.emit("joined", username.value);
        console.log("joined emit: ", data);
        socket.emit("joined", data);
      }
    } //addUser

    function registerUser() {
      console.log("register...");
      joinBtnText.value = "Register";
      registerUserState.value = true;
    }

    return {
      addUser,
      ready,
      username,
      joinBtnText,
      registerUserState,
      password,
      registerUser,
      connections,
    };
  },
};
</script>
