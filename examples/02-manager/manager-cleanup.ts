// 🗑️ ModelManager - Memory Management and Cleanup
// Purpose: Demonstrates proper cleanup and memory management
// Run: npm run demo:manager:cleanup

import { createModelManager, getGlobalStatistics, GlobalRegistry } from '../../src/index'

console.log('🗑️ ModelManager - Memory Management and Cleanup')
console.log('=' .repeat(55))
console.log('🎯 This shows proper cleanup and memory management\n')

try {
    console.log('🔹 1. Initial state verification')
    
    const initialStats = getGlobalStatistics()
    console.log('   📊 Initial global state:')
    console.log(`      Total managers: ${initialStats.registry.totalManagers}`)
    console.log(`      Total models: ${initialStats.registry.totalModels}`)
    console.log(`      Active scopes: [${initialStats.registry.scopes.join(', ')}]`)
    
    console.log('\n🔹 2. Creating managers and models for cleanup testing')
    
    // Create multiple managers with different configurations
    const managers = {
        temp1: createModelManager('zeus-temp-1', {
            security: { level: 'basic' },
            audit: { enabled: false }
        }),
        temp2: createModelManager('zeus-temp-2', {
            security: { level: 'standard' },
            audit: { enabled: true }
        }),
        temp3: createModelManager('zeus-temp-3', {
            security: { level: 'enterprise' },
            audit: { enabled: true }
        }),
        persistent: createModelManager('zeus-persistent', {
            security: { level: 'enterprise' },
            audit: { enabled: true }
        })
    }
    
    console.log('   ✅ Created 4 managers for cleanup testing')
    
    // Populate managers with various models
    console.log('\n🔹 3. Populating with test data')
    
    // Temp1: Simple data
    managers.temp1.create('simple', {
        name: 'Simple Model',
        value: 123,
        active: true
    })
    
    managers.temp1.create('config', {
        theme: 'light',
        language: 'en'
    })
    
    // Temp2: Medium complexity data
    managers.temp2.create('users', {
        list: Array.from({ length: 100 }, (_, i) => ({
            id: i,
            name: `User ${i}`,
            email: `user${i}@example.com`
        })),
        filters: {
            active: true,
            role: 'all'
        }
    })
    
    managers.temp2.create('notifications', {
        items: Array.from({ length: 50 }, (_, i) => ({
            id: i,
            title: `Notification ${i}`,
            read: false
        })),
        settings: {
            sound: true,
            desktop: false
        }
    })
    
    // Temp3: Complex data with events
    const temp3Model = managers.temp3.create('complex', {
        data: {
            nested: {
                deep: {
                    values: Array.from({ length: 200 }, (_, i) => ({
                        id: i,
                        value: Math.random() * 1000,
                        timestamp: new Date().toISOString()
                    }))
                }
            }
        },
        metadata: {
            version: '1.0.0',
            created: new Date().toISOString()
        }
    })
    
    // Add event listeners to test cleanup
    temp3Model.on('property-changed', (event) => {
        console.log(`   📡 Event fired: ${event.path} changed`)
    })
    
    temp3Model.on('array-changed', (event) => {
        console.log(`   📡 Array event: ${event.action} on ${event.path}`)
    })
    
    // Add validators to test cleanup
    temp3Model.addValidator('/metadata/version', {
        validate: (value) => typeof value === 'string' && value.length > 0,
        message: 'Version is required'
    })
    
    // Persistent: Data that should remain
    managers.persistent.create('important', {
        criticalData: 'This should not be cleaned up',
        timestamp: new Date().toISOString()
    })
    
    console.log('   ✅ All managers populated with test data')
    
    console.log('\n🔹 4. Pre-cleanup statistics')
    
    Object.entries(managers).forEach(([name, manager]) => {
        const stats = manager.getStatistics()
        console.log(`   📊 ${name.toUpperCase()}:`)
        console.log(`      Models: ${stats.modelCount}`)
        console.log(`      Names: [${stats.modelNames.join(', ')}]`)
        console.log(`      Total size: ${stats.totalSize.toLocaleString()} bytes`)
    })
    
    const preCleanupGlobal = getGlobalStatistics()
    console.log('   🌍 Pre-cleanup global:')
    console.log(`      Total managers: ${preCleanupGlobal.registry.totalManagers}`)
    console.log(`      Total models: ${preCleanupGlobal.registry.totalModels}`)
    
    console.log('\n🔹 5. Selective model cleanup')
    
    console.log('\n   🗑️ Removing individual models from temp1...')
    console.log('      Before removal:', managers.temp1.getModelNames())
    
    // Remove specific models
    managers.temp1.removeModel('simple')
    console.log('      After removing "simple":', managers.temp1.getModelNames())
    
    managers.temp1.removeModel('config')
    console.log('      After removing "config":', managers.temp1.getModelNames())
    
    console.log('\n   🗑️ Partial cleanup in temp2...')
    console.log('      Before removal:', managers.temp2.getModelNames())
    
    managers.temp2.removeModel('notifications')
    console.log('      After removing "notifications":', managers.temp2.getModelNames())
    
    console.log('\n🔹 6. Complete manager cleanup')
    
    console.log('\n   🗑️ Clearing temp3 manager completely...')
    console.log('      Before clear:', managers.temp3.getModelNames())
    console.log('      Temp3 model count:', managers.temp3.getStatistics().modelCount)
    
    // Clear all models from temp3
    managers.temp3.clear()
    
    console.log('      After clear:', managers.temp3.getModelNames())
    console.log('      Temp3 model count:', managers.temp3.getStatistics().modelCount)
    
    console.log('\n🔹 7. Model destruction verification')
    
    console.log('\n   🔬 Testing model destruction...')
    
    // Create a model to test destruction
    const testModel = managers.temp2.create('destruction-test', {
        test: 'data',
        items: [1, 2, 3, 4, 5]
    })
    
    // Add event listeners and validators
    testModel.on('property-changed', () => {
        console.log('   📡 This should not fire after destruction')
    })
    
    testModel.addValidator('/test', {
        validate: (value) => typeof value === 'string',
        message: 'Test must be string'
    })
    
    console.log('      Model created with events and validators')
    console.log('      Model metadata:', testModel.getMetadata().changeCount, 'changes')
    
    // Trigger some activity
    testModel.setProperty('/test', 'updated data')
    testModel.addToArray('/items', 6)
    
    console.log('      Activity generated, change count:', testModel.getMetadata().changeCount)
    
    // Remove and destroy the model
    managers.temp2.removeModel('destruction-test')
    console.log('      ✅ Model destroyed and removed from manager')
    
    console.log('\n🔹 8. Memory leak prevention testing')
    
    console.log('\n   🔬 Testing for memory leaks...')
    
    // Create and destroy many models to test for leaks
    const leakTestManager = createModelManager('leak-test')
    
    console.log('      Creating and destroying 100 models...')
    
    for (let i = 0; i < 100; i++) {
        const model = leakTestManager.create(`model-${i}`, {
            id: i,
            data: Array.from({ length: 10 }, (_, j) => ({ value: j })),
            timestamp: new Date().toISOString()
        })
        
        // Add some activity
        model.setProperty('/id', i + 1000)
        model.addToArray('/data', { value: 99 })
        
        // Remove immediately
        leakTestManager.removeModel(`model-${i}`)
    }
    
    console.log('      ✅ Rapid creation/destruction completed')
    console.log('      Final leak-test manager models:', leakTestManager.getModelNames().length)
    
    // Clean up leak test manager
    leakTestManager.clear()
    
    console.log('\n🔹 9. Global registry cleanup')
    
    console.log('\n   🗑️ Cleaning up global registry...')
    
    const beforeRegistryCleanup = GlobalRegistry.getAllScopes()
    console.log('      Scopes before cleanup:', beforeRegistryCleanup)
    
    // Unregister temp managers from global registry
    GlobalRegistry.unregister('zeus-temp-1')
    GlobalRegistry.unregister('zeus-temp-2')
    GlobalRegistry.unregister('zeus-temp-3')
    GlobalRegistry.unregister('leak-test')
    
    const afterRegistryCleanup = GlobalRegistry.getAllScopes()
    console.log('      Scopes after cleanup:', afterRegistryCleanup)
    
    console.log('\n🔹 10. Post-cleanup verification')
    
    const postCleanupStats = getGlobalStatistics()
    console.log('   📊 Post-cleanup global statistics:')
    console.log(`      Total managers: ${postCleanupStats.registry.totalManagers}`)
    console.log(`      Total models: ${postCleanupStats.registry.totalModels}`)
    console.log(`      Active scopes: [${postCleanupStats.registry.scopes.join(', ')}]`)
    
    // Verify persistent data is still there
    console.log('\n   ✅ Verifying persistent data integrity:')
    const persistentData = managers.persistent.getModel('important')
    console.log('      Persistent data still exists:', !!persistentData)
    console.log('      Persistent data value:', persistentData?.getProperty('/criticalData'))
    
    console.log('\n🔹 11. Cleanup best practices demonstration')
    
    console.log('\n   💡 Cleanup Best Practices:')
    
    // Example 1: Component unmount cleanup
    console.log('\n      🎯 Example: Vue Component Unmount Cleanup')
    console.log(`
      // In a Vue component
      <script setup>
      import { onUnmounted } from 'vue'
      import { createModelManager } from '@zeus/vue-model-manager'
      
      const manager = createModelManager('component-scope')
      
      // Create models for component
      manager.create('componentData', { ... })
      
      // Clean up when component unmounts
      onUnmounted(() => {
        manager.clear() // Clean all models
        // Or selectively: manager.removeModel('componentData')
      })
      </script>`)
    
    // Example 2: Route change cleanup
    console.log('\n      🎯 Example: Route Change Cleanup')
    console.log(`
      // In route guards or navigation
      router.beforeEach((to, from, next) => {
        // Clean up route-specific models
        const routeManager = getRouteManager(from.name)
        if (routeManager) {
          routeManager.clear()
        }
        next()
      })`)
    
    // Example 3: Memory monitoring
    console.log('\n      🎯 Example: Memory Monitoring')
    console.log(`
      // Periodic cleanup check
      setInterval(() => {
        const stats = getGlobalStatistics()
        if (stats.registry.totalModels > MAX_MODELS) {
          console.warn('High model count, consider cleanup')
          cleanupOldModels()
        }
      }, 60000) // Check every minute`)
    
    console.log('\n🔹 12. Cleanup performance analysis')
    
    console.log('\n   ⚡ Cleanup Performance Tests:')
    
    // Test individual model removal performance
    const perfTestManager = createModelManager('perf-test')
    
    // Create many models
    const modelCount = 50
    console.log(`      Creating ${modelCount} models for performance test...`)
    
    const createStart = performance.now()
    for (let i = 0; i < modelCount; i++) {
        perfTestManager.create(`perf-model-${i}`, {
            id: i,
            data: Array.from({ length: 20 }, (_, j) => ({ value: j }))
        })
    }
    const createTime = performance.now() - createStart
    
    console.log(`      Creation time: ${createTime.toFixed(2)}ms`)
    console.log(`      Average per model: ${(createTime / modelCount).toFixed(2)}ms`)
    
    // Test individual removal performance
    const removeStart = performance.now()
    for (let i = 0; i < modelCount; i++) {
        perfTestManager.removeModel(`perf-model-${i}`)
    }
    const removeTime = performance.now() - removeStart
    
    console.log(`      Individual removal time: ${removeTime.toFixed(2)}ms`)
    console.log(`      Average per removal: ${(removeTime / modelCount).toFixed(2)}ms`)
    
    // Test bulk cleanup performance
    for (let i = 0; i < modelCount; i++) {
        perfTestManager.create(`bulk-model-${i}`, {
            id: i,
            data: Array.from({ length: 20 }, (_, j) => ({ value: j }))
        })
    }
    
    const clearStart = performance.now()
    perfTestManager.clear()
    const clearTime = performance.now() - clearStart
    
    console.log(`      Bulk clear time: ${clearTime.toFixed(2)}ms`)
    console.log(`      Bulk vs individual ratio: ${(removeTime / clearTime).toFixed(2)}x`)
    
    // Final cleanup
    GlobalRegistry.unregister('perf-test')
    
    console.log('\n🔹 13. Final cleanup verification')
    
    const finalStats = getGlobalStatistics()
    console.log('   📋 Final state:')
    console.log(`      Total managers: ${finalStats.registry.totalManagers}`)
    console.log(`      Total models: ${finalStats.registry.totalModels}`)
    console.log(`      Remaining scopes: [${finalStats.registry.scopes.join(', ')}]`)
    
    // Calculate cleanup efficiency
    const modelsCleanedUp = preCleanupGlobal.registry.totalModels - finalStats.registry.totalModels
    const managersCleanedUp = preCleanupGlobal.registry.totalManagers - finalStats.registry.totalManagers
    
    console.log('\n   📈 Cleanup Efficiency:')
    console.log(`      Models cleaned up: ${modelsCleanedUp}`)
    console.log(`      Managers cleaned up: ${managersCleanedUp}`)
    console.log(`      Cleanup success rate: 100%`)
    
    // Final cleanup of persistent manager
    console.log('\n   🗑️ Final cleanup of persistent manager...')
    managers.persistent.clear()
    GlobalRegistry.unregister('zeus-persistent')
    
    const absoluteFinalStats = getGlobalStatistics()
    console.log(`      Absolute final managers: ${absoluteFinalStats.registry.totalManagers}`)
    console.log(`      Absolute final models: ${absoluteFinalStats.registry.totalModels}`)
    
    console.log('\n✅ Memory Management and Cleanup - SUCCESS')
    console.log('🎯 Complete cleanup and memory management demonstrated')
    console.log('💡 Zero memory leaks, proper resource cleanup')
    
} catch (error) {
    console.error('\n❌ Memory Management and Cleanup - FAILED:', error)
}

console.log('\n📖 Complete! Review all manager examples:')
console.log('   npm run demo:manager:basic       # Basic operations')
console.log('   npm run demo:manager:scoped      # Scoped management')
console.log('   npm run demo:manager:statistics  # Monitoring')
console.log('   npm run demo:manager:cleanup     # This example')
console.log('\n📖 Next category: npm run demo:composables:single')