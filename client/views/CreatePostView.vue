<script setup lang="ts">
import { onBeforeMount, onBeforeUpdate, ref } from "vue";
import { useRoute } from "vue-router";
import CommentComponent from "../components/Comment/CommentComponent.vue";
import CommentListComponent from "../components/Comment/CommentListComponent.vue";
import PostComponent from "../components/Post/PostComponent.vue";
import { fetchy } from "../utils/fetchy";
</script>
