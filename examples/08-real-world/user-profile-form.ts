// examples/08-real-world/user-profile-form.ts
// 👤 Real-World Example: User Profile Form

import { createModelManager, setComposableScope, useModels } from '../../src/index'

console.log('👤 User Profile Form - Real Example')
console.log('='.repeat(50))

try {
  // 1. Crear modelos necesarios
  const manager = createModelManager('profile-form', {
    audit: { enabled: true },
    security: { level: 'enterprise' }
  })

  setComposableScope('profile-form')

  manager.create('user', {
    profile: {
      name: 'Ana Gonzales',
      email: 'ana@zeus.com',
      phone: '+51 999 888 777',
      address: {
        street: 'Calle Fiori 123',
        city: 'Lima',
        country: 'Perú'
      },
      job: {
        title: 'Ingeniera de Software',
        department: 'TI'
      }
    },
    settings: {
      language: 'es',
      timezone: 'America/Lima',
      notifications: {
        email: true,
        sms: false
      }
    }
  })

  console.log('✅ User model created and registered')

  // 2. Obtener el modelo reactivo
  const { user } = useModels(['user'])

  console.log('🔹 Datos del usuario cargados:')
  console.log('   Nombre:', user.profile.name)
  console.log('   Email:', user.profile.email)
  console.log('   Ciudad:', user.profile.address.city)

  // 3. Template sugerido
  console.log('\n📄 Suggested <template> for Vue component:')
  console.log(`
<template>
  <ui5-panel header-text="Perfil de Usuario">
    <ui5-form>
      <ui5-form-group header-text="Datos Personales">
        <ui5-input v-model="user.profile.name" label="Nombre completo" />
        <ui5-input v-model="user.profile.email" label="Correo electrónico" type="Email" />
        <ui5-input v-model="user.profile.phone" label="Teléfono" />
      </ui5-form-group>

      <ui5-form-group header-text="Dirección">
        <ui5-input v-model="user.profile.address.street" label="Dirección" />
        <ui5-input v-model="user.profile.address.city" label="Ciudad" />
        <ui5-input v-model="user.profile.address.country" label="País" />
      </ui5-form-group>

      <ui5-form-group header-text="Trabajo">
        <ui5-input v-model="user.profile.job.title" label="Cargo" />
        <ui5-input v-model="user.profile.job.department" label="Departamento" />
      </ui5-form-group>

      <ui5-form-group header-text="Configuración">
        <ui5-select v-model="user.settings.language" label="Idioma">
          <ui5-option value="es">Español</ui5-option>
          <ui5-option value="en">Inglés</ui5-option>
        </ui5-select>
        <ui5-select v-model="user.settings.timezone" label="Zona Horaria">
          <ui5-option value="America/Lima">Lima</ui5-option>
          <ui5-option value="America/Bogota">Bogotá</ui5-option>
        </ui5-select>
        <ui5-switch v-model="user.settings.notifications.email" text="Notificaciones por correo" />
        <ui5-switch v-model="user.settings.notifications.sms" text="Notificaciones por SMS" />
      </ui5-form-group>
    </ui5-form>
  </ui5-panel>
</template>

<script setup>
import { useModels, setComposableScope } from '@zeus/vue-model-manager'

setComposableScope('profile-form')
const { user } = useModels(['user'])
</script>
`)

  console.log('\n✅ Formulario completo listo para producción')

} catch (error) {
  console.error('❌ Error en user-profile-form:', error)
}
