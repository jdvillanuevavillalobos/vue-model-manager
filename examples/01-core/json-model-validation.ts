// 🛡️ JsonModel - Validation System
// Purpose: Demonstrates validation rules and error handling
// Run: npm run demo:core:validation

import { JsonModel } from '../../src/core/JsonModel'

console.log('🛡️ JsonModel - Validation System')
console.log('=' .repeat(45))
console.log('🎯 This shows enterprise validation capabilities\n')

try {
    console.log('🔹 1. Creating model with validation enabled')
    
    const model = new JsonModel({
        user: {
            name: '',
            email: '',
            age: 0,
            role: '',
            password: ''
        },
        settings: {
            theme: '',
            language: ''
        }
    }, {
        enableValidation: true,
        enableLogging: true
    })
    
    console.log('   ✅ Model created with validation enabled')
    
    console.log('\n🔹 2. Adding validation rules')
    
    // Name validation
    model.addValidator('/user/name', {
        validate: (value) => typeof value === 'string' && value.length >= 2,
        message: 'Name must be at least 2 characters long'
    })
    
    // Email validation
    model.addValidator('/user/email', {
        validate: (value) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            return typeof value === 'string' && emailRegex.test(value)
        },
        message: 'Email must be a valid email address'
    })
    
    // Age validation
    model.addValidator('/user/age', {
        validate: (value) => typeof value === 'number' && value >= 18 && value <= 120,
        message: 'Age must be between 18 and 120 years'
    })
    
    // Role validation
    model.addValidator('/user/role', {
        validate: (value) => {
            const validRoles = ['Admin', 'Developer', 'Designer', 'Manager']
            return typeof value === 'string' && validRoles.includes(value)
        },
        message: 'Role must be one of: Admin, Developer, Designer, Manager'
    })
    
    // Password validation
    model.addValidator('/user/password', {
        validate: (value) => {
            return typeof value === 'string' && 
                   value.length >= 8 && 
                   /[A-Z]/.test(value) && 
                   /[a-z]/.test(value) && 
                   /\d/.test(value)
        },
        message: 'Password must be at least 8 characters with uppercase, lowercase, and number'
    })
    
    // Theme validation
    model.addValidator('/settings/theme', {
        validate: (value) => {
            const validThemes = ['sap_horizon', 'sap_fiori_3', 'sap_fiori_3_dark']
            return typeof value === 'string' && validThemes.includes(value)
        },
        message: 'Theme must be one of the supported SAP themes'
    })
    
    console.log('   ✅ Validation rules added for all fields')
    
    console.log('\n🔹 3. Testing invalid data')
    
    // Set invalid values
    model.setProperty('/user/name', 'A')  // Too short
    model.setProperty('/user/email', 'invalid-email')  // Invalid format
    model.setProperty('/user/age', 15)  // Too young
    model.setProperty('/user/role', 'InvalidRole')  // Not in allowed list
    model.setProperty('/user/password', '123')  // Too weak
    model.setProperty('/settings/theme', 'custom_theme')  // Not supported
    
    console.log('   ❌ Invalid values set (should trigger validation)')
    
    console.log('\n🔹 4. Checking validation results')
    
    console.log('   🔍 Individual field validation:')
    console.log('      Name valid:', model.validate('/user/name'))
    console.log('      Email valid:', model.validate('/user/email'))
    console.log('      Age valid:', model.validate('/user/age'))
    console.log('      Role valid:', model.validate('/user/role'))
    console.log('      Password valid:', model.validate('/user/password'))
    console.log('      Theme valid:', model.validate('/settings/theme'))
    
    console.log('\n   🔍 Overall model validation:', model.validate())
    
    console.log('\n🔹 5. Getting validation errors')
    
    console.log('   ❌ Validation errors:')
    console.log('      Name errors:', model.getErrors('/user/name'))
    console.log('      Email errors:', model.getErrors('/user/email'))
    console.log('      Age errors:', model.getErrors('/user/age'))
    console.log('      Role errors:', model.getErrors('/user/role'))
    console.log('      Password errors:', model.getErrors('/user/password'))
    console.log('      Theme errors:', model.getErrors('/settings/theme'))
    
    console.log('\n   ❌ All errors:', model.getErrors())
    
    console.log('\n🔹 6. Setting valid data')
    
    model.setProperty('/user/name', 'David Rodriguez')
    model.setProperty('/user/email', 'david@zeus.com')
    model.setProperty('/user/age', 30)
    model.setProperty('/user/role', 'Developer')
    model.setProperty('/user/password', 'SecurePass123')
    model.setProperty('/settings/theme', 'sap_horizon')
    
    console.log('   ✅ Valid values set')
    
    console.log('\n🔹 7. Re-checking validation')
    
    console.log('   ✅ Individual field validation:')
    console.log('      Name valid:', model.validate('/user/name'))
    console.log('      Email valid:', model.validate('/user/email'))
    console.log('      Age valid:', model.validate('/user/age'))
    console.log('      Role valid:', model.validate('/user/role'))
    console.log('      Password valid:', model.validate('/user/password'))
    console.log('      Theme valid:', model.validate('/settings/theme'))
    
    console.log('\n   ✅ Overall model validation:', model.validate())
    console.log('   ✅ No errors:', model.getErrors().length === 0)
    
    console.log('\n🔹 8. Removing validation rules')
    
    model.removeValidator('/user/password')
    console.log('   🗑️ Password validation removed')
    console.log('   🔍 Password validation after removal:', model.validate('/user/password'))
    
    console.log('\n✅ Validation System - SUCCESS')
    console.log('🎯 Enterprise-ready validation with custom rules')
    
} catch (error) {
    console.error('\n❌ Validation System - FAILED:', error)
}

console.log('\n📖 Next: npm run demo:core:events')