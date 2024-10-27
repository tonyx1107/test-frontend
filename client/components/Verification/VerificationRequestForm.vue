<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const content = ref("");
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const requestVerification = async (credentials: string) => {
  try {
    await fetchy("/api/verification/request", "POST", {
      body: { credentials },
    });
  } catch (_) {
    return;
  }
  emptyForm();
};

const emptyForm = () => {
  content.value = "";
};

const approveVerification = async () => {
  await fetchy("/api/verification/approveself", "POST", { body: { requester: currentUsername.value } });
};
</script>

<template>
  <section>
    <h1 v-if="!isLoggedIn" style="padding-left: 1em">Please Login First!</h1>
  </section>
  <form @submit.prevent="requestVerification(content)" class="post-form">
    <label for="content">Request Verification:</label>
    <textarea style="height: 10em" id="content" v-model="content" placeholder="Credentials for approval" required> </textarea>
    <button type="submit" class="create-button">Submit</button>
  </form>
  <menu>
    <p class="approval-message">
      Currently no admins, for experimenting purposes use button bellow to approve yourself.<button style="margin: auto" class="create-button" @click="approveVerification()">Self Approval!</button>
    </p>
  </menu>
</template>

<style scoped>
.post-form {
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 1.5em;
  max-width: 1000px;
  background-color: #ffffff;
  font-family: "Georgia", serif;
  margin: auto;
}

.approval-message {
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 1.5em;
  max-width: 800px;
  font-family: "Georgia", serif;
  margin: auto;
}

menu h2 {
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 1.5em;
  max-width: 800px;
  font-family: "Georgia", serif;
  margin: auto;
}

.post-form label {
  font-weight: bold;
  font-size: 1.1em;
  color: #333;
}

.post-form textarea {
  width: 97%;
  padding: 0.8em;
  font-size: 1em;
  font-family: "Arial", sans-serif;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  background-color: #fff;
  font-family: "Georgia", serif;
}

.post-form textarea#title {
  font-size: 1.2em;
  font-weight: bold;
  height: 2.5em;
}

.post-form textarea:focus {
  outline: none;
  border-color: #333;
}

.create-button {
  background-color: #333;
  color: #fff;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-family: "Arial", sans-serif;
}

.create-button:hover {
  background-color: #555;
}
</style>
