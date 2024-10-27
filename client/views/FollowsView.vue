<script setup lang="ts">
import FollowListComponent from "@/components/Following/FollowListComponent.vue";
import { computed } from "vue";
import { useRoute } from "vue-router";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
</script>

<template>
  <section>
    <h2>{{ currentRouteName }} List</h2>
    <FollowListComponent :username="currentRoute.params.username" :type="currentRouteName" />
  </section>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 1em;
}

h2 {
  margin: auto;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}
</style>
