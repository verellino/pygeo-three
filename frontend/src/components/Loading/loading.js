import Vue from 'vue'
import loading from './loading.vue'

let loadingConstructor = Vue.extend(loading)
let instance = null

export default {
	open(options = {}) {
		if (!instance) {
			instance = new loadingConstructor({el: document.createElement('div')})
		}
    if (instance.visible) return;
    instance.text = typeof options === 'string' ? options : options.text;
    document.body.appendChild(instance.$el)
    Vue.nextTick(() => {
      instance.visible = true
    })
	},
	close() {
		if (instance) {
			instance.visible = false
		}
	}
}