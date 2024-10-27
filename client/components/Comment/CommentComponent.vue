<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";
import { useRoute } from "vue-router";
import CommentListComponent from "./CommentListComponent.vue";
import FollowComponent from "../Following/FollowComponent.vue";

const currentRoute = useRoute();
const props = defineProps(["comment"]);
const emit = defineEmits(["editComment", "refreshComments"]);
const { currentUsername } = storeToRefs(useUserStore());

const deleteComment = async () => {
  try {
    await fetchy(`/api/discussion/${props.comment._id}`, "DELETE");
  } catch {
    return;
  }
  emit("refreshComments");
};

async function viewComments() {
  void router.push({ name: "Comments", params: { id: props.comment._id } });
}
</script>

<template>
  <div class="comment-container">
    <p class="author">{{ props.comment.author }} <FollowComponent style="display: inline-flex; padding-left: 1em" :username="props.comment.author" /></p>
    <p>{{ props.comment.content }}</p>
    <div class="base">
      <menu>
        <button v-if="props.comment._id != currentRoute.params.id" @click="viewComments" class="comment-button">View Comments & Reply</button>
        <li v-if="props.comment.author == currentUsername"><button class="edit-button" @click="emit('editComment', props.comment._id)">Edit</button></li>
        <li v-if="props.comment.author == currentUsername"><button class="delete-button" @click="deleteComment">Delete</button></li>
      </menu>
      <article class="timestamp">
        <p v-if="props.comment.dateCreated !== props.comment.dateUpdated">Edited on: {{ formatDate(props.comment.dateUpdated) }}</p>
        <p v-else>Created on: {{ formatDate(props.comment.dateCreated) }}</p>
      </article>
    </div>
    <div class="comments" v-if="props.comment._id != currentRoute.params.id">
      <CommentListComponent :root="props.comment" />
    </div>
  </div>
</template>

<style scoped>
.comment-container {
  width: 800px;
  margin: auto;
  font-family: "Georgia", serif;
  line-height: 1.6;
  color: #333;
  padding: 20px;
  align-items: center;
  background-color: white;
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

p {
  margin: 0em;
}

.author {
  font-weight: bold;
  font-size: 1.2em;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
  padding-top: 1em;
}

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}
</style>
