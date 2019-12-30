import Vue from 'vue'
import VueResource from 'vue-resource'
import {Howl, Howler} from 'howler';
import Velocity from 'velocity-animate'
import App from './application.vue'

Vue.use(VueResource);

new Vue({
    render: h => h(App)
}).$mount('#app')