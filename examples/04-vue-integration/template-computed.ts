// examples/04-vue-integration/template-computed.ts
// 📊 Computed Properties with useModels - Derived Values

import { createApp, defineComponent, computed } from 'vue'
import { createModelManager, setComposableScope, useModels } from '../../src'

console.log('📊 Vue Template with Computed Properties')

const app = createApp(defineComponent({
  name: 'ComputedTemplateExample',
  template: `
    <div>
      <h1>{{ userFullName }}</h1>
      <p>{{ userDepartment }}</p>

      <ui5-input v-model="user.profile.firstName" placeholder="First name" />
      <ui5-input v-model="user.profile.lastName" placeholder="Last name" />

      <ui5-select v-model="user.profile.department">
        <ui5-option value="Engineering">Engineering</ui5-option>
        <ui5-option value="Design">Design</ui5-option>
        <ui5-option value="Marketing">Marketing</ui5-option>
      </ui5-select>

      <div>
        <strong>Summary:</strong> {{ summary }}
      </div>
    </div>
  `,
  setup() {
    const manager = createModelManager('template-computed')
    setComposableScope('template-computed')

    manager.create('user', {
      profile: {
        firstName: 'David',
        lastName: 'Rodriguez',
        department: 'Engineering'
      }
    })

    const { user } = useModels(['user'])

    const userFullName = computed(() => 
      `${user.profile.firstName} ${user.profile.lastName}`
    )

    const userDepartment = computed(() => 
      `Department: ${user.profile.department}`
    )

    const summary = computed(() => 
      `${userFullName.value} works in ${user.profile.department}`
    )

    return {
      user,
      userFullName,
      userDepartment,
      summary
    }
  }
}))

app.mount('#app')
