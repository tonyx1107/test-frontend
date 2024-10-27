<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["root"]);
const content = ref("");
const emit = defineEmits(["refreshComments"]);

const createComment = async (content: string) => {
  try {
    await fetchy("/api/discussion", "POST", {
      body: { root: props.root._id, content },
    });
  } catch (_) {
    return;
  }
  emit("refreshComments");
  emptyForm();
};

const emptyForm = () => {
  content.value = "";
};
</script>

Copy code
<template>
  <form @submit.prevent="createComment(content)" class="post-form">
    <label for="content">Comment Contents:</label>
    <textarea id="content" v-model="content" placeholder="Create a comment!" required></textarea>
    <button type="submit" class="create-button">Post Comment</button>
  </form>
</template>

<style scoped>
.post-form {
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 1.5em;
  width: 800px;
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
