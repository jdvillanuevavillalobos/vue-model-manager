// examples/09-migration/from-pinia.ts
// 🔄 Migración desde Pinia a Zeus Vue Model Manager

// Ejemplo referencial (sin ejecutar Pinia)
// const defineStore = () => {} // Dummy solo para evitar TS error
import { createModelManager, setComposableScope, useModels } from '../../src'

console.log('🔄 Migración desde Pinia → Zeus Vue Model Manager')
console.log('='.repeat(60))

// 📦 Estado inicial
const userData = {
  profile: {
    name: 'Ana Gutiérrez',
    email: 'ana@empresa.com',
    role: 'Diseñadora'
  },
  preferences: {
    theme: 'sap_horizon',
    notifications: true
  }
}

// ✅ Pinia - Store clásica
console.log('\n📘 Pinia - Store tradicional:')
console.log(`
export const useUserStore = defineStore('user', {
  state: () => ({
    profile: {
      name: 'Ana Gutiérrez',
      email: 'ana@empresa.com',
      role: 'Diseñadora'
    },
    preferences: {
      theme: 'sap_horizon',
      notifications: true
    }
  }),
  actions: {
    updateName(newName) {
      this.profile.name = newName
    }
  }
})
`)

// ✅ Zeus - Modelo equivalente
console.log('\n📗 Zeus Vue Model Manager - Alternativa con useModels')

const manager = createModelManager('pinia-migration')
manager.create('user', userData)

setComposableScope('pinia-migration')

const { user } = useModels(['user'])

console.log('   🧠 user.profile.name:', user.profile.name)
console.log('   🧠 user.preferences.theme:', user.preferences.theme)

console.log('\n🔁 Modificando el modelo directamente')

user.profile.name = 'Ana G. León'
user.preferences.theme = 'sap_fiori_3'

console.log('   ✅ Nuevo nombre:', user.profile.name)
console.log('   ✅ Nuevo tema:', user.preferences.theme)

console.log('\n📄 Ejemplo en template equivalente a Pinia:')
console.log(`
<template>
  <div>
    <ui5-input v-model="user.profile.name" label="Nombre" />
    <ui5-select v-model="user.preferences.theme" label="Tema">
      <ui5-option value="sap_horizon">Horizon</ui5-option>
      <ui5-option value="sap_fiori_3">Fiori 3</ui5-option>
    </ui5-select>
  </div>
</template>

<script setup>
import { useModels, setComposableScope } from '@zeus/vue-model-manager'

setComposableScope('pinia-migration')
const { user } = useModels(['user'])
</script>
`)

console.log('\n🎯 Resultado: Menos boilerplate, más integración con Vue 3, sin necesidad de definir `actions`, `getters` o `state` manualmente')
