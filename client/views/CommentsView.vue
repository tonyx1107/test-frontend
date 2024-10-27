<script setup lang="ts">
import { onBeforeMount, onBeforeUpdate, ref } from "vue";
import { useRoute } from "vue-router";
import CommentComponent from "../components/Comment/CommentComponent.vue";
import CommentListComponent from "../components/Comment/CommentListComponent.vue";
import EditCommentForm from "@/components/Comment/EditCommentForm.vue";
import EditPostForm from "@/components/Post/EditPostForm.vue";
import PostComponent from "../components/Post/PostComponent.vue";
import { fetchy } from "../utils/fetchy";

const currentRoute = useRoute();

let loaded = ref(false);
let root = ref<Record<string, any> | null>(null);
let isPost = ref(false);
let editing = ref("");

async function getPostOrComment(id: string | string[]) {
  let result;
  try {
    result = await fetchy(`/api/posts/${id}`, "GET", { alert: false });
    isPost.value = true;
  } catch {
    try {
      result = await fetchy(`/api/discussion/${id}`, "GET", { alert: false });
      isPost.value = false;
    } catch (_) {
      root.value = null;
      return;
    }
  }
  root.value = result;
}

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  await getPostOrComment(currentRoute.params.id);
  loaded.value = true;
});

onBeforeUpdate(async () => {
  if (root.value && currentRoute.params.id !== root.value._id) {
    loaded.value = false;
    await getPostOrComment(currentRoute.params.id);
    loaded.value = true;
  }
});
</script>

<template>
  <section class="posts" v-if="loaded && root">
    <article v-if="isPost">
      <PostComponent v-if="editing !== root._id" :post="root" @refreshPosts="getPostOrComment" @editPost="updateEditing" />
      <EditPostForm v-else :post="root" @refreshPosts="getPostOrComment" @editPost="updateEditing" />
    </article>
    <article v-else>
      <CommentComponent v-if="editing !== root._id" :comment="root" @refreshComments="getPostOrComment" @editComment="updateEditing" />
      <EditCommentForm v-else :comment="root" @refreshComments="getPostOrComment" @editComment="updateEditing" />
    </article>
  </section>
  <p v-else-if="loaded">Post or comment not found.</p>
  <p v-else>Loading...</p>
  <div class="comments" v-if="loaded && root" style="padding-bottom: 1em">
    <CommentListComponent :root="root" />
  </div>
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
  max-width: 80em;
}
</style>
