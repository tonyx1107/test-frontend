<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, onBeforeUpdate, ref } from "vue";
import UpdateUserForm from "../components/Setting/UpdateUserForm.vue";
import FollowCountComponent from "@/components/Following/FollowCountComponent.vue";

const { currentUsername } = storeToRefs(useUserStore());
const { logoutUser, updateSession } = useUserStore();
const user = ref<Record<string, any> | null>(null);
const loaded = ref(false);
const verified = ref<boolean | null>(null);

const getVerificationStatus = async () => {
  const query: Record<string, string> = { username: currentUsername.value };
  verified.value = await fetchy("/api/verification/status", "GET", { query });
};

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

onBeforeUpdate(async () => {
  if (verified.value == null) {
    await getVerificationStatus();
  }
});

async function logout() {
  await logoutUser();
  void updateSession();
  void router.push({ name: "Home" });
  void updateSession();
}
</script>

<template>
  <main class="profile-page">
    <div class="profile-header">
      <div class="profile-info">
        <h1 class="username">
          {{ currentUsername }}
          <img v-if="verified" src="@/assets/images/verify.png" class="verify-icon" />
        </h1>
        <FollowCountComponent :user="user" style="margin-left: 10em" />
      </div>
      <div class="actions">
        <button class="action-button logout-button" @click="logout">Logout</button>
      </div>
    </div>
    <UpdateUserForm class="update-form" />
  </main>
</template>

<style scoped>
.profile-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2em;
  font-family: Arial, sans-serif;
}

.profile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1.5em;
  border-bottom: 1px solid #ddd;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 1em;
}

.username {
  font-size: 2em;
  font-weight: bold;
  margin: 0;
}

.verify-icon {
  width: 25px;
  height: 25px;
  margin-left: 0.3em;
}

.actions {
  display: flex;
  gap: 1em;
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

.logout-button {
  background-color: #0095f6;
}

.update-form {
  margin-top: 1.5em;
}
</style>
