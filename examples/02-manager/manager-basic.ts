// 🏗️ ModelManager - Basic Creation and Usage
// Purpose: Demonstrates fundamental ModelManager operations
// Run: npm run demo:manager:basic

import { createModelManager } from '../../src/index'

console.log('🏗️ ModelManager - Basic Creation and Usage')
console.log('=' .repeat(50))
console.log('🎯 This shows fundamental ModelManager operations\n')

try {
    console.log('🔹 1. Creating basic ModelManager')
    
    const manager = createModelManager('basic-demo')
    
    console.log('   ✅ ModelManager created with scope:', manager.getScope())
    console.log('   📊 Initial statistics:', JSON.stringify(manager.getStatistics(), null, 2))
    
    console.log('\n🔹 2. Creating models within manager')
    
    // Create user model
    const userModel = manager.create('user', {
        id: 'user-001',
        name: 'David Rodriguez',
        email: 'david@zeus.com',
        role: 'Senior Developer',
        active: true,
        profile: {
            avatar: '/assets/avatars/david.jpg',
            bio: 'Experienced developer specializing in Vue.js and enterprise solutions',
            social: {
                github: 'davidrod',
                linkedin: 'david-rodriguez-dev'
            }
        }
    })
    
    // Create application model
    const appModel = manager.create('app', {
        name: 'Zeus Identity Platform',
        version: '3.0.0',
        environment: 'development',
        features: {
            authentication: true,
            authorization: true,
            sso: true,
            mfa: false
        },
        config: {
            theme: 'sap_horizon',
            language: 'en',
            timezone: 'UTC'
        }
    })
    
    // Create settings model
    const settingsModel = manager.create('settings', {
        ui: {
            showSidebar: true,
            compactMode: false,
            animations: true
        },
        notifications: {
            email: true,
            push: false,
            desktop: true
        },
        privacy: {
            shareAnalytics: false,
            cookieConsent: true
        }
    })
    
    console.log('   ✅ Created 3 models: user, app, settings')
    console.log('   📋 Model names:', manager.getModelNames())
    
    console.log('\n🔹 3. Accessing models from manager')
    
    const retrievedUser = manager.getModel('user')
    const retrievedApp = manager.getModel('app')
    const retrievedSettings = manager.getModel('settings')
    
    console.log('   📄 User name:', retrievedUser?.getProperty('/name'))
    console.log('   📄 App name:', retrievedApp?.getProperty('/name'))
    console.log('   📄 UI compact mode:', retrievedSettings?.getProperty('/ui/compactMode'))
    
    console.log('\n🔹 4. Checking model existence')
    
    console.log('   🔍 Has user model:', manager.hasModel('user'))
    console.log('   🔍 Has app model:', manager.hasModel('app'))
    console.log('   🔍 Has nonexistent model:', manager.hasModel('nonexistent'))
    
    console.log('\n🔹 5. Working with model data')
    
    // Update user data
    userModel.setProperty('/name', 'David Rodriguez Silva')
    userModel.setProperty('/role', 'Technical Lead')
    userModel.setProperty('/profile/bio', 'Technical Lead with expertise in Vue.js, TypeScript, and enterprise architecture')
    
    // Update app config
    appModel.setProperty('/environment', 'production')
    appModel.setProperty('/features/mfa', true)
    appModel.setProperty('/config/theme', 'sap_fiori_3_dark')
    
    // Update settings
    settingsModel.setProperty('/ui/compactMode', true)
    settingsModel.setProperty('/notifications/push', true)
    
    console.log('   🔄 Models updated')
    console.log('   📄 Updated user name:', userModel.getProperty('/name'))
    console.log('   📄 Updated environment:', appModel.getProperty('/environment'))
    console.log('   📄 Updated compact mode:', settingsModel.getProperty('/ui/compactMode'))
    
    console.log('\n🔹 6. Manager statistics after updates')
    
    const stats = manager.getStatistics()
    console.log('   📊 Manager statistics:', JSON.stringify(stats, null, 2))
    
    console.log('\n🔹 7. Getting all models')
    
    const allModels = manager.getAllModels()
    console.log('   📋 All models available:', Object.keys(allModels))
    
    Object.entries(allModels).forEach(([name, model]) => {
        const metadata = model.getMetadata()
        console.log(`   📊 ${name} model:`)
        console.log(`      Changes: ${metadata.changeCount}`)
        console.log(`      Size: ${metadata.size} bytes`)
        console.log(`      Last modified: ${metadata.lastModified.toLocaleTimeString()}`)
    })
    
    console.log('\n🔹 8. Model lifecycle management')
    
    // Create temporary model
    const tempModel = manager.create('temp', {
        data: 'temporary data',
        timestamp: new Date().toISOString()
    })
    
    console.log('   ➕ Temporary model created')
    console.log('   📋 Models after temp creation:', manager.getModelNames())
    
    // Remove temporary model
    manager.removeModel('temp')
    console.log('   ➖ Temporary model removed')
    console.log('   📋 Models after temp removal:', manager.getModelNames())
    
    console.log('\n🔹 9. Manager configuration')
    
    const config = manager.getConfig()
    console.log('   ⚙️ Manager configuration:', JSON.stringify(config, null, 2))
    
    console.log('\n✅ ModelManager Basic Operations - SUCCESS')
    console.log('🎯 Foundation for scoped model management')
    
} catch (error) {
    console.error('\n❌ ModelManager Basic Operations - FAILED:', error)
}

console.log('\n📖 Next: npm run demo:manager:scoped')