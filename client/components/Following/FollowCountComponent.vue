<script setup lang="ts">
import router from "@/router";
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, onBeforeUpdate, ref } from "vue";

const props = defineProps(["user"]);

const loaded = ref(false);
const followers = ref<Array<Record<string, string>>>([]);
const following = ref<Array<Record<string, string>>>([]);

async function getFollowers() {
  const query: Record<string, string> = { username: props.user.username };
  let followersResults;
  try {
    followersResults = await fetchy("/api/follow/followers", "GET", { query, alert: false });
  } catch (_) {
    return;
  }
  followers.value = followersResults;
}

async function getFollowing() {
  const query: Record<string, string> = { username: props.user.username };
  let followingResults;
  try {
    followingResults = await fetchy("/api/follow/following", "GET", { query, alert: false });
  } catch (_) {
    return;
  }
  following.value = followingResults;
}

async function viewFollowers() {
  void router.push({ name: "Followers", params: { username: props.user.username } });
}

async function viewFollowing() {
  void router.push({ name: "Following", params: { username: props.user.username } });
}

onBeforeMount(async () => {
  await getFollowers();
  await getFollowing();
  loaded.value = true;
});

onBeforeUpdate(async () => {
  if (!loaded.value) {
    await getFollowers();
    await getFollowing();
    loaded.value = true;
  }
});
</script>

<template>
  <div class="followers" v-if="loaded">
    <p style="text-align: center" class="clickable" @click="viewFollowers">
      <span>
        {{ followers.length }}
        <b>followers</b>
      </span>
    </p>
    <p class="clickable" @click="viewFollowing">
      <span>
        {{ following.length }}
        <b>following</b>
      </span>
    </p>
  </div>
  <div class="followers" v-else>
    <p>Loading...</p>
    <p></p>
  </div>
</template>
<style>
.clickable {
  font-family: -apple-system, system-ui, system-ui, "Segoe UI", Roboto, "Helvetica Neue", "Fira Sans", Ubuntu, Oxygen, "Oxygen Sans", Cantarell, "Droid Sans", "Apple Color Emoji", "Segoe UI Emoji",
    "Segoe UI Symbol", "Lucida Grande", Helvetica, Arial, sans-serif;
  width: 200px;
  margin-right: 8em;
  display: inline;
}

span {
  font-size: 1.5em;
}

span b {
  font-size: 80%;
  font-weight: normal;
}
</style>
