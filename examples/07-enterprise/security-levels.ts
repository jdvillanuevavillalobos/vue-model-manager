// examples/07-enterprise/security-levels.ts
// 🔐 Security Levels - Enterprise Demo

import {
  createModelManager,
  setComposableScope,
  configureComposables,
  useModel
} from '../../src/index'

console.log('🔐 Security Levels - Enterprise Demo')
console.log('='.repeat(50))

try {
  // 1. Basic level - No validation, no logging
  const basicManager = createModelManager('scope-basic', {
    security: { level: 'basic' },
    audit: { enabled: false }
  })
  setComposableScope('scope-basic')
  basicManager.create('settings', { theme: 'light', timeout: 3000 })
  console.log('🟢 Basic level created (no validation or audit)')

  // 2. Standard level - Validation enabled, no logging
  const standardManager = createModelManager('scope-standard', {
    security: { level: 'standard' },
    audit: { enabled: false }
  })
  standardManager.create('settings', { theme: 'dark', timeout: 5000 })
  console.log('🟡 Standard level created (validation enabled)')

  // 3. Enterprise level - Full validation + audit logging
  const enterpriseManager = createModelManager('scope-enterprise', {
    security: { level: 'enterprise' },
    audit: { enabled: true }
  })
  enterpriseManager.create('settings', { theme: 'corporate', timeout: 8000 })
  console.log('🔴 Enterprise level created (validation + audit enabled)')

  // 4. Access and modify values under enterprise scope
  setComposableScope('scope-enterprise')
  const themeRef = useModel<string>('settings', '/theme')
  const timeoutRef = useModel<number>('settings', '/timeout')

  console.log('   📄 Theme:', themeRef.value)
  console.log('   ⏱ Timeout:', timeoutRef.value)

  // Update to trigger audit
  themeRef.value = 'enterprise-dark'
  timeoutRef.value = 10000

  console.log('   ✅ Updates done. Check audit logs.')

} catch (error) {
  console.error('❌ Security Levels Demo Failed:', error)
}
