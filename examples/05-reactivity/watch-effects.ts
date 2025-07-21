// 🎯 Watch Effects - Side Effects with watch()
// Purpose: Demonstrates using watch with Zeus models for side effects
// Run: npm run demo:reactivity:watch

import { createModelManager, setComposableScope, useModel } from '../../src/index'
import { watch } from 'vue'

console.log('🎯 Watch Effects - Side Effects with watch()')
console.log('='.repeat(45))

// Setup
const manager = createModelManager('watch-effects', {
  security: { level: 'standard' },
  audit: { enabled: true }
})
setComposableScope('watch-effects')

manager.create('user', {
  profile: {
    name: 'David',
    email: 'david@zeus.com',
    status: 'offline'
  },
  preferences: {
    theme: 'sap_horizon',
    language: 'en'
  }
})

// ComputedRefs
const userStatus = useModel<string>('user', '/profile/status')
const userTheme = useModel<string>('user', '/preferences/theme')

// 🧠 Side effect: trigger API call or analytics when status changes
watch(userStatus, (newStatus, oldStatus) => {
  console.log(`🔁 Status changed from ${oldStatus} to ${newStatus}`)
  if (newStatus === 'online') {
    console.log('✅ Usuario conectado - iniciar actualización de UI y servicios')
  }
})

// 💾 Side effect: persist theme to localStorage
watch(userTheme, (newTheme) => {
  // ✅ Uso seguro con fallback para evitar errores TS2345
  const themeToSave = newTheme ?? 'sap_horizon'
  console.log(`🎨 Guardando tema preferido: ${themeToSave}`)
  localStorage.setItem('preferred-theme', themeToSave)
})

// Simulación de cambios
userStatus.value = 'online'
userTheme.value = 'sap_fiori_3_dark'

console.log('✅ Watch effects configurados con éxito')
