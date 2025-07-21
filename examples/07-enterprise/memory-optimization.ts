// examples/07-enterprise/memory-optimization.ts
// 💾 Memory Optimization - Enterprise Demo

import {
  createModelManager,
  setComposableScope,
  useModel,
  GlobalRegistry,
  dumpGlobalState
} from '../../src/index'

console.log('💾 Memory Optimization - Enterprise Demo')
console.log('='.repeat(50))

try {
  // 1. Crear manager con auditoría y seguridad para monitoreo
  const manager = createModelManager('memory-scope', {
    audit: { enabled: true },
    security: { level: 'enterprise' }
  })

  setComposableScope('memory-scope')

  // 2. Crear múltiples modelos con diferentes tamaños
  manager.create('session', {
    token: 'xyz1234567890',
    expiresAt: new Date(Date.now() + 3600 * 1000).toISOString()
  })

  manager.create('profile', {
    name: 'Carlos Díaz',
    role: 'User',
    email: 'carlos@zeus.com',
    avatar: '/avatars/carlos.jpg'
  })

  manager.create('logs', {
    entries: Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      action: 'access',
      timestamp: new Date().toISOString()
    }))
  })

  console.log('🧠 Model count before cleanup:', manager.getModelNames().length)

  // 3. Acceder a valores para simular uso
  const userName = useModel<string>('profile', '/name')
  console.log('👤 User name accessed via useModel:', userName.value)

  // 4. Eliminar modelo manualmente si ya no se necesita
  manager.removeModel('session')
  console.log('🧹 Removed model: session')

  // 5. Simular timeout de logs y limpiar modelo
  manager.removeModel('logs')
  console.log('🧹 Removed model: logs')

  // 6. Exportar y luego limpiar modelos (como snapshot)
  const backup = manager.exportModels()
  console.log('💾 Exported backup:', Object.keys(backup))

  manager.clear()
  console.log('🧽 Cleared all models from scope')

  // 7. Restaurar desde backup
  manager.importModels(backup)
  console.log('🔁 Imported models from backup')

  // 8. Dump final del estado para verificar optimización
  dumpGlobalState()

  console.log('\n✅ Memory Optimization Demo Complete')

} catch (error) {
  console.error('❌ Memory Optimization Demo Failed:', error)
}
