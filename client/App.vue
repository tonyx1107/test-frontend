<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { fetchy } from "@/utils/fetchy";
import { computed, onBeforeMount, onBeforeUpdate, ref } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());
const { currentUsername } = storeToRefs(useUserStore());
const verified = ref<boolean | null>(null);

const getVerificationStatus = async () => {
  const query: Record<string, string> = { username: currentUsername.value };
  verified.value = await fetchy("/api/verification/status", "GET", { query, alert: false });
};

// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  try {
    await userStore.updateSession();
  } catch {
    // User is not logged in
    await getVerificationStatus();
  }
});

onBeforeUpdate(async () => {
  if (verified.value == null && currentUsername.value !== "") {
    await getVerificationStatus();
  }
});
</script>

<template>
  <header>
    <nav>
      <div class="title">
        <img src="@/assets/images/logo.png" />
        <RouterLink :to="{ name: 'Home' }">
          <h1>NewsNet</h1>
        </RouterLink>
      </div>
      <ul>
        <li>
          <RouterLink :to="{ name: 'CreatePost' }" :class="{ underline: currentRouteName == 'CreatePost' }"> <img src="@/assets/images/plus.png" /> </RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'Friends' }" :class="{ underline: currentRouteName == 'Friends' }"> <img src="@/assets/images/messages.png" /> </RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'Verification' }" :class="{ underline: currentRouteName == 'Verification' }"> <img src="@/assets/images/verify.png" /> </RouterLink>
        </li>
        <li v-if="isLoggedIn">
          <RouterLink :to="{ name: 'Settings' }" :class="{ underline: currentRouteName == 'Settings' }"> <img src="@/assets/images/profile.png" /> </RouterLink>
        </li>
        <li v-else>
          <RouterLink :to="{ name: 'Login' }" :class="{ underline: currentRouteName == 'Login' }"> <img src="@/assets/images/profile.png" /> </RouterLink>
        </li>
      </ul>
    </nav>
    <article v-if="toast !== null" class="toast" :class="toast.style">
      <p>{{ toast.message }}</p>
    </article>
  </header>
  <RouterView />
</template>

<style scoped>
@import "./assets/toast.css";

nav {
  padding: 1em 2em;
  background-color: rgb(255, 255, 255);
  display: flex;
  align-items: center;
  /* position: fixed; */
  overflow: hidden;
  border: 1px solid #dedede;
  border-radius: 4px;
  box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.055);
  z-index: 10;
}

h1 {
  font-size: 2em;
  font-family: -apple-system, system-ui, system-ui, "Segoe UI", Roboto, "Helvetica Neue", "Fira Sans", Ubuntu, Oxygen, "Oxygen Sans", Cantarell, "Droid Sans", "Apple Color Emoji", "Segoe UI Emoji",
    "Segoe UI Symbol", "Lucida Grande", Helvetica, Arial, sans-serif;
  margin: 0;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

img {
  height: 2em;
}

a {
  font-size: large;
  color: black;
  text-decoration: none;
}

ul {
  list-style-type: none;
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 1em;
}

.underline {
  text-decoration: underline;
}

.content {
  padding-top: 80px; /* Adjust padding to match the navbar's height */
}

body {
  padding-top: 80px; /* Adjust padding to match the navbar's height */
}
</style>
