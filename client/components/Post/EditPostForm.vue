<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { formatDate } from "../../utils/formatDate";

const props = defineProps(["post"]);
const content = ref(props.post.content);
const title = ref(props.post.title);
const emit = defineEmits(["editPost", "refreshPosts"]);

const editPost = async (content: string, title: string) => {
  try {
    await fetchy(`/api/posts/${props.post._id}`, "PATCH", { body: { content: content, title: title } });
  } catch (e) {
    return;
  }
  emit("editPost");
  emit("refreshPosts");
};
</script>

<template>
  <form class="post-form" @submit.prevent="editPost(content, title)">
    <textarea style="height: 1em; font-size: 20px; font-weight: bold" id="title" v-model="title" placeholder="Title" required> </textarea>
    <textarea style="height: 20em" id="content" v-model="content" placeholder="Create a post!" required> </textarea>
    <div class="base">
      <menu>
        <button class="create-button" type="submit">Save</button>
        <button class="create-button" style="margin-left: 1em" @click="emit('editPost')">Cancel</button>
      </menu>
      <p v-if="props.post.dateCreated !== props.post.dateUpdated" class="timestamp">Edited on: {{ formatDate(props.post.dateUpdated) }}</p>
      <!-- <p v-else class="timestamp">Created on: {{ formatDate(props.post.dateCreated) }}</p> -->
    </div>
  </form>
</template>

<style scoped>
.post-form {
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 1.5em;
  max-width: 1000px;
  min-width: 800px;
  background-color: #ffffff;
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
