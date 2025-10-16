import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "./assets/css/styles.css";
import "./assets/js/scripts.js";
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'flatpickr/dist/flatpickr.min.css'
import registerGlobalComponents from './globalComponents'

const app = createApp(App)
registerGlobalComponents(app)
app.use(router)
app.mount('#app')
