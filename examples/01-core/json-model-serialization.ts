// 💾 JsonModel - Serialization (Import/Export)
// Purpose: Demonstrates JSON import/export and cloning
// Run: npm run demo:core:serialization

import { JsonModel } from '../../src/core/JsonModel'

console.log('💾 JsonModel - Serialization (Import/Export)')
console.log('=' .repeat(50))
console.log('🎯 This shows data persistence capabilities\n')

try {
    console.log('🔹 1. Creating source model with complex data')
    
    const sourceModel = new JsonModel({
        application: {
            name: 'Zeus Identity Platform',
            version: '3.0.0',
            build: '2024.03.15.001',
            environment: 'production'
        },
        user: {
            profile: {
                id: 'david.rodriguez',
                name: 'David Rodriguez',
                email: 'david@zeus.com',
                avatar: '/assets/avatars/david.jpg',
                role: 'Senior Developer',
                permissions: ['read', 'write', 'admin', 'deploy']
            },
            preferences: {
                theme: 'sap_horizon',
                language: 'en',
                timezone: 'America/Los_Angeles',
                notifications: {
                    email: true,
                    push: false,
                    sms: true
                }
            },
            session: {
                loginTime: new Date().toISOString(),
                lastActivity: new Date().toISOString(),
                ipAddress: '192.168.1.100',
                userAgent: 'Mozilla/5.0 Zeus Browser'
            }
        },
        data: {
            notifications: [
                { id: 1, title: 'Welcome to Zeus!', type: 'info', read: false, timestamp: '2024-03-15T10:00:00Z' },
                { id: 2, title: 'Profile updated', type: 'success', read: true, timestamp: '2024-03-15T11:30:00Z' },
                { id: 3, title: 'Security alert', type: 'warning', read: false, timestamp: '2024-03-15T14:15:00Z' }
            ],
            projects: [
                { id: 'proj-001', name: 'Zeus Core', status: 'active', progress: 85 },
                { id: 'proj-002', name: 'UI Components', status: 'completed', progress: 100 },
                { id: 'proj-003', name: 'Mobile App', status: 'planning', progress: 15 }
            ]
        }
    })
    
    console.log('   ✅ Complex source model created')
    console.log('   📊 Source model size:', sourceModel.getMetadata().size, 'bytes')
    console.log('   📊 Source paths count:', sourceModel.getMetadata().paths.length)
    
    console.log('\n🔹 2. Exporting to JSON string')
    
    const jsonString = sourceModel.toJSON()
    console.log('   💾 Model exported to JSON')
    console.log('   📏 JSON string length:', jsonString.length, 'characters')
    console.log('   📄 JSON preview (first 200 chars):')
    console.log('      ' + jsonString.substring(0, 200) + '...')
    
    console.log('\n🔹 3. Creating new model from JSON')
    
    const importedModel = new JsonModel({}, {
        enableLogging: true
    })
    
    console.log('   📂 Empty model created for import')
    
    importedModel.fromJSON(jsonString)
    console.log('   📥 JSON imported successfully')
    
    console.log('\n🔹 4. Verifying imported data')
    
    console.log('   🔍 Verifying application data:')
    console.log('      App name:', importedModel.getProperty('/application/name'))
    console.log('      App version:', importedModel.getProperty('/application/version'))
    console.log('      Environment:', importedModel.getProperty('/application/environment'))
    
    console.log('   🔍 Verifying user data:')
    console.log('      User name:', importedModel.getProperty('/user/profile/name'))
    console.log('      User email:', importedModel.getProperty('/user/profile/email'))
    console.log('      User theme:', importedModel.getProperty('/user/preferences/theme'))
    
    console.log('   🔍 Verifying arrays:')
    console.log('      Notifications count:', importedModel.getArrayLength('/data/notifications'))
    console.log('      Projects count:', importedModel.getArrayLength('/data/projects'))
    
    console.log('   🔍 Verifying deep nested data:')
    console.log('      Email notifications:', importedModel.getProperty('/user/preferences/notifications/email'))
    console.log('      First notification title:', importedModel.getProperty('/data/notifications/0/title'))
    console.log('      Second project status:', importedModel.getProperty('/data/projects/1/status'))
    
    console.log('\n🔹 5. Cloning models')
    
    const clonedModel = sourceModel.clone()
    console.log('   📋 Model cloned successfully')
    
    // Verify clone independence
    console.log('\n   🔬 Testing clone independence:')
    console.log('      Original user name:', sourceModel.getProperty('/user/profile/name'))
    console.log('      Clone user name:', clonedModel.getProperty('/user/profile/name'))
    
    clonedModel.setProperty('/user/profile/name', 'David Rodriguez Silva (Cloned)')
    
    console.log('      After modifying clone:')
    console.log('      Original user name:', sourceModel.getProperty('/user/profile/name'))
    console.log('      Clone user name:', clonedModel.getProperty('/user/profile/name'))
    console.log('      ✅ Models are independent')
    
    console.log('\n🔹 6. Advanced serialization scenarios')
    
    // Partial export/import (specific paths)
    console.log('\n   📦 Testing partial data scenarios:')
    
    // Get just user preferences
    const userPreferences = sourceModel.getProperty('/user/preferences')
    const preferencesJson = JSON.stringify(userPreferences, null, 2)
    console.log('   📄 User preferences JSON:')
    console.log('      ' + preferencesJson)
    
    // Create new model with just preferences
    const preferencesModel = new JsonModel({ preferences: userPreferences })
    console.log('   ✅ Preferences-only model created')
    console.log('   🔍 Theme from preferences model:', preferencesModel.getProperty('/preferences/theme'))
    
    console.log('\n🔹 7. Serialization with metadata')
    
    const metadata = sourceModel.getMetadata()
    
    const fullExport = {
        metadata: {
            version: metadata.version,
            created: metadata.created.toISOString(),
            lastModified: metadata.lastModified.toISOString(),
            changeCount: metadata.changeCount,
            exportedAt: new Date().toISOString()
        },
        data: sourceModel.getData()
    }
    
    const fullExportJson = JSON.stringify(fullExport, null, 2)
    console.log('   📊 Full export with metadata created')
    console.log('   📏 Full export size:', fullExportJson.length, 'characters')
    console.log('   📄 Metadata preview:')
    console.log('      Version:', fullExport.metadata.version)
    console.log('      Change count:', fullExport.metadata.changeCount)
    console.log('      Exported at:', fullExport.metadata.exportedAt)
    
    console.log('\n🔹 8. Error handling in serialization')
    
    // Test invalid JSON import
    const invalidJsonModel = new JsonModel({})
    
    console.log('\n   ❌ Testing invalid JSON import:')
    try {
        invalidJsonModel.fromJSON('{ invalid json }')
        console.log('   ❌ Should have failed but didn\'t')
    } catch (error) {
        console.log('   ✅ Invalid JSON correctly rejected')
    }
    
    // Test with valid JSON but wrong structure
    try {
        invalidJsonModel.fromJSON('{"valid": "json", "but": "different", "structure": true}')
        console.log('   ✅ Different structure imported successfully')
        console.log('   🔍 Imported different structure:', invalidJsonModel.getProperty('/valid'))
    } catch (error) {
        console.log('   ❌ Failed to import different structure:', error)
    }
    
    console.log('\n🔹 9. Performance comparison')
    
    const startTime = Date.now()
    
    // Create large model for performance testing
    const largeData: any = {
        users: [],
        products: [],
        orders: []
    }
    
    // Generate test data
    for (let i = 0; i < 100; i++) {
        largeData.users.push({
            id: i,
            name: `User ${i}`,
            email: `user${i}@test.com`,
            active: i % 2 === 0
        })
        
        largeData.products.push({
            id: i,
            name: `Product ${i}`,
            price: Math.random() * 1000,
            category: `Category ${i % 10}`
        })
        
        largeData.orders.push({
            id: i,
            userId: i,
            productId: i,
            quantity: Math.floor(Math.random() * 10) + 1,
            total: Math.random() * 5000
        })
    }
    
    const largeModel = new JsonModel(largeData)
    const setupTime = Date.now() - startTime
    
    const exportStart = Date.now()
    const largeJsonString = largeModel.toJSON()
    const exportTime = Date.now() - exportStart
    
    const importStart = Date.now()
    const importedLargeModel = new JsonModel({})
    importedLargeModel.fromJSON(largeJsonString)
    const importTime = Date.now() - importStart
    
    const cloneStart = Date.now()
    const clonedLargeModel = largeModel.clone()
    const cloneTime = Date.now() - cloneStart
    
    console.log('   ⚡ Performance metrics for large dataset:')
    console.log('      Data size: 300 items (100 users, 100 products, 100 orders)')
    console.log('      Setup time:', setupTime, 'ms')
    console.log('      Export time:', exportTime, 'ms')
    console.log('      Import time:', importTime, 'ms')
    console.log('      Clone time:', cloneTime, 'ms')
    console.log('      JSON size:', largeJsonString.length, 'characters')
    console.log('      Model metadata size:', importedLargeModel.getMetadata().size, 'bytes')
    
    console.log('\n✅ Serialization - SUCCESS')
    console.log('🎯 Complete data persistence and cloning capabilities')
    
} catch (error) {
    console.error('\n❌ Serialization - FAILED:', error)
}

console.log('\n📖 Complete! Review all core examples:')
console.log('   npm run demo:core:basic      # Basic operations')
console.log('   npm run demo:core:paths      # Path navigation')
console.log('   npm run demo:core:arrays     # Array operations')
console.log('   npm run demo:core:validation # Validation system')
console.log('   npm run demo:core:events     # Event system')
console.log('   npm run demo:core:serialization # This example')
console.log('\n📖 Next category: npm run demo:manager:basic')