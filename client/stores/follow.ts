import { fetchy } from "@/utils/fetchy";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useFollowsStore = defineStore(
  "follows",
  () => {
    const follows = ref<Array<Record<string, string>>>([]);

    const getFollows = async () => {
      try {
        const followResults = await fetchy("/api/follow/", "GET", { alert: false });
        follows.value = followResults;
      } catch (_) {
        return;
      }
    };

    return {
      follows,
      getFollows,
    };
  },
  { persist: true },
);
