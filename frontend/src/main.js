import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from "vuetify";
import { aliases, md } from 'vuetify/iconsets/md'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import Tres from "@tresjs/core";

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
  }
});

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(Tres)

app.mount('#app')

