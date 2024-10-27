<script setup lang="ts">
import CreateMessageForm from "./CreateMessageForm.vue";
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";

const currentRoute = useRoute();
const loaded = ref(false);
let messages = ref<Array<Record<string, string>>>([]);

async function getMessages(friend: string | string[]) {
  let messageResults;
  try {
    messageResults = await fetchy(`/api/messages/${friend}`, "GET", {});
  } catch (_) {
    return;
  }
  messages.value = messageResults;
}

onBeforeMount(async () => {
  await getMessages(currentRoute.params.friend);
  loaded.value = true;
});
</script>

<template>
  <section>
    <h2>Send Message:</h2>
    <CreateMessageForm :friend="currentRoute.params.friend" @refreshMessages="getMessages(currentRoute.params.friend)" />
  </section>
  <div class="row">
    <h2>Messages with {{ currentRoute.params.friend }}:</h2>
  </div>
  <section class="messages" v-if="loaded && messages.length !== 0">
    <article v-for="message in messages" :key="message._id" class="message">
      <p class="sender">
        <strong>{{ message.sender }}:</strong>
      </p>
      <p class="content">{{ message.content }}</p>
      <p class="timestamp">{{ new Date(message.timestamp).toLocaleString() }}</p>
    </article>
  </section>
  <p v-else-if="loaded">No Messages found</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
.messages {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
}

.message {
  padding: 0.5rem;
  border-bottom: 1px solid #ddd;
}

.sender {
  color: #333;
  font-weight: bold;
}

.content {
  color: #555;
  margin: 0.25rem 0;
}

.timestamp {
  font-size: 0.75rem;
  color: #888;
  text-align: right;
}
</style>
