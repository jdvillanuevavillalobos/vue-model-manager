// 🌍 Global Registry - Inspection and Monitoring
// Purpose: Demonstrates GlobalRegistry capabilities
// Run: npm run demo:microfrontend:registry

import {
  createModelManager,
  GlobalRegistry,
  getGlobalStatistics
} from '../../src/index'

console.log('🌍 Global Registry - Inspection & Monitoring')
console.log('='.repeat(50))

// 🧱 Crear varios managers con distintos scopes
const mfHeader = createModelManager('mf-header', { audit: { enabled: true } })
const mfUsers = createModelManager('mf-users')
const mfDashboard = createModelManager('mf-dashboard')

// 🧩 Agregar modelos en cada scope
mfHeader.create('theme', {
  current: 'sap_horizon',
  contrast: 'normal'
})

mfUsers.create('profile', {
  name: 'Carlos Perez',
  email: 'carlos@empresa.com',
  avatar: '/avatars/carlos.jpg'
})

mfDashboard.create('widgets', {
  active: 5,
  total: 12
})

// 📊 Obtener estadísticas globales
const stats = getGlobalStatistics()
console.log('📊 Estadísticas globales:', stats)

/*
{
  registry: {
    totalManagers: 3,
    totalModels: 3,
    scopes: ['mf-header', 'mf-users', 'mf-dashboard']
  },
  managers: {
    'mf-header': { modelCount: 1, totalSize: 128 },
    ...
  }
}
*/

// 🔍 Inspeccionar estado de un scope específico
const headerScope = GlobalRegistry.inspectScope('mf-header')
console.log('🔍 mf-header scope:', headerScope)

// 🔎 Verificar existencia de un modelo
const hasProfileInUsers = GlobalRegistry.hasModel('mf-users', 'profile')
console.log(`✅ ¿mf-users tiene modelo "profile"?`, hasProfileInUsers)

// 🧼 Eliminar un modelo desde GlobalRegistry
GlobalRegistry.removeModel('mf-dashboard', 'widgets')
console.log('❌ Modelo "widgets" eliminado de mf-dashboard')

// 📉 Dump completo para depuración
console.log('\n🧾 Estado completo del registry (dump):')
GlobalRegistry.dumpState()

console.log('\n✅ Global registry demo finalizada')
