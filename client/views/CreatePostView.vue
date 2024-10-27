<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import CreatePostForm from "@/components/Post/CreatePostForm.vue";
// import CreateVideoForm from "@/components/Video/CreateVideoForm.vue";
// import CreateAudioForm from "@/components/Audio/CreateAudioForm.vue";
// import CreateShortForm from "@/components/Short/CreateShortForm.vue";

// Track the currently active form type

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const activeForm = ref<string | null>(null);

function openForm(formType: string) {
  activeForm.value = formType;
}

function closeForm() {
  activeForm.value = null;
}
</script>

<template>
  <section>
    <h1 v-if="!isLoggedIn">Please Login First!</h1>
  </section>
  <div>
    <!-- 
    <button @click="openForm('post')">Article</button>
    <button @click="openForm('video')">Video</button>
    <button @click="openForm('audio')">Audio</button> 
    -->
    <CreatePostForm :type="'Article'" />
    <div v-if="activeForm === 'video'">
      <CreateVideoForm />
      <head>
        <title>YouTube Embed</title>
      </head>
      <body>
        <iframe src="https://www.youtube.com/embed/kqEfk801E94" />
      </body>
      <button @click="closeForm">Close Form</button>
    </div>
    <div v-if="activeForm === 'audio'">
      <CreateAudioForm />
      <button @click="closeForm">Close Form</button>
    </div>
    <div v-if="activeForm === 'short'">
      <CreateShortForm />
      <button @click="closeForm">Close Form</button>
    </div>
  </div>
</template>

<style scoped>
button {
  margin: 0.5em;
}

h1 {
  padding-left: 1em;
  font-family: "Arial", serif;
}
</style>
