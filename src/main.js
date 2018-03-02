import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store/";
import _ from "lodash"; 
import 'babel-polyfill' 
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./assets/font/iconfont.css";
import "vue2-animate/dist/vue2-animate.min.css";

Vue.prototype._ = _;
Vue.config.productionTip = false;
Vue.config.keyCodes.f11 = 122;
Vue.use(ElementUI);

new Vue({
  el: "#app",
  router,
  store,
  template: "<App/>",
  components: { App }
});

