// examples/06-microfrontend/scope-isolation.ts
// 🛡️ Scope Isolation and Security
// Purpose: Demonstrates how model scopes prevent unintended access
// Run: npm run demo:microfrontend:scope

import {
  createModelManager,
  setComposableScope,
  useModel,
  configureComposables,
  getModelFromMicrofrontend
} from '../../src/index'

console.log('🛡️ Scope Isolation and Security Demo')
console.log('='.repeat(50))

try {
  console.log('🔹 1. Setting up two isolated scopes')

  const managerA = createModelManager('module-a', {
    security: { level: 'standard' },
    audit: { enabled: true }
  })

  managerA.create('user', {
    profile: {
      name: 'Alice',
      email: 'alice@zeus.com'
    }
  })

  const managerB = createModelManager('module-b', {
    security: { level: 'standard' },
    audit: { enabled: true }
  })

  managerB.create('settings', {
    theme: 'dark',
    language: 'en'
  })

  console.log('   ✅ Scopes "module-a" and "module-b" created')

  console.log('\n🔹 2. Switching to module-a scope and accessing model')

  setComposableScope('module-a')
  const userName = useModel<string>('user', '/profile/name')
  console.log('   👤 user.name (module-a):', userName.value)

  console.log('\n🔹 3. Switching to module-b scope and trying to access user model')

  setComposableScope('module-b')
  configureComposables({ fallbackToGlobalSearch: false }) // disable auto-fallback

  try {
    const invalidAccess = useModel<string>('user', '/profile/name')
    console.log('   ❌ Should not access user model:', invalidAccess.value)
  } catch (e) {
    console.log('   ✅ Access denied as expected (user model not in scope)')
  }

  console.log('\n🔹 4. Optional: Access explicitly via cross-scope method')

  const crossScopeModel = getModelFromMicrofrontend('module-b', 'module-a', 'user')
  if (crossScopeModel) {
    console.log('   🎯 Cross-scope model data:', crossScopeModel.getData())
  } else {
    console.log('   ⚠️ Cross-scope access returned undefined')
  }

  console.log('\n✅ Scope Isolation Demo - SUCCESS')
} catch (error) {
  console.error('❌ Scope Isolation Demo - FAILED:', error)
}
