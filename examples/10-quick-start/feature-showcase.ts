// ✨ Zeus Vue Model Manager - Feature Showcase

import {
  createModelManager,
  setComposableScope,
  useModel,
  useModels,
  configureComposables,
  getGlobalStatistics,
  dumpGlobalState
} from '../../src/index'

console.log('✨ Zeus Vue Model Manager - Feature Showcase')

try {
  console.log('\n🔹 1. Create Model Manager')
  const manager = createModelManager('feature-showcase', {
    audit: { enabled: true },
    security: { level: 'enterprise' }
  })
  setComposableScope('feature-showcase')

  console.log('✅ Scope set: feature-showcase')

  console.log('\n🔹 2. Create Models')
  manager.create('user', {
    profile: {
      name: 'Luis Torres',
      email: 'luis@example.com',
      role: 'Admin'
    },
    settings: {
      theme: 'sap_fiori_3',
      notifications: true
    }
  })

  manager.create('app', {
    name: 'Zeus Platform',
    version: '3.1.0',
    features: {
      mfa: true,
      audit: true
    }
  })

  console.log('✅ Models created: user, app')

  console.log('\n🔹 3. Reactive Binding (useModel)')
  const userName = useModel<string>('user', '/profile/name')
  const appVersion = useModel<string>('app', '/version')

  console.log('   🧠 userName:', userName.value)
  console.log('   🧠 appVersion:', appVersion.value)

  console.log('\n🔹 4. Multi-model Proxy (useModels)')
  const { user, app } = useModels(['user', 'app'])

  console.log('   ✨ user.profile.email:', user.profile.email)
  console.log('   ✨ app.name:', app.name)

  console.log('\n🔹 5. Live Update Test')
  user.profile.name = 'Luis T.'
  app.version = '3.1.1'

  console.log('   ✅ Updated user name:', user.profile.name)
  console.log('   ✅ Updated app version:', app.version)

  console.log('\n🔹 6. Global Statistics')
  console.log(getGlobalStatistics())

  console.log('\n🔹 7. Configuration')
  configureComposables({ fallbackToGlobalSearch: false })

  console.log('\n🔹 8. Dump Full Registry State')
  dumpGlobalState()

  console.log('\n🎯 All features demonstrated successfully')
} catch (err) {
  console.error('❌ Feature showcase failed:', err)
}
