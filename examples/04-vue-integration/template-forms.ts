// examples/04-vue-integration/template-forms.ts
// 📝 Form Binding with Validation using useModels

import { createApp, defineComponent, computed } from 'vue'
import { createModelManager, setComposableScope, useModels } from '../../src'

console.log('📝 Vue Template - Form Binding with Validation')

const app = createApp(defineComponent({
  name: 'FormTemplateExample',
  template: `
    <form @submit.prevent="submitForm">
      <ui5-input
        v-model="user.profile.name"
        placeholder="Nombre completo"
        :value-state="errors.name ? 'Error' : 'None'"
        :value-state-message="errors.name"
      />

      <ui5-input
        v-model="user.profile.email"
        placeholder="Correo electrónico"
        type="Email"
        :value-state="errors.email ? 'Error' : 'None'"
        :value-state-message="errors.email"
      />

      <ui5-input
        v-model="user.profile.phone"
        placeholder="Teléfono"
      />

      <ui5-button design="Emphasized" :disabled="!isValid" type="Submit">
        Guardar
      </ui5-button>
    </form>
  `,
  setup() {
    const manager = createModelManager('template-forms')
    setComposableScope('template-forms')

    const model = manager.create('user', {
      profile: {
        name: '',
        email: '',
        phone: ''
      }
    }, {
      enableValidation: true
    })

    // Agregar reglas de validación
    model.addValidator('/profile/name', {
      validate: v => typeof v === 'string' && v.trim().length >= 3,
      message: 'El nombre debe tener al menos 3 caracteres'
    })

    model.addValidator('/profile/email', {
      validate: v => typeof v === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: 'Email no es válido'
    })

    const { user } = useModels(['user'])

    const errors = computed(() => ({
      name: model.getErrors('/profile/name')[0],
      email: model.getErrors('/profile/email')[0]
    }))

    const isValid = computed(() => model.validate())

    const submitForm = () => {
      if (model.validate()) {
        console.log('✅ Formulario válido:', model.getData())
      } else {
        console.warn('❌ Errores en formulario:', model.getErrors())
      }
    }

    return {
      user,
      errors,
      isValid,
      submitForm
    }
  }
}))

app.mount('#app')
