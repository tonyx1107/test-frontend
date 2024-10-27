import { storeToRefs } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

import { useUserStore } from "@/stores/user";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import SettingView from "../views/SettingView.vue";
import CommentsView from "../views/CommentsView.vue";
import CreatePostView from "../views/CreatePostView.vue";
import FollowsView from "../views/FollowsView.vue";
import FriendsListComponent from "../components/Following/FriendsListComponent.vue";
import MessageComponent from "../components/Messaging/MessageComponent.vue";
import VerificationRequestForm from "../components/Verification/VerificationRequestForm.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/setting",
      name: "Settings",
      component: SettingView,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
      meta: { requiresAuth: false },
      beforeEnter: (to, from) => {
        const { isLoggedIn } = storeToRefs(useUserStore());
        if (isLoggedIn.value) {
          return { name: "Settings" };
        }
      },
    },
    {
      path: "/comments/:id",
      name: "Comments",
      component: CommentsView,
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: NotFoundView,
    },
    {
      path: "/post",
      name: "CreatePost",
      component: CreatePostView,
    },
    {
      path: "/followers/:username",
      name: "Followers",
      component: FollowsView,
    },
    {
      path: "/following/:username",
      name: "Following",
      component: FollowsView,
    },
    {
      path: "/friends",
      name: "Friends",
      component: FriendsListComponent,
    },
    {
      path: "/messages/:friend",
      name: "Messages",
      component: MessageComponent,
    },
    {
      path: "/verification/",
      name: "Verification",
      component: VerificationRequestForm,
    },
  ],
});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from) => {
  const { isLoggedIn } = storeToRefs(useUserStore());

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: "Login" };
  }
});

export default router;
