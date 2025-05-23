import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import locale from 'element-plus/es/locale/lang/zh-cn'
import router from './router';
import { createPinia } from 'pinia'
import 'element-plus/dist/index.css'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()
app.use(ElementPlus, { locale });
app.use(pinia)
app.use(router);
app.mount('#app')

