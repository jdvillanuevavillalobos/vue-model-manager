// examples/04-vue-integration/template-basic.ts
// 📄 Vue Template Binding - Basic Usage with useModels

import { createApp, defineComponent } from 'vue'
import { createModelManager, setComposableScope, useModels } from '../../src'

console.log('📄 Vue Template Binding - Basic Usage')

const app = createApp(defineComponent({
  name: 'BasicTemplateExample',
  template: `
    <div class="container">
      <h1>{{ app.title }}</h1>
      <ui5-input v-model="user.name" placeholder="Your name..." />
      <ui5-input v-model="user.email" placeholder="Your email..." />
      <p>Welcome, {{ user.name }}! Your email is {{ user.email }}.</p>
    </div>
  `,
  setup() {
    // Crear el manager y setear el scope
    const manager = createModelManager('vue-template-demo')
    setComposableScope('vue-template-demo')

    manager.create('user', {
      name: 'David',
      email: 'david@zeus.com'
    })

    manager.create('app', {
      title: 'Zeus Vue Model Manager - Template Demo'
    })

    // Acceso reactivo usando useModels
    const { user, app } = useModels(['user', 'app'])

    return { user, app }
  }
}))

app.mount('#app')
