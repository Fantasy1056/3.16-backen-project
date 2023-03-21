import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/css/global.css'
import BreadCrumb from '@/components/BreadCrumb.vue'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
const app = createApp(App)
app.component('BreadCrumb', BreadCrumb)

app.use(router).use(VueQuillEditor).mount('#app')
