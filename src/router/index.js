import Vue from "vue";
import Router from "vue-router";
import routes from "./routers";
import { formatRouters } from "@/libs/util";

Vue.use(Router);
let BASE_URL = "";
const router = new Router({
  base: BASE_URL,
  routes: routes,
  mode: "hash"
});
// 存放加载的动态路由
// let dyncRouters = [];
// dyncRouters = dyncRouters.concat(
//   ...formatRouters(store.state.user.menus, store.state.user.access)
// );
// 防止重复添加路由报错
// router.addRoutes(dyncRouters);
// routes.push(...dyncRouters);
// router.beforeEach((to, from, next) => {});

// router.afterEach(to => {
//   window.scrollTo(0, 0);
// });

export default router;
