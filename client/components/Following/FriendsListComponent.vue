<script setup lang="ts">
import router from "@/router";
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername } = storeToRefs(useUserStore());
const loaded = ref(false);
const friends = ref<Array<Record<string, string>>>([]);

async function getFriends() {
  const query: Record<string, string> = { username: currentUsername.value };
  let friendResults;
  try {
    friendResults = await fetchy(`/api/follow/friends`, "GET", { query, alert: false });
  } catch (_) {
    return;
  }
  friends.value = friendResults;
}

async function viewMessages(friend: string) {
  void router.push({ name: "Messages", params: { friend } });
}

onBeforeMount(async () => {
  await getFriends();
  loaded.value = true;
});
</script>

<template>
  <div v-if="loaded && friends.length !== 0">
    <div v-for="friend in friends" :key="friend._id">
      <li v-if="friend.followed === currentUsername">
        {{ friend.follower }}
        <menu>
          <button class="btn-small pure-button" @click="viewMessages(friend.follower)">Messages</button>
        </menu>
      </li>
      <li v-else>
        {{ friend.followed }}
        <menu>
          <button class="btn-small pure-button" @click="viewMessages(friend.followed)">Messages</button>
        </menu>
      </li>
    </div>
  </div>
  <div v-else-if="loaded">
    <p>No Friends yet!</p>
  </div>
  <div v-else>Loading...</div>
</template>
