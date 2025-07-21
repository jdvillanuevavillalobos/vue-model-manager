// 🛠️ Zeus Vue Model Manager - Setup to Usage Example

import {
  createModelManager,
  setComposableScope,
  useModel,
  useModels
} from '../../src/index'

console.log('🛠️ Setup to Usage Example')

try {
  console.log('\n🔹 1. Setup: Create Manager + Scope')
  const manager = createModelManager('setup-demo', {
    audit: { enabled: true },
    security: { level: 'standard' }
  })

  setComposableScope('setup-demo')
  console.log('✅ Scope set: setup-demo')

  console.log('\n🔹 2. Define Models')
  manager.create('user', {
    profile: {
      name: 'Ana Mendoza',
      email: 'ana@empresa.com',
      avatar: '/assets/ana.png'
    },
    preferences: {
      language: 'es',
      theme: 'sap_horizon'
    }
  })

  manager.create('system', {
    appName: 'Gestión ZEUS',
    version: '1.2.5',
    env: 'producción'
  })

  console.log('✅ Models created: user, system')

  console.log('\n🔹 3. Access via useModel')
  const userName = useModel<string>('user', '/profile/name')
  const systemVersion = useModel<string>('system', '/version')

  console.log('🧠 userName:', userName.value)
  console.log('🧠 systemVersion:', systemVersion.value)

  console.log('\n🔹 4. Update model properties reactively')
  userName.value = 'Ana M. González'
  systemVersion.value = '1.3.0'

  console.log('✅ Updated userName:', userName.value)
  console.log('✅ Updated version:', systemVersion.value)

  console.log('\n🔹 5. Access via useModels (magic proxy)')
  const { user, system } = useModels(['user', 'system'])

  console.log('✨ user.profile.email:', user.profile.email)
  console.log('✨ system.appName:', system.appName)

  console.log('\n✅ Complete setup-to-usage flow succeeded')
} catch (err) {
  console.error('❌ Setup to Usage failed:', err)
}
