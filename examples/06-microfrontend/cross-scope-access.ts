// 🌐 Cross-Scope Access - Access models across microfrontends
// Purpose: Demonstrates getModelFromMicrofrontend()
// Run: npm run demo:microfrontend:access

import {
  createModelManager,
  getModelFromMicrofrontend,
  shareModelBetweenMicrofrontends
} from '../../src/index'

console.log('🌐 Cross-Scope Access - Microfrontend Model Access')
console.log('='.repeat(50))

// 📦 Crear managers para microfrontends separados
const headerMF = createModelManager('mf-header', {
  audit: { enabled: true }
})

const usersMF = createModelManager('mf-users', {
  audit: { enabled: true }
})

// 🧑‍💼 Crear modelo en usersMF
usersMF.create('profile', {
  name: 'Ana García',
  email: 'ana@empresa.com',
  role: 'Admin',
  avatar: '/avatars/ana.jpg'
})

// 🎨 Crear modelo en headerMF
headerMF.create('theme', {
  current: 'sap_horizon',
  available: ['sap_horizon', 'sap_fiori_3', 'sap_fiori_3_dark']
})

// 🔄 Compartir modelo de tema entre MFs
shareModelBetweenMicrofrontends('mf-header', 'mf-users', 'theme', 'sharedTheme')
console.log('🔗 Modelo "theme" compartido de mf-header ➡ mf-users como "sharedTheme"')

// 📥 Acceder al modelo de perfil desde headerMF
const remoteProfile = getModelFromMicrofrontend('mf-header', 'mf-users', 'profile')
console.log('📄 remoteProfile?.getProperty("/name"):', remoteProfile?.getProperty('/name'))
console.log('📄 remoteProfile?.getProperty("/role"):', remoteProfile?.getProperty('/role'))

// ✅ Validar acceso
if (remoteProfile) {
  remoteProfile.setProperty('/role', 'Super Admin')
  console.log('✏️ Rol actualizado remotamente:', remoteProfile.getProperty('/role'))
} else {
  console.warn('⚠️ No se pudo acceder al modelo de perfil remoto')
}

// 📥 Acceder al modelo de tema compartido desde usersMF
const sharedThemeModel = usersMF.getModel('sharedTheme')
if (sharedThemeModel) {
  const current = sharedThemeModel.getProperty('/current')
  console.log('🎨 Tema compartido desde header:', current)

  // Cambiar el tema desde usersMF (cross-scope)
  sharedThemeModel.setProperty('/current', 'sap_fiori_3_dark')
  console.log('🎨 Tema actualizado remotamente desde usersMF')
}

console.log('\n✅ Cross-scope access demo finalizada con éxito')
