<script setup lang="ts">
import { useFollowsStore } from "@/stores/follow";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref, watch } from "vue";

const followsStore = useFollowsStore();
const { follows } = storeToRefs(useFollowsStore());
const { isLoggedIn, currentUsername } = storeToRefs(useUserStore());
const props = defineProps(["username"]);

const loaded = ref(false);
const following = ref<boolean | null>(null);

const getFollowingStatus = async () => {
  for (const follow of follows.value) {
    if (follow.followed === props.username && follow.follower === currentUsername.value) {
      following.value = true;
      return;
    }
  }
  following.value = false;
};

const follow = async () => {
  try {
    await fetchy(`/api/follow`, "POST", {
      body: { username: props.username },
    });
  } catch (_) {
    return;
  }
};

const unfollow = async () => {
  try {
    await fetchy(`/api/follow/${props.username}`, "DELETE");
  } catch (_) {
    return;
  }
};

const toggleFollow = async () => {
  if (following.value === true) {
    following.value = false;
    await unfollow();
  } else if (following.value === false) {
    following.value = true;
    await follow();
  }
  await followsStore.getFollows();
};

onBeforeMount(async () => {
  await followsStore.getFollows();
  await getFollowingStatus();
  loaded.value = true;
});

watch(
  () => follows.value,
  async () => {
    await getFollowingStatus();
  },
);
</script>

<template>
  <div v-if="loaded && isLoggedIn && currentUsername !== props.username">
    <button class="follow-button" @click="toggleFollow">
      {{ following ? "Unfollow" : "Follow" }}
    </button>
  </div>
</template>

<style>
.follow-button {
  display: inline-block;
  padding: 6px 12px;
  font-size: 12px;
  background-color: #050303;
  color: #ffffff;
  border: 1px solid #ddd;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 2px;
  transition: background-color 0.3s ease;
}

.follow-button:hover {
  background-color: #343434;
}
</style>
