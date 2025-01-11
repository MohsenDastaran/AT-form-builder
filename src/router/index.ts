import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Forms from "../views/Forms.vue";
import CreateForm from "../views/CreateForm.vue";
import { useAuthStore } from "@/store/authStore";
import { enuStorageKey, storage } from "@/composables/useStorage";
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "forms",
      component: Forms,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "login",
      component: Login,
    },
    {
      path: "/register",
      name: "register",
      component: Register,
    },
    {
      path: "/create-form",
      name: "create-form",
      component: CreateForm,
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to, _from, next) => {
  if (to.meta.requiresAuth) {
    const authStore = useAuthStore();
    const access = storage.get(enuStorageKey.accessToken);
    const refresh = storage.get(enuStorageKey.refreshToken);
    const assumedToBeValid =
      authStore.decodeJWT(access as string) &&
      authStore.decodeJWT(refresh as string);
    if (assumedToBeValid) {
      next();
    } else {
      next("/login");
    }
  } else {
    next();
  }
});

export default router;
