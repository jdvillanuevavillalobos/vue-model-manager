// 📋 JsonModel - Array Operations
// Purpose: Demonstrates array manipulation methods
// Run: npm run demo:core:arrays

import { JsonModel } from '../../src/core/JsonModel'

console.log('📋 JsonModel - Array Operations')
console.log('=' .repeat(40))
console.log('🎯 This shows array manipulation capabilities\n')

try {
    console.log('🔹 1. Creating model with arrays')
    
    const model = new JsonModel({
        notifications: {
            items: [
                { id: 1, title: 'Welcome to Zeus!', read: false, priority: 'low' },
                { id: 2, title: 'Update available', read: true, priority: 'medium' }
            ]
        },
        users: [
            { id: 1, name: 'David Rodriguez', role: 'Admin', active: true },
            { id: 2, name: 'Ana García', role: 'Developer', active: true },
            { id: 3, name: 'Carlos López', role: 'Designer', active: false }
        ],
        tags: ['enterprise', 'vue3', 'typescript']
    })
    
    console.log('   ✅ Model with arrays created')
    console.log('   📋 Initial notifications:', model.getArrayLength('/notifications/items'))
    console.log('   📋 Initial users:', model.getArrayLength('/users'))
    console.log('   📋 Initial tags:', model.getArrayLength('/tags'))
    
    console.log('\n🔹 2. Adding to arrays')
    
    // Add notification
    model.addToArray('/notifications/items', {
        id: 3,
        title: 'New feature released!',
        read: false,
        priority: 'high'
    })
    
    // Add user
    model.addToArray('/users', {
        id: 4,
        name: 'María Rodriguez',
        role: 'Product Manager',
        active: true
    })
    
    // Add tag
    model.addToArray('/tags', 'microfrontend')
    
    console.log('   ➕ Items added to arrays')
    console.log('   📋 Notifications after add:', model.getArrayLength('/notifications/items'))
    console.log('   📋 Users after add:', model.getArrayLength('/users'))
    console.log('   📋 Tags after add:', model.getArrayLength('/tags'))
    
    console.log('\n🔹 3. Updating array items')
    
    // Mark notification as read
    const notificationUpdated = model.updateArrayItem(
        '/notifications/items',
        item => item.id === 1,
        { read: true, readAt: new Date().toISOString() }
    )
    
    // Update user role
    const userUpdated = model.updateArrayItem(
        '/users',
        item => item.name === 'Ana García',
        { role: 'Senior Developer', lastUpdate: new Date().toISOString() }
    )
    
    console.log('   🔄 Notification updated:', notificationUpdated ? 'Success' : 'Failed')
    console.log('   🔄 User updated:', userUpdated ? 'Success' : 'Failed')
    
    console.log('\n🔹 4. Accessing array items by index')
    console.log('   📄 First notification:', JSON.stringify(model.getProperty('/notifications/items/0'), null, 2))
    console.log('   📄 Second user:', JSON.stringify(model.getProperty('/users/1'), null, 2))
    console.log('   📄 Last tag:', model.getProperty(`/tags/${model.getArrayLength('/tags') - 1}`))
    
    console.log('\n🔹 5. Removing from arrays')
    
    // Remove first notification
    model.removeFromArray('/notifications/items', 0)
    console.log('   ➖ Removed first notification')
    
    // Remove inactive user
    const inactiveUserIndex = (model.getProperty('/users') as any[])
        .findIndex(user => !user.active)
    if (inactiveUserIndex >= 0) {
        model.removeFromArray('/users', inactiveUserIndex)
        console.log('   ➖ Removed inactive user')
    }
    
    console.log('   📋 Final notifications:', model.getArrayLength('/notifications/items'))
    console.log('   📋 Final users:', model.getArrayLength('/users'))
    
    console.log('\n🔹 6. Array content verification')
    const finalNotifications = model.getProperty('/notifications/items') as any[]
    const finalUsers = model.getProperty('/users') as any[]
    const finalTags = model.getProperty('/tags') as any[]
    
    console.log('   📋 Final notifications:')
    finalNotifications.forEach((notif, index) => {
        console.log(`      ${index + 1}. ${notif.title} (${notif.read ? 'read' : 'unread'})`)
    })
    
    console.log('   📋 Final users:')
    finalUsers.forEach((user, index) => {
        console.log(`      ${index + 1}. ${user.name} - ${user.role}`)
    })
    
    console.log('   📋 Final tags:', finalTags.join(', '))
    
    console.log('\n✅ Array Operations - SUCCESS')
    
} catch (error) {
    console.error('\n❌ Array Operations - FAILED:', error)
}

console.log('\n📖 Next: npm run demo:core:validation')