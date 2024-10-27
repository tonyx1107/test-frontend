<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const content = ref("");
const props = defineProps(["friend"]);
const emit = defineEmits(["refreshMessages"]);

const createMessage = async (content: string) => {
  try {
    await fetchy("/api/messages/send", "POST", {
      body: { content, recipient: props.friend },
    });
  } catch (_) {
    return;
  }
  emit("refreshMessages");
  emptyForm();
};

const emptyForm = () => {
  content.value = "";
};
</script>

<template>
  <form @submit.prevent="createMessage(content)">
    <label for="content">Message Contents:</label>
    <textarea id="content" v-model="content" placeholder="Message" required> </textarea>
    <button type="submit" class="pure-button-primary pure-button">Send</button>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}
</style>
