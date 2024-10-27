<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";
import { useRoute } from "vue-router";
import router from "@/router";
import FollowComponent from "../Following/FollowComponent.vue";
import { ref } from "vue";

const currentRoute = useRoute();
const props = defineProps(["post", "collapsible"]);
const emit = defineEmits(["editPost", "refreshPosts"]);
const { currentUsername } = storeToRefs(useUserStore());
const isExpanded = ref(false);

const deletePost = async () => {
  try {
    await fetchy(`/api/posts/${props.post._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshPosts");
};

async function viewComments() {
  void router.push({ name: "Comments", params: { id: props.post._id } });
}
</script>
<template>
  <div class="article-container">
    <h3 class="article-title">{{ props.post.title }}</h3>
    <p class="article-author">By {{ props.post.author }} <FollowComponent style="display: inline-flex; padding-left: 1em" :username="props.post.author" /></p>
    <p class="article-content" v-if="collapsible && !isExpanded">{{ props.post.content.slice(0, 400) }}...</p>
    <p class="article-content" v-else>{{ props.post.content }}</p>
    <button v-if="props.post._id != currentRoute.params.id" class="comment-button" @click="viewComments">View Article</button>
    <button v-if="collapsible" @click="isExpanded = !isExpanded" class="toggle-button">
      {{ isExpanded ? "Show Less" : "Show More" }}
    </button>
    <div class="button-container">
      <menu v-if="props.post.author == currentUsername">
        <button class="edit-button" @click="$emit('editPost', props.post._id)">Edit</button>
        <button class="delete-button" @click="deletePost">Delete</button>
      </menu>
    </div>

    <article class="timestamp">
      <p v-if="props.post.dateCreated !== props.post.dateUpdated">Edited: {{ formatDate(props.post.dateUpdated) }}</p>
      <p v-else>Created: {{ formatDate(props.post.dateCreated) }}</p>
    </article>
  </div>
</template>

<style scoped>
.article-container {
  width: 800px;
  margin: auto;
  font-family: "Georgia", serif;
  line-height: 1.6;
  color: #333;
  padding: 20px;
  align-items: center;
}

.article-title {
  font-size: 28px;
  font-weight: bold;
  color: #111;
  margin-bottom: 8px;
}

.article-author {
  font-size: 14px;
  color: #555;
  margin-bottom: 16px;
}

.article-content {
  font-size: 18px;
  color: #333;
  margin-bottom: 12px;
}

.toggle-button {
  display: inline-block;
  padding: 8px 16px;
  font-size: 14px;
  background-color: #f2f2f2;
  color: #111;
  border: 1px solid #ddd;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 12px;
  transition: background-color 0.3s ease;
}

.toggle-button:hover {
  background-color: #e0e0e0;
}

.button-container {
  display: inline-block;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.comment-button,
.edit-button,
.delete-button {
  font-size: 14px;
  padding: 8px 16px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.comment-button {
  display: inline-block;
  padding: 8px 16px;
  font-size: 14px;
  background-color: #f2f2f2;
  color: #111;
  border: 1px solid #ddd;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 12px;
  transition: background-color 0.3s ease;
  margin-right: 1em;
}

.comment-button:hover {
  background-color: #e0e0e0;
}

.edit-button {
  background-color: #33a0ff;
  color: #e9e9e9;
  margin-right: 1em;
}

.edit-button:hover {
  background-color: #4bcfff;
}

.delete-button {
  background-color: #ff4136;
  color: white;
}

.delete-button:hover {
  background-color: hsl(3, 79%, 52%);
}

.timestamp {
  font-size: 12px;
  color: #888;
  border-top: 1px solid #ddd;
  padding-top: 10px;
  margin-top: 20px;
}
</style>
