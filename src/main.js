import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import "./plugins/element.js";
import vueWaves from "@/directive/waves/index"; // 水波纹指令
import vueFocus from "@/directive/focus/index"; // 聚焦指令
import prototype from "@/common/js/prototype"; // 挂载在原型上的方法
Vue.config.productionTip = false;

Vue.use(vueWaves);
Vue.use(vueFocus);
Vue.use(prototype);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
