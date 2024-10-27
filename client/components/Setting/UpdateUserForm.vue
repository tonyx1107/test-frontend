<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { ref } from "vue";
import router from "@/router";

let username = ref("");
let currentPassword = ref("");
let newPassword = ref("");

const { updateUserUsername, updateUserPassword, updateSession, deleteUser } = useUserStore();

async function updateUsername() {
  await updateUserUsername(username.value);
  await updateSession();
  username.value = "";
}

async function updatePassword() {
  await updateUserPassword(currentPassword.value, newPassword.value);
  await updateSession();
  currentPassword.value = newPassword.value = "";
}

async function delete_() {
  await deleteUser();
  void router.push({ name: "Home" });
}
</script>

<template>
  <div class="update-user-form">
    <h2 class="form-title">Update User Details</h2>
    <form @submit.prevent="updateUsername" class="update-form">
      <fieldset>
        <legend>Change your username</legend>
        <input type="text" placeholder="New username" v-model="username" required class="input-field" />
        <button type="submit" class="form-button update-button">Update Username</button>
      </fieldset>
    </form>

    <form @submit.prevent="updatePassword" class="update-form">
      <fieldset>
        <legend>Change your password</legend>
        <input type="password" placeholder="Old password" v-model="currentPassword" required class="input-field" />
        <input type="password" placeholder="New password" v-model="newPassword" required class="input-field" />
        <button type="submit" class="form-button update-button">Update Password</button>
      </fieldset>
    </form>
    <button class="action-button delete-button" @click="delete_">Delete User</button>
  </div>
</template>

<style scoped>
.update-user-form {
  max-width: 500px;
  margin: 1.5em auto;
  padding: 1.5em;
  background-color: #ffffff;
  font-family: Arial, sans-serif;
}

.form-title {
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 1em;
  text-align: center;
  color: #333;
}

.update-form {
  margin-bottom: 1.5em;
}

.update-form fieldset {
  border: none;
  padding: 0;
}

.update-form legend {
  font-weight: bold;
  font-size: 1.1em;
  color: #555;
  margin-bottom: 0.5em;
}

.input-field {
  width: 100%;
  padding: 0.7em;
  font-size: 1em;
  margin-bottom: 1em;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: #fff;
  font-family: Arial, sans-serif;
}

.input-field:focus {
  outline: none;
  border-color: #333;
}

.form-button {
  background-color: #0095f6;
  color: #fff;
  font-weight: bold;
  padding: 0.6em 1.2em;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 1em;
}

.form-button:hover {
  background-color: #007bb5;
}

.update-button {
  width: 100%;
  text-align: center;
}

.action-button {
  background-color: #0095f6;
  color: white;
  font-weight: bold;
  padding: 0.5em 1em;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
}

.delete-button {
  background-color: #ed4956;
}
</style>
