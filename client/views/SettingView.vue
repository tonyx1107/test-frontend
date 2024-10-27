<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import UpdateUserForm from "../components/Setting/UpdateUserForm.vue";
import FollowCountComponent from "@/components/Following/FollowCountComponent.vue";

const { currentUsername } = storeToRefs(useUserStore());
const { logoutUser, deleteUser } = useUserStore();
const user = ref<Record<string, any> | null>(null);
const loaded = ref(false);

const getUser = async (username: string) => {
  let result;
  try {
    result = await fetchy(`/api/users/${username}`, "GET", { alert: false });
  } catch (_) {
    user.value = null;
    return;
  }
  user.value = result;
};

onBeforeMount(async () => {
  await getUser(currentUsername.value);
  loaded.value = true;
});

async function logout() {
  await logoutUser();
  void router.push({ name: "Home" });
}

async function delete_() {
  await deleteUser();
  void router.push({ name: "Home" });
}
</script>

<template>
  <main class="column">
    <h1>{{ currentUsername }}'s Profile</h1>
    <FollowCountComponent :user="user" />
    <button class="pure-button pure-button-primary" @click="logout">Logout</button>
    <button class="button-error pure-button" @click="delete_">Delete User</button>
    <UpdateUserForm />
  </main>
</template>
