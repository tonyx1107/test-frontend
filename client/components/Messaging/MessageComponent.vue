<script setup lang="ts">
import CreateMessageForm from "./CreateMessageForm.vue";
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";

const currentRoute = useRoute();
const loaded = ref(false);
let messages = ref<Array<Record<string, string>>>([]);
const props = defineProps(["friend"]);

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
  await getMessages(props.friend);
  loaded.value = true;
});
</script>

<template>
  <main class="message-content">
    <div v-if="props.friend">
      <section>
        <CreateMessageForm :friend="props.friend" @refreshMessages="getMessages(props.friend)" />
      </section>
      <section class="messages" v-if="loaded && messages.length !== 0">
        <article v-for="message in messages" :key="message._id" class="message">
          <p class="sender">
            <strong>{{ message.sender }}:</strong>
          </p>
          <p class="content">{{ message.content }}</p>
          <p class="timestamp">{{ new Date(message.timestamp).toLocaleString() }}</p>
        </article>
      </section>
      <p v-else-if="loaded" class="no-messages">No Messages found</p>
      <p v-else class="loading">Loading...</p>
    </div>
    <p v-else class="select-friend">Select a friend to view messages</p>
  </main>
</template>

<style scoped>
.messages {
  display: flex;
  flex-direction: column-reverse;
  gap: 1rem;
  margin-top: 1rem;
  background-color: #ffffff;
  padding: 1rem;
  border-radius: 8px;
  max-width: 800px;
  margin: auto;
  font-family: Georgia, "Times New Roman", Times, serif;
}

.message {
  padding: 0.5rem;
  border-bottom: 1px solid #ddd;
}

.sender {
  color: #333;
  font-weight: bold;
  padding-bottom: 0em;
  font-size: large;
}

.content {
  color: #555;
  margin: 0.25rem 0;
  padding-top: 0em;
}

.timestamp {
  font-size: 10px;
  color: #888;
  text-align: right;
  margin-top: 4px;
}
</style>
