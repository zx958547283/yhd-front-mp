import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import store from './store'  


import util from "./common/utils/utility";
import config from "./common/config/config.js";

// #ifdef H5
// import VConsole from 'vconsole/dist/vconsole.min.js' //import vconsole
// const vConsole = new VConsole() // 初始化
// #endif

Vue.prototype.util = util;
Vue.prototype.config = config;

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App,
	store
})
app.$mount()
