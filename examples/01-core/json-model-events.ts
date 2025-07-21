// 📡 JsonModel - Event System
// Purpose: Demonstrates event handling and reactive updates
// Run: npm run demo:core:events

import { JsonModel } from '../../src/core/JsonModel'

console.log('📡 JsonModel - Event System')
console.log('=' .repeat(35))
console.log('🎯 This shows reactive event handling capabilities\n')

try {
    console.log('🔹 1. Creating model with event logging')
    
    const model = new JsonModel({
        user: {
            name: 'David Rodriguez',
            status: 'offline',
            lastSeen: null
        },
        notifications: {
            count: 0,
            items: []
        },
        app: {
            theme: 'light',
            language: 'en'
        }
    }, {
        enableLogging: true
    })
    
    console.log('   ✅ Model created with event capabilities')
    
    console.log('\n🔹 2. Setting up event listeners')
    
    // Property change events
    model.on('property-changed', (event) => {
        console.log(`   📡 Property Changed: ${event.path}`)
        console.log(`      Old: ${JSON.stringify(event.oldValue)}`)
        console.log(`      New: ${JSON.stringify(event.newValue)}`)
        console.log(`      Source: ${event.source}`)
        console.log(`      Timestamp: ${new Date(event.timestamp).toLocaleTimeString()}`)
    })
    
    // Array change events
    model.on('array-changed', (event) => {
        console.log(`   📡 Array Changed: ${event.path}`)
        console.log(`      Action: ${event.action}`)
        if (event.index !== undefined) {
            console.log(`      Index: ${event.index}`)
        }
        if (event.item) {
            console.log(`      Item: ${JSON.stringify(event.item)}`)
        }
    })
    
    // Validation error events
    model.on('validation-error', (event) => {
        console.log(`   📡 Validation Error: ${event.path}`)
        console.log(`      Errors: ${event.errors.join(', ')}`)
    })
    
    // Model reset events
    model.on('model-reset', (event) => {
        console.log(`   📡 Model Reset at: ${new Date(event.timestamp).toLocaleTimeString()}`)
    })
    
    console.log('   🎧 Event listeners configured')
    
    console.log('\n🔹 3. Triggering property change events')
    
    console.log('\n   🔄 Changing user status...')
    model.setProperty('/user/status', 'online')
    
    console.log('\n   🔄 Updating user name...')
    model.setProperty('/user/name', 'David Rodriguez Silva')
    
    console.log('\n   🔄 Setting last seen time...')
    model.setProperty('/user/lastSeen', new Date().toISOString())
    
    console.log('\n   🔄 Changing app theme...')
    model.setProperty('/app/theme', 'dark')
    
    console.log('\n🔹 4. Triggering array change events')
    
    console.log('\n   📋 Adding notifications...')
    model.addToArray('/notifications/items', {
        id: 1,
        title: 'Welcome back!',
        type: 'info',
        read: false
    })
    
    model.addToArray('/notifications/items', {
        id: 2,
        title: 'New message received',
        type: 'message',
        read: false
    })
    
    // Update notification count
    model.setProperty('/notifications/count', model.getArrayLength('/notifications/items'))
    
    console.log('\n   📋 Updating array item...')
    model.updateArrayItem(
        '/notifications/items',
        item => item.id === 1,
        { read: true, readAt: new Date().toISOString() }
    )
    
    console.log('\n   📋 Removing array item...')
    model.removeFromArray('/notifications/items', 1)
    
    // Update notification count
    model.setProperty('/notifications/count', model.getArrayLength('/notifications/items'))
    
    console.log('\n🔹 5. Testing validation events')
    
    // Add validator to trigger validation events
    model.addValidator('/user/name', {
        validate: (value) => typeof value === 'string' && value.length > 0,
        message: 'Name cannot be empty'
    })
    
    console.log('\n   ❌ Setting invalid name (empty)...')
    model.setProperty('/user/name', '')  // Should trigger validation error
    
    console.log('\n   ✅ Fixing name...')
    model.setProperty('/user/name', 'David Rodriguez')  // Should work fine
    
    console.log('\n🔹 6. Testing model reset event')
    
    console.log('\n   🔄 Resetting model...')
    model.reset()
    
    console.log('\n🔹 7. Event listener management')
    
    // Create a specific listener to remove
    const specificListener = (event: any) => {
        console.log(`   🎯 Specific listener triggered: ${event.path}`)
    }
    
    model.on('property-changed', specificListener)
    console.log('\n   🎧 Added specific listener')
    
    model.setProperty('/user/status', 'busy')  // Should trigger both listeners
    
    model.off('property-changed', specificListener)
    console.log('\n   🔇 Removed specific listener')
    
    model.setProperty('/user/status', 'available')  // Should trigger only original listener
    
    console.log('\n🔹 8. Event system statistics')
    
    const metadata = model.getMetadata()
    console.log(`   📊 Total changes: ${metadata.changeCount}`)
    console.log(`   📊 Last modified: ${metadata.lastModified.toLocaleTimeString()}`)
    console.log(`   📊 Model size: ${metadata.size} bytes`)
    
    console.log('\n✅ Event System - SUCCESS')
    console.log('🎯 Reactive events for real-time updates')
    
} catch (error) {
    console.error('\n❌ Event System - FAILED:', error)
}

console.log('\n📖 Next: npm run demo:core:serialization')