// 🎯 useModel - Single Property Access
// Purpose: Demonstrates useModel composable for individual properties
// Run: npm run demo:composables:single

// ✅ CORREGIDO: Importar TODO desde index principal
import { 
  createModelManager, 
  setComposableScope, 
  configureComposables,
  useModel, 
  useModelFromScope, 
  useModelWithDefault 
} from '../../src/index'

console.log('🎯 useModel - Single Property Access')
console.log('=' .repeat(45))
console.log('🎯 This shows useModel for individual property access\n')

try {
    console.log('🔹 1. Setting up test environment')
    
    // Create manager and register it globally
    const manager = createModelManager('composables-demo', {
        security: { level: 'standard' },
        audit: { enabled: true }
    })
    
    // Set composable scope for automatic discovery
    setComposableScope('composables-demo')
    
    const userModel = manager.create('user', {
        profile: {
            name: 'David Rodriguez',
            email: 'david@zeus.com',
            avatar: '/assets/avatars/david.jpg',
            bio: 'Senior Developer specializing in Vue.js',
            initials: 'DR'
        },
        preferences: {
            theme: 'sap_horizon',
            language: 'en',
            timezone: 'America/Los_Angeles',
            notifications: {
                email: true,
                push: false,
                desktop: true
            }
        },
        stats: {
            loginCount: 142,
            lastLogin: new Date().toISOString(),
            projectCount: 8
        }
    })
    
    const appModel = manager.create('app', {
        info: {
            name: 'Zeus Identity Platform',
            version: '3.0.0',
            build: 'b2024.03.15.001',
            environment: 'development'
        },
        config: {
            debug: true,
            apiUrl: 'https://api.zeus.com',
            timeout: 30000
        },
        features: {
            sso: true,
            mfa: false,
            audit: true,
            analytics: false
        }
    })
    
    console.log('   ✅ Test environment setup complete')
    console.log('   📊 Created models:', manager.getModelNames())
    console.log('   📍 Composable scope set to:', 'composables-demo')
    
    console.log('\n🔹 2. Basic useModel usage')
    
    // ✅ CORREGIDO: Agregar tipos explícitos para evitar 'never'
    const userName = useModel<string>('user', '/profile/name')
    const userEmail = useModel<string>('user', '/profile/email')
    const userTheme = useModel<string>('user', '/preferences/theme')
    const loginCount = useModel<number>('user', '/stats/loginCount')
    
    console.log('   📄 useModel ComputedRef values:')
    console.log('      userName.value:', userName.value)
    console.log('      userEmail.value:', userEmail.value)
    console.log('      userTheme.value:', userTheme.value)
    console.log('      loginCount.value:', loginCount.value)
    
    console.log('\n🔹 3. App model properties')
    
    const appName = useModel<string>('app', '/info/name')
    const appVersion = useModel<string>('app', '/info/version')
    const debugMode = useModel<boolean>('app', '/config/debug')
    const apiUrl = useModel<string>('app', '/config/apiUrl')
    
    console.log('   📄 App model ComputedRef values:')
    console.log('      appName.value:', appName.value)
    console.log('      appVersion.value:', appVersion.value)
    console.log('      debugMode.value:', debugMode.value)
    console.log('      apiUrl.value:', apiUrl.value)
    
    console.log('\n🔹 4. Deep nested property access')
    
    const emailNotifications = useModel<boolean>('user', '/preferences/notifications/email')
    const pushNotifications = useModel<boolean>('user', '/preferences/notifications/push')
    const ssoFeature = useModel<boolean>('app', '/features/sso')
    const mfaFeature = useModel<boolean>('app', '/features/mfa')
    
    console.log('   📄 Deep nested ComputedRef values:')
    console.log('      emailNotifications.value:', emailNotifications.value)
    console.log('      pushNotifications.value:', pushNotifications.value)
    console.log('      ssoFeature.value:', ssoFeature.value)
    console.log('      mfaFeature.value:', mfaFeature.value)
    
    console.log('\n🔹 5. Reactive updates via ComputedRef setter')
    
    console.log('   🔄 Original values:')
    console.log('      userName.value:', userName.value)
    console.log('      userTheme.value:', userTheme.value)
    console.log('      debugMode.value:', debugMode.value)
    
    // Update via ComputedRef setter
    userName.value = 'David Rodriguez Silva'
    userTheme.value = 'sap_fiori_3_dark'
    debugMode.value = false
    
    console.log('\n   🔄 After ComputedRef updates:')
    console.log('      userName.value:', userName.value)
    console.log('      userTheme.value:', userTheme.value)
    console.log('      debugMode.value:', debugMode.value)
    
    // Verify updates in original model
    console.log('\n   ✅ Verification in original model:')
    console.log('      Model userName:', userModel.getProperty('/profile/name'))
    console.log('      Model userTheme:', userModel.getProperty('/preferences/theme'))
    console.log('      Model debugMode:', appModel.getProperty('/config/debug'))
    
    console.log('\n🔹 6. useModel with default values')
    
    console.log('   🎯 Testing useModelWithDefault:')
    
    // Use default values for potentially missing properties
    const userRole = useModelWithDefault<string>('user', '/profile/role', 'Developer')
    const appTimeout = useModelWithDefault<number>('app', '/config/timeout', 30000)
    const nonExistentProperty = useModelWithDefault<string>('user', '/nonexistent/path', 'Default Value')
    
    console.log('      userRole (with default):', userRole.value)
    console.log('      appTimeout (existing):', appTimeout.value)
    console.log('      nonExistentProperty (default):', nonExistentProperty.value)
    
    // Set a property that didn't exist
    userRole.value = 'Senior Developer'
    console.log('      userRole after update:', userRole.value)
    console.log('      Model now has role:', userModel.getProperty('/profile/role'))
    
    console.log('\n🔹 7. Cross-scope access simulation')
    
    // Create another scope for testing
    const anotherManager = createModelManager('another-scope', {
        security: { level: 'basic' },
        audit: { enabled: false }
    })
    
    anotherManager.create('settings', {
        global: {
            theme: 'corporate',
            language: 'es',
            timezone: 'Europe/Madrid'
        }
    })
    
    console.log('   🌍 Created another scope: another-scope')
    
    // Access from specific scope
    const globalTheme = useModelFromScope<string>('another-scope', 'settings', '/global/theme')
    const globalLanguage = useModelFromScope<string>('another-scope', 'settings', '/global/language')
    
    console.log('   🔄 Cross-scope access:')
    console.log('      globalTheme.value:', globalTheme.value)
    console.log('      globalLanguage.value:', globalLanguage.value)
    
    // Update cross-scope
    globalTheme.value = 'modern'
    console.log('      Updated globalTheme:', globalTheme.value)
    
    console.log('\n🔹 8. Array element access')
    
    // Add some array data for testing
    userModel.setProperty('/projects', [
        { id: 1, name: 'Zeus Core', status: 'active' },
        { id: 2, name: 'Mobile App', status: 'planning' },
        { id: 3, name: 'Analytics', status: 'completed' }
    ])
    
    const firstProject = useModel<string>('user', '/projects/0/name')
    const secondProjectStatus = useModel<string>('user', '/projects/1/status')
    const projectCount = useModel<number>('user', '/projects/length')
    
    console.log('   📋 Array element access:')
    console.log('      First project name:', firstProject.value)
    console.log('      Second project status:', secondProjectStatus.value)
    console.log('      Project count:', projectCount.value)
    
    // Update array elements
    firstProject.value = 'Zeus Core Platform'
    secondProjectStatus.value = 'in-progress'
    
    console.log('\n   📋 After array element updates:')
    console.log('      Updated first project:', firstProject.value)
    console.log('      Updated second status:', secondProjectStatus.value)
    
    console.log('\n🔹 9. Error handling and edge cases')
    
    console.log('   🔍 Testing error handling:')
    
    const nonexistentModel = useModel<string>('nonexistent-model', '/some/path')
    const invalidPath = useModel<string>('user', '/invalid/deep/path/that/does/not/exist')
    
    console.log('      Nonexistent model value:', nonexistentModel.value)
    console.log('      Invalid path value:', invalidPath.value)
    
    // Try to update nonexistent
    nonexistentModel.value = 'This should not work'
    console.log('      Nonexistent model after update attempt:', nonexistentModel.value)
    
    console.log('\n🔹 10. Number and boolean operations')
    
    const currentLoginCount = useModel<number>('user', '/stats/loginCount')
    const currentProjectCount = useModel<number>('user', '/stats/projectCount')
    
    console.log('   🔢 Number operations:')
    console.log('      Original login count:', currentLoginCount.value)
    console.log('      Original project count:', currentProjectCount.value)
    
    // Increment operations
    if (typeof currentLoginCount.value === 'number') {
        currentLoginCount.value = currentLoginCount.value + 1
    }
    if (typeof currentProjectCount.value === 'number') {
        currentProjectCount.value = currentProjectCount.value + 2
    }
    
    console.log('      After increment:')
    console.log('      New login count:', currentLoginCount.value)
    console.log('      New project count:', currentProjectCount.value)
    
    // Boolean toggle
    const emailEnabled = useModel<boolean>('user', '/preferences/notifications/email')
    const mfaEnabled = useModel<boolean>('app', '/features/mfa')
    
    console.log('\n   ✅ Boolean operations:')
    console.log('      Original email enabled:', emailEnabled.value)
    console.log('      Original MFA enabled:', mfaEnabled.value)
    
    // Toggle booleans
    if (typeof emailEnabled.value === 'boolean') {
        emailEnabled.value = !emailEnabled.value
    }
    if (typeof mfaEnabled.value === 'boolean') {
        mfaEnabled.value = !mfaEnabled.value
    }
    
    console.log('      After toggle:')
    console.log('      Email enabled:', emailEnabled.value)
    console.log('      MFA enabled:', mfaEnabled.value)
    
    console.log('\n🔹 11. Multiple ComputedRefs to same property')
    
    // Create multiple refs to the same property
    const nameRef1 = useModel<string>('user', '/profile/name')
    const nameRef2 = useModel<string>('user', '/profile/name')
    const nameRef3 = useModel<string>('user', '/profile/name')
    
    console.log('   🔗 Multiple refs to same property:')
    console.log('      nameRef1.value:', nameRef1.value)
    console.log('      nameRef2.value:', nameRef2.value)
    console.log('      nameRef3.value:', nameRef3.value)
    
    // Update via one ref
    nameRef1.value = 'David R. Silva (Updated via ref1)'
    
    console.log('\n   🔗 After updating via nameRef1:')
    console.log('      nameRef1.value:', nameRef1.value)
    console.log('      nameRef2.value:', nameRef2.value)
    console.log('      nameRef3.value:', nameRef3.value)
    console.log('      All refs synchronized:', 
        nameRef1.value === nameRef2.value && nameRef2.value === nameRef3.value)
    
    console.log('\n🔹 12. Configuration and context management')
    
    console.log('   ⚙️ Testing configuration:')
    
    // Disable fallback search for performance
    configureComposables({ fallbackToGlobalSearch: false })
    console.log('      Disabled fallback search for performance')
    
    // This should still work because we're in the correct scope
    const stillWorks = useModel<string>('user', '/profile/email')
    console.log('      Still works in current scope:', stillWorks.value)
    
    // Re-enable for other tests
    configureComposables({ fallbackToGlobalSearch: true })
    console.log('      Re-enabled fallback search')
    
    console.log('\n🔹 13. Vue 3 template usage examples')
    
    console.log('\n   📝 Vue Template Usage Examples:')
    console.log(`
<!-- Basic property binding -->
<template>
  <div>
    <h1>{{ userName }}</h1>
    <p>{{ userEmail }}</p>
    <span class="theme-{{ userTheme }}">Current theme</span>
  </div>
</template>

<script setup>
import { useModel, setComposableScope } from '@zeus/vue-model-manager'

// Setup scope once per microfrontend
setComposableScope('my-scope')

// These create reactive ComputedRefs - automatically use current scope
const userName = useModel<string>('user', '/profile/name')
const userEmail = useModel<string>('user', '/profile/email')
const userTheme = useModel<string>('user', '/preferences/theme')
</script>`)
    
    console.log('\n   📝 Form Input Binding:')
    console.log(`
<!-- Two-way binding with v-model -->
<template>
  <form>
    <ui5-input 
      v-model="userName" 
      label="Name"
    />
    <ui5-input 
      v-model="userEmail" 
      label="Email"
      type="Email"
    />
    <ui5-switch 
      v-model="emailNotifications"
      text="Email Notifications"
    />
  </form>
</template>

<script setup>
// Direct binding - changes update model automatically
const userName = useModel<string>('user', '/profile/name')
const userEmail = useModel<string>('user', '/profile/email')
const emailNotifications = useModel<boolean>('user', '/preferences/notifications/email')
</script>`)
    
    console.log('\n🔹 14. Performance testing')
    
    console.log('\n   ⚡ Performance Test: Multiple ComputedRef creation')
    
    // Performance test: creating many ComputedRefs
    const performanceStart = performance.now()
    
    // ✅ CORREGIDO: Tipar explícitamente el array
    const perfRefs: Array<ReturnType<typeof useModel>> = []
    for (let i = 0; i < 100; i++) {
        // Alternate between different properties
        const properties = [
            '/profile/name',
            '/profile/email',
            '/preferences/theme',
            '/stats/loginCount',
            '/info/version'
        ]
        const prop = properties[i % properties.length]
        const model = i % 2 === 0 ? 'user' : 'app'
        
        perfRefs.push(useModel<any>(model, prop))  // ✅ CORREGIDO: Agregar tipo explícito
    }
    
    const creationTime = performance.now() - performanceStart
    
    console.log(`      Created 100 ComputedRefs in: ${creationTime.toFixed(2)}ms`)
    console.log(`      Average per ComputedRef: ${(creationTime / 100).toFixed(2)}ms`)
    
    // Test access performance
    const accessStart = performance.now()
    
    for (let i = 0; i < 100; i++) {
        const value = perfRefs[i]?.value // ✅ CORREGIDO: Agregar optional chaining
    }
    
    const accessTime = performance.now() - accessStart
    
    console.log(`      Accessed 100 values in: ${accessTime.toFixed(2)}ms`)
    console.log(`      Average per access: ${(accessTime / 100).toFixed(2)}ms`)
    
    // Test update performance
    const updateStart = performance.now()
    
    const testValue = useModel<number>('user', '/stats/loginCount')
    for (let i = 0; i < 100; i++) {
        if (typeof testValue.value === 'number') {
            testValue.value = 1000 + i
        }
    }
    
    const updateTime = performance.now() - updateStart
    
    console.log(`      100 updates in: ${updateTime.toFixed(2)}ms`)
    console.log(`      Average per update: ${(updateTime / 100).toFixed(2)}ms`)
    
    console.log('\n✅ useModel Single Property Access - SUCCESS')
    console.log('🎯 Perfect for individual property binding in Vue templates')
    console.log('💡 Features demonstrated:')
    console.log('   - Basic reactive ComputedRef access with getter/setter')
    console.log('   - Cross-scope model access')
    console.log('   - Default value handling')
    console.log('   - Array element access')
    console.log('   - Error handling and edge cases')
    console.log('   - Performance optimizations')
    console.log('   - Context and configuration management')
    console.log('   - Enterprise-grade architecture')
    console.log('   - Type-safe operations with explicit TypeScript types')
    
} catch (error) {
    console.error('\n❌ useModel Single Property Access - FAILED:', error)
}

console.log('\n📖 Next: npm run demo:composables:multiple')