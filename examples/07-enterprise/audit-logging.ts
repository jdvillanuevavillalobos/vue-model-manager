// examples/07-enterprise/audit-logging.ts
// 🎯 Audit Logging - Enterprise Feature Demo

import {
  createModelManager,
  setComposableScope,
  useModel,
  GlobalRegistry,
  dumpGlobalState,
} from '../../src/index'

console.log('🔐 Audit Logging - Enterprise Feature')
console.log('='.repeat(50))

try {
  // 1. Habilitar auditoría globalmente
  console.log('🔹 Enabling global auditing...')
  GlobalRegistry.enableAuditing(true)

  // 2. Crear manager con auditoría activada
  const manager = createModelManager('audit-demo', {
    audit: { enabled: true },
    security: { level: 'enterprise' }
  })

  setComposableScope('audit-demo')

  console.log('✅ ModelManager created with audit enabled')

  // 3. Crear un modelo con datos sensibles
  const profileModel = manager.create('profile', {
    name: 'Ana Torres',
    email: 'ana.torres@zeus.com',
    role: 'Admin',
    lastLogin: new Date().toISOString()
  })

  console.log('📄 Initial model:', profileModel.getData())

  // 4. Modificar propiedades observables
  const userName = useModel<string>('profile', '/name')
  const userRole = useModel<string>('profile', '/role')

  userName.value = 'Ana M. Torres'
  userRole.value = 'Super Admin'

  console.log('📝 Updated name:', userName.value)
  console.log('📝 Updated role:', userRole.value)

  // 5. Exportar modelo para auditoría externa
  const exported = profileModel.toJSON()
  console.log('📤 Exported model JSON:', exported)

  // 6. Dump de estado global para revisión
  dumpGlobalState()

  // 7. Simular acceso entre scopes con logging
  const secondaryManager = createModelManager('secondary-scope', {
    audit: { enabled: true }
  })

  GlobalRegistry.shareModel('audit-demo', 'secondary-scope', 'profile', 'profileCopy')

  const copied = GlobalRegistry.getModelFromScope('secondary-scope', 'audit-demo', 'profile')
  console.log('🔄 Copied model accessed:', copied?.getData())

  console.log('\n✅ Audit Logging Demo Complete')

} catch (err) {
  console.error('❌ Audit Logging Example Failed:', err)
}
