import { createApp } from 'vue'
import App from './App.vue'
import 'normalize.css'

// router
import { registerRouter } from './router'

const app = createApp(App)
registerRouter(app)
app.mount('#app')
