<script setup lang="ts">
import CommentComponent from "@/components/Comment/CommentComponent.vue";
import CreateCommentForm from "@/components/Comment/CreateCommentForm.vue";
import EditCommentForm from "@/components/Comment/EditCommentForm.vue";

import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useRoute } from "vue-router";

const currentRoute = useRoute();
const { isLoggedIn } = storeToRefs(useUserStore());
const props = defineProps(["root"]);
const loaded = ref(false);
let comments = ref<Array<Record<string, string>>>([]);
let editing = ref("");

async function getCommentsByRoot(rootId: string) {
  let query: Record<string, string> = { root: rootId };
  let commentResults;
  try {
    commentResults = await fetchy("/api/discussion/root", "GET", { query });
  } catch (_) {
    return;
  }
  comments.value = commentResults;
}

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  await getCommentsByRoot(props.root._id);
  loaded.value = true;
});
</script>

<template>
  <section v-if="isLoggedIn && props.root._id == currentRoute.params.id" style="padding-bottom: 1em">
    <CreateCommentForm :root="props.root" @refreshComments="getCommentsByRoot(props.root._id)" />
  </section>
  <section class="comments" v-if="loaded && comments.length !== 0">
    <article v-for="comment in comments" :key="comment._id">
      <CommentComponent v-if="editing !== comment._id" :comment="comment" @refreshComments="getCommentsByRoot(props.root._id)" @editComment="updateEditing" />
      <EditCommentForm v-else :comment="comment" @refreshComments="getCommentsByRoot(props.root._id)" @editComment="updateEditing" />
    </article>
  </section>
  <p v-else-if="loaded && props.root._id == currentRoute.params.id">No comments yet.</p>
  <p v-else-if="!loaded">Loading...</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
  padding-bottom: 0;
}
</style>
