<script setup lang="ts">
import { ref } from "vue";

const author = ref("");
const emit = defineEmits(["getPostsByAuthor"]);
</script>
<template>
  <form @submit.prevent="emit('getPostsByAuthor', author)" class="search-form">
    <div>
      <legend>Search by Author</legend>
      <input id="author" type="text" v-model="author" placeholder="Enter username" />
      <button type="submit" class="search-button">Search</button>
    </div>
  </form>
</template>

<style scoped>
.search-form {
  margin: auto;
  gap: 0.8em;
  background-color: #ffffff;
  width: 800px;
  padding-top: 2em;
}

div {
  width: 1000px;
}

.search-form legend {
  font-size: 1.2em;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5em;
  font-family: "Georgia", serif;
}

.search-form input[type="text"] {
  padding: 0.5em;
  font-size: 1em;
  width: 70%;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: "Arial", sans-serif;
}

.search-form input[type="text"]:focus {
  outline: none;
  border-color: #333;
}

.search-button {
  display: inline-flex;
  background-color: #333;
  color: #fff;
  padding: 0.5em 1em;
  font-size: 1em;
  font-weight: bold;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: "Arial", sans-serif;
  transition: background-color 0.3s;
}

.search-button:hover {
  background-color: #555;
}
</style>
