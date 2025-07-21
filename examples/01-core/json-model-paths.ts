// 📍 JsonModel - Path Navigation (OpenUI5 Style)
// Purpose: Demonstrates deep path access like OpenUI5 JsonModel
// Run: npm run demo:core:paths

import { JsonModel } from '../../src/core/JsonModel'

console.log('📍 JsonModel - Path Navigation (OpenUI5 Style)')
console.log('=' .repeat(55))
console.log('🎯 This shows OpenUI5-familiar path navigation\n')

try {
    console.log('🔹 1. Creating nested data structure')
    
    const model = new JsonModel({
        user: {
            profile: {
                name: 'David Rodriguez',
                contact: {
                    email: 'david@zeus.com',
                    phone: '+1-555-0123',
                    address: {
                        street: '123 Tech Street',
                        city: 'San Francisco',
                        country: 'USA'
                    }
                }
            },
            preferences: {
                theme: 'sap_horizon',
                language: 'en',
                notifications: {
                    email: true,
                    push: false,
                    sms: true
                }
            }
        },
        app: {
            version: '3.0.0',
            environment: 'production'
        }
    })
    
    console.log('   ✅ Nested structure created')
    
    console.log('\n🔹 2. Deep path reading (familiar OpenUI5 syntax)')
    console.log('   📄 User name:', model.getProperty('/user/profile/name'))
    console.log('   📄 Email:', model.getProperty('/user/profile/contact/email'))
    console.log('   📄 City:', model.getProperty('/user/profile/contact/address/city'))
    console.log('   📄 Theme:', model.getProperty('/user/preferences/theme'))
    console.log('   📄 Email notifications:', model.getProperty('/user/preferences/notifications/email'))
    console.log('   📄 App version:', model.getProperty('/app/version'))
    
    console.log('\n🔹 3. Deep path updates')
    model.setProperty('/user/profile/name', 'David Rodriguez Silva')
    model.setProperty('/user/profile/contact/email', 'david.rodriguez@zeus.com')
    model.setProperty('/user/profile/contact/address/city', 'Los Angeles')
    model.setProperty('/user/preferences/theme', 'sap_fiori_3_dark')
    model.setProperty('/app/version', '3.1.0')
    
    console.log('   ✅ Deep properties updated')
    
    console.log('\n🔹 4. Verifying updates')
    console.log('   📄 Updated name:', model.getProperty('/user/profile/name'))
    console.log('   📄 Updated email:', model.getProperty('/user/profile/contact/email'))
    console.log('   📄 Updated city:', model.getProperty('/user/profile/contact/address/city'))
    console.log('   📄 Updated theme:', model.getProperty('/user/preferences/theme'))
    console.log('   📄 Updated version:', model.getProperty('/app/version'))
    
    console.log('\n🔹 5. Path validation')
    console.log('   ❓ Nonexistent path:', model.getProperty('/user/nonexistent/path'))
    console.log('   ❓ Invalid deep path:', model.getProperty('/invalid/very/deep/path'))
    
    console.log('\n✅ Path Navigation - SUCCESS')
    console.log('🎯 Familiar OpenUI5 path syntax: /object/property/subproperty')
    
} catch (error) {
    console.error('\n❌ Path Navigation - FAILED:', error)
}

console.log('\n📖 Next: npm run demo:core:arrays')