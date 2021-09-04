<template>
  <div class="container">
    <!-- <NavBar v-if="ready" /> -->
    <div v-if="!ready" class="col-lg-4 offset-lg-4">
      <JoinForm @join-click="joinClick" />
    </div>

    <div v-if="ready">
      <ul class="nav nav-tabs" id="myTab" role="tablist">
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="users-tab"
            data-bs-toggle="tab"
            data-bs-target="#users"
            type="button"
            role="tab"
            aria-controls="users"
            aria-selected="false"
          >
            Users
          </button>
        </li>

        <li class="nav-item" role="presentation">
          <button
            class="nav-link active"
            id="home-tab"
            data-bs-toggle="tab"
            data-bs-target="#home"
            type="button"
            role="tab"
            aria-controls="home"
            aria-selected="true"
          >
            Messages
          </button>
        </li>
        
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="contact-tab"
            data-bs-toggle="tab"
            data-bs-target="#contact"
            type="button"
            role="tab"
            aria-controls="contact"
            aria-selected="false"
          >
            Contact
          </button>
        </li>
      </ul>
    </div>

    <div class="tab-content" id="myTabContent">
     <div class="tab-pane fade" id="users" role="tabpanel" aria-labelledby="profile-tab">
        <div class="col-lg-5 col-sm-12">
          <!-- d-none d-md-block d-lg-block d-xl-block -->
          <div>
            <h3>User : {{ username }}</h3>
          </div>

          <ol class="list-group list-group-numbered">
            <li v-for="user in listUsers" :key="user.id" class="list-group-item d-flex justify-content-between align-items-start">
              <div class="ms-2 me-auto">
                <div class="fw-bold">{{ user.name }}</div>
                <div v-if="user.online">online</div>
                <div v-else>offline</div>
              </div>
              <span class="badge bg-primary rounded-pill">14</span>
            </li>
          </ol>
        </div>
      </div>

       <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
        <div v-if="ready" class="row align-items-start mt-2">
          <div class="col-lg-12 col-sm-12">
            <!-- d-none d-md-block d-lg-block d-xl-block -->
            <div>
              <h3>User : {{ username }}</h3>
            </div>

            <!-- <ol class="list-group list-group-numbered">
              <li v-for="user in listUsers" :key="user.id" class="list-group-item d-flex justify-content-between align-items-start">
                <div class="ms-2 me-auto">
                  <div class="fw-bold">{{ user.name }}</div>
                  <div v-if="user.online">online</div>
                  <div v-else>offline</div>
                </div>
                <span class="badge bg-primary rounded-pill">14</span>
              </li>
            </ol> -->
          </div>

          <div class="col-lg-12 col-sm-12">
            <ChatForm :userdata="userdata" />
          </div>
        </div>
      </div>

      <div class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
        
        <div class="col-lg-12 col-sm-12">
          <a href="https://github.com/ilyas9461" target="_blank" rel="noopener noreferrer">https://github.com/ilyas9461</a>
          <hr><br>
          <a href="https://www.youtube.com/channel/UC-RoDTjzHMOTfeGWU-0MBSw" target="_blank" rel="noopener noreferrer">youtube</a>
          <hr><br>
          <a href="https://www.linkedin.com/in/ilyas-ya%C4%9Fcio%C4%9Flu-6a6b17217/" target="_blank" rel="noopener noreferrer">linkedin</a>
            
          </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
// @ is an alias to /src
import ChatForm from "@/components/ChatForm.vue";
// import NavBar from "@/components/NavBar.vue";
import JoinForm from "@/components/JoinForm.vue";
import Footer from "@/components/Footer.vue";
import { Popover } from "bootstrap/dist/js/bootstrap.esm.min.js";
import { ref, onMounted, inject } from "vue"; //ref, reactive, watch, onBeforeUnmount,

export default {
  name: "Home",
  components: {
    ChatForm,
    // NavBar,
    JoinForm,
    Footer,
  },
  setup() {
    const ready = ref(false);
    const username = ref(null);
    const userdata = ref({});
    const listUsers = ref(null);

    const socket = inject("socket");

    socket.on("list users", (data) => {
      listUsers.value = data;

      console.log("list users:", listUsers.value);
    });

    socket.on("disconnect-user", (data) => {
      let index = listUsers.value.findIndex((x) => x.user_id === data.user_id);

      listUsers.value[index].online = data.online;

      console.log("list users:", listUsers.value);
    });

    onMounted(() => {
      Array.from(document.querySelectorAll('span[data-bs-toggle="popover"]')).forEach((popoverNode) => new Popover(popoverNode));
    });

    function joinClick(event) {
      console.log("readyClick : ", event);
      socket.emit("users");

      ready.value = event.ready;
      username.value = event.username;
      ready.value = event.ready;

      userdata.value = {
        username: username.value,
        ready: ready.value,
        connections: event.connections,
        messages: event.messages,
      };
    }

    return {
      ready,
      username,
      joinClick,
      userdata,
      listUsers,
    };
  },
};
</script>
