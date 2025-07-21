// 📊 ModelManager - Statistics and Monitoring
// Purpose: Demonstrates monitoring and performance tracking
// Run: npm run demo:manager:statistics

import { createModelManager, getGlobalStatistics } from '../../src/index'

console.log('📊 ModelManager - Statistics and Monitoring')
console.log('=' .repeat(50))
console.log('🎯 This shows monitoring and performance capabilities\n')

try {
    console.log('🔹 1. Setting up managers for monitoring')
    
    // Create multiple managers to monitor
    const managers = {
        frontend: createModelManager('zeus-frontend', {
            security: { level: 'standard' },
            audit: { enabled: true }
        }),
        backend: createModelManager('zeus-backend', {
            security: { level: 'enterprise' },
            audit: { enabled: true }
        }),
        mobile: createModelManager('zeus-mobile', {
            security: { level: 'basic' },
            audit: { enabled: false }
        })
    }
    
    console.log('   ✅ Created 3 managers for monitoring')
    
    console.log('\n🔹 2. Populating with different data sizes')
    
    // Frontend models (medium size)
    managers.frontend.create('ui', {
        components: Array.from({ length: 50 }, (_, i) => ({
            id: `comp-${i}`,
            name: `Component ${i}`,
            type: i % 3 === 0 ? 'form' : i % 3 === 1 ? 'table' : 'chart',
            active: Math.random() > 0.3
        })),
        theme: {
            primary: '#0070f3',
            secondary: '#666666',
            success: '#00c851',
            warning: '#ff8800',
            danger: '#ff4444'
        }
    })
    
    managers.frontend.create('routing', {
        routes: Array.from({ length: 25 }, (_, i) => ({
            path: `/route-${i}`,
            component: `Component${i}`,
            meta: { requiresAuth: i % 2 === 0 }
        })),
        history: Array.from({ length: 100 }, (_, i) => ({
            path: `/visited-${i}`,
            timestamp: new Date(Date.now() - i * 60000).toISOString()
        }))
    })
    
    // Backend models (large size)
    managers.backend.create('database', {
        connections: Array.from({ length: 10 }, (_, i) => ({
            id: `conn-${i}`,
            host: `db-${i}.zeus.com`,
            port: 5432 + i,
            database: `zeus_db_${i}`,
            active: true,
            pool: {
                min: 2,
                max: 20,
                idle: 30000
            }
        })),
        queries: Array.from({ length: 200 }, (_, i) => ({
            id: i,
            sql: `SELECT * FROM table_${i % 10} WHERE id = ${i}`,
            duration: Math.random() * 1000,
            timestamp: new Date(Date.now() - i * 1000).toISOString()
        }))
    })
    
    managers.backend.create('cache', {
        redis: {
            servers: Array.from({ length: 5 }, (_, i) => ({
                host: `redis-${i}.zeus.com`,
                port: 6379,
                memory: Math.floor(Math.random() * 1000) + 500
            }))
        },
        entries: Array.from({ length: 500 }, (_, i) => ({
            key: `cache:key:${i}`,
            value: `cached_value_${i}`,
            ttl: Math.floor(Math.random() * 3600),
            hits: Math.floor(Math.random() * 100)
        }))
    })
    
    // Mobile models (small size)
    managers.mobile.create('device', {
        info: {
            platform: 'iOS',
            version: '17.2',
            model: 'iPhone 15 Pro',
            uuid: 'A1B2C3D4-E5F6-7G8H-9I0J-K1L2M3N4O5P6'
        },
        storage: {
            total: 256000000000,
            used: 125000000000,
            available: 131000000000
        }
    })
    
    managers.mobile.create('sync', {
        lastSync: new Date().toISOString(),
        pending: Array.from({ length: 15 }, (_, i) => ({
            id: i,
            type: 'data_update',
            retries: 0
        }))
    })
    
    console.log('   ✅ All managers populated with test data')
    
    console.log('\n🔹 3. Individual manager statistics')
    
    Object.entries(managers).forEach(([name, manager]) => {
        const stats = manager.getStatistics()
        console.log(`   📊 ${name.toUpperCase()} Manager Statistics:`)
        console.log(`      Scope: ${stats.scope}`)
        console.log(`      Models: ${stats.modelCount}`)
        console.log(`      Model names: [${stats.modelNames.join(', ')}]`)
        console.log(`      Total size: ${stats.totalSize.toLocaleString()} bytes`)
        console.log(`      Average size per model: ${Math.round(stats.totalSize / stats.modelCount).toLocaleString()} bytes`)
    })
    
    console.log('\n🔹 4. Global registry statistics')
    
    const globalStats = getGlobalStatistics()
    console.log('   🌍 Global Statistics:')
    console.log('      Registry info:', JSON.stringify(globalStats.registry, null, 2))
    console.log('      Manager details:', JSON.stringify(globalStats.managers, null, 2))
    
    console.log('\n🔹 5. Model-level detailed statistics')
    
    // Analyze each model in each manager
    Object.entries(managers).forEach(([managerName, manager]) => {
        console.log(`\n   🔍 ${managerName.toUpperCase()} Model Details:`)
        
        manager.getModelNames().forEach(modelName => {
            const model = manager.getModel(modelName)
            if (model) {
                const metadata = model.getMetadata()
                console.log(`      📄 ${modelName}:`)
                console.log(`         Size: ${metadata.size.toLocaleString()} bytes`)
                console.log(`         Paths: ${metadata.paths.length}`)
                console.log(`         Changes: ${metadata.changeCount}`)
                console.log(`         Created: ${metadata.created.toLocaleTimeString()}`)
                console.log(`         Modified: ${metadata.lastModified.toLocaleTimeString()}`)
                console.log(`         Age: ${Math.round((Date.now() - metadata.created.getTime()) / 1000)}s`)
            }
        })
    })
    
    console.log('\n🔹 6. Performance comparison')
    
    const performanceTests = [
        {
            name: 'Model Creation',
            test: (manager: any) => {
                const start = performance.now()
                manager.create('perf-test', { data: 'test' })
                manager.removeModel('perf-test')
                return performance.now() - start
            }
        },
        {
            name: 'Data Access',
            test: (manager: any) => {
                const model = manager.getModel(manager.getModelNames()[0])
                const start = performance.now()
                for (let i = 0; i < 100; i++) {
                    model?.getData()
                }
                return performance.now() - start
            }
        },
        {
            name: 'Statistics Generation',
            test: (manager: any) => {
                const start = performance.now()
                for (let i = 0; i < 10; i++) {
                    manager.getStatistics()
                }
                return performance.now() - start
            }
        }
    ]
    
    console.log('   ⚡ Performance Tests:')
    
    performanceTests.forEach(({ name, test }) => {
        console.log(`\n      🏃 ${name}:`)
        
        Object.entries(managers).forEach(([managerName, manager]) => {
            const duration = test(manager)
            console.log(`         ${managerName}: ${duration.toFixed(2)}ms`)
        })
    })
    
    console.log('\n🔹 7. Memory usage analysis')
    
    // Calculate memory usage patterns
    const memoryAnalysis = Object.entries(managers).map(([name, manager]) => {
        const stats = manager.getStatistics()
        const allModels = manager.getAllModels()
        
        let totalPaths = 0
        let totalChanges = 0
        let avgModelAge = 0
        
        Object.values(allModels).forEach(model => {
            const metadata = model.getMetadata()
            totalPaths += metadata.paths.length
            totalChanges += metadata.changeCount
            avgModelAge += (Date.now() - metadata.created.getTime()) / 1000
        })
        
        avgModelAge /= stats.modelCount
        
        return {
            name,
            scope: stats.scope,
            modelCount: stats.modelCount,
            totalSize: stats.totalSize,
            sizePerModel: Math.round(stats.totalSize / stats.modelCount),
            totalPaths,
            pathsPerModel: Math.round(totalPaths / stats.modelCount),
            totalChanges,
            changesPerModel: Math.round(totalChanges / stats.modelCount),
            avgModelAge: Math.round(avgModelAge)
        }
    })
    
    console.log('   💾 Memory Usage Analysis:')
    memoryAnalysis.forEach(analysis => {
        console.log(`      📊 ${analysis.name.toUpperCase()}:`)
        console.log(`         Models: ${analysis.modelCount}`)
        console.log(`         Total size: ${analysis.totalSize.toLocaleString()} bytes`)
        console.log(`         Size per model: ${analysis.sizePerModel.toLocaleString()} bytes`)
        console.log(`         Total paths: ${analysis.totalPaths}`)
        console.log(`         Paths per model: ${analysis.pathsPerModel}`)
        console.log(`         Total changes: ${analysis.totalChanges}`)
        console.log(`         Changes per model: ${analysis.changesPerModel}`)
        console.log(`         Avg model age: ${analysis.avgModelAge}s`)
    })
    
    console.log('\n🔹 8. Resource optimization recommendations')
    
    console.log('   💡 Optimization Recommendations:')
    
    memoryAnalysis.forEach(analysis => {
        console.log(`\n      🔧 ${analysis.name.toUpperCase()}:`)
        
        if (analysis.sizePerModel > 50000) {
            console.log('         ⚠️ Large model size - consider data pagination')
        } else {
            console.log('         ✅ Model size is optimal')
        }
        
        if (analysis.pathsPerModel > 100) {
            console.log('         ⚠️ High path count - consider data restructuring')
        } else {
            console.log('         ✅ Path count is reasonable')
        }
        
        if (analysis.changesPerModel > 20) {
            console.log('         ℹ️ High change frequency - good reactive usage')
        } else {
            console.log('         ℹ️ Low change frequency - mostly static data')
        }
        
        if (analysis.avgModelAge > 300) {
            console.log('         ℹ️ Old models - consider cleanup if no longer needed')
        } else {
            console.log('         ✅ Recent models - actively used')
        }
    })
    
    console.log('\n🔹 9. Real-time monitoring simulation')
    
    console.log('\n   📡 Simulating real-time updates...')
    
    // Simulate real-time updates and monitor impact
    const monitoringInterval = setInterval(() => {
        // Update some data in each manager
        const frontendUI = managers.frontend.getModel('ui')
        frontendUI?.setProperty('/theme/primary', `#${Math.floor(Math.random()*16777215).toString(16)}`)
        
        const backendCache = managers.backend.getModel('cache')
        backendCache?.addToArray('/entries', {
            key: `cache:key:${Date.now()}`,
            value: `cached_value_${Date.now()}`,
            ttl: 3600,
            hits: 0
        })
        
        const mobileSync = managers.mobile.getModel('sync')
        mobileSync?.setProperty('/lastSync', new Date().toISOString())
        
        // Log current statistics
        const currentGlobalStats = getGlobalStatistics()
        console.log(`   📊 [${new Date().toLocaleTimeString()}] Global models: ${currentGlobalStats.registry.totalModels}, Total managers: ${currentGlobalStats.registry.totalManagers}`)
        
    }, 2000)
    
    // Stop monitoring after 10 seconds
    setTimeout(() => {
        clearInterval(monitoringInterval)
        console.log('   ⏹️ Real-time monitoring stopped')
        
        console.log('\n🔹 10. Final statistics summary')
        
        const finalStats = getGlobalStatistics()
        console.log('   📋 Final Summary:')
        console.log(`      Total managers: ${finalStats.registry.totalManagers}`)
        console.log(`      Total models: ${finalStats.registry.totalModels}`)
        console.log(`      Active scopes: [${finalStats.registry.scopes.join(', ')}]`)
        
        // Calculate total memory usage
        let totalMemory = 0
        Object.values(managers).forEach(manager => {
            totalMemory += manager.getStatistics().totalSize
        })
        
        console.log(`      Total memory usage: ${totalMemory.toLocaleString()} bytes`)
        console.log(`      Average memory per manager: ${Math.round(totalMemory / Object.keys(managers).length).toLocaleString()} bytes`)
        
        console.log('\n✅ Statistics and Monitoring - SUCCESS')
        console.log('🎯 Complete monitoring and performance tracking capabilities')
        
    }, 10000)
    
} catch (error) {
    console.error('\n❌ Statistics and Monitoring - FAILED:', error)
}

console.log('\n📖 Next: npm run demo:manager:cleanup')