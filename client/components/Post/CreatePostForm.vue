<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const content = ref("");
const title = ref("");
const props = defineProps(["type"]);
const emit = defineEmits(["refreshPosts"]);

const createPost = async (content: string, title: string) => {
  try {
    await fetchy("/api/posts", "POST", {
      body: { content, title },
    });
  } catch (_) {
    return;
  }
  emit("refreshPosts");
  emptyForm();
};

const emptyForm = () => {
  content.value = "";
};
</script>

<template>
  <form @submit.prevent="createPost(content, title)" class="post-form">
    <label for="title">{{ type }} Title:</label>
    <textarea id="title" v-model="title" placeholder="Enter the title here" required></textarea>

    <label for="content">{{ type }} Contents:</label>
    <textarea id="content" style="height: 15em" v-model="content" placeholder="Write your post content here" required></textarea>

    <button type="submit" class="create-button">Create Post</button>
  </form>
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
