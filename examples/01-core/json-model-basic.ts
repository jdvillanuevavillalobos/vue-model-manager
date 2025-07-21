// 📚 JsonModel - Basic Creation and Usage
// Purpose: Demonstrates fundamental JsonModel operations
// Run: npm run demo:core:basic

import { JsonModel } from '../../src/core/JsonModel'

console.log('📚 JsonModel - Basic Creation and Usage')
console.log('=' .repeat(50))
console.log('🎯 This shows the fundamental JsonModel operations\n')

try {
    console.log('🔹 1. Creating a JsonModel')
    
    const model = new JsonModel({
        name: 'David Rodriguez',
        role: 'Senior Developer',
        active: true,
        score: 95
    })
    
    console.log('   ✅ JsonModel created successfully')
    
    console.log('\n🔹 2. Reading properties')
    console.log('   📄 Name:', model.getProperty('/name'))
    console.log('   📄 Role:', model.getProperty('/role'))
    console.log('   📄 Active:', model.getProperty('/active'))
    console.log('   📄 Score:', model.getProperty('/score'))
    
    console.log('\n🔹 3. Updating properties')
    model.setProperty('/name', 'David Rodriguez Silva')
    model.setProperty('/role', 'Technical Lead')
    model.setProperty('/score', 98)
    
    console.log('   ✅ Properties updated')
    console.log('   📄 Updated name:', model.getProperty('/name'))
    console.log('   📄 Updated role:', model.getProperty('/role'))
    console.log('   📄 Updated score:', model.getProperty('/score'))
    
    console.log('\n🔹 4. Getting complete data')
    const data = model.getData()
    console.log('   📊 Complete data:', JSON.stringify(data, null, 2))
    
    console.log('\n✅ JsonModel Basic Operations - SUCCESS')
    
} catch (error) {
    console.error('\n❌ JsonModel Basic Operations - FAILED:', error)
}

console.log('\n📖 Next: npm run demo:core:paths')