<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";

const props = defineProps(["username", "type"]);

const loaded = ref(false);
const follows = ref<Array<Record<string, string>>>([]);

async function getFollows() {
  const query: Record<string, string> = { username: props.username };
  let followsResults;
  try {
    followsResults = await fetchy(`/api/follow/${props.type}`, "GET", { query, alert: false });
  } catch (_) {
    return;
  }
  follows.value = followsResults;
}

onBeforeMount(async () => {
  await getFollows();
  loaded.value = true;
});
</script>

<template>
  <div class="followers-list">
    <div v-if="loaded && follows.length !== 0">
      <ul class="follow-items">
        <li v-for="follow in follows" :key="follow._id">
          {{ props.type === "Followers" ? follow.follower : follow.followed }}
        </li>
      </ul>
    </div>
    <div v-else-if="loaded" class="no-follows">
      <p v-if="props.type === 'Followers'">No followers yet!</p>
      <p v-else>Not following anyone yet!</p>
    </div>
    <div v-else class="loading-text">Loading...</div>
  </div>
</template>

<style scoped>
.followers-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Arial, sans-serif;
  font-size: 16px;
  color: #333;
}

.follow-items {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.follow-items li {
  padding: 10px;
  margin: 5px 0;
  text-align: center;
}

.no-follows,
.loading-text {
  margin-top: 20px;
  color: #999;
  font-size: 14px;
}
</style>
