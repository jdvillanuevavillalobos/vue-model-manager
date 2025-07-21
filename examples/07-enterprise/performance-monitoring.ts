// examples/07-enterprise/performance-monitoring.ts
// ⚡ Performance Monitoring - Enterprise Demo

import {
  createModelManager,
  setComposableScope,
  useModel,
  dumpGlobalState
} from '../../src/index'

console.log('⚡ Performance Monitoring - Enterprise Demo')
console.log('='.repeat(50))

try {
  // 1. Setup manager with audit enabled for logging
  const manager = createModelManager('perf-scope', {
    audit: { enabled: true },
    security: { level: 'enterprise' }
  })

  setComposableScope('perf-scope')

  // 2. Create heavy model for benchmarking
  const largeModel = manager.create('metrics', {
    data: Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      value: Math.random() * 100,
      timestamp: Date.now() - i * 1000
    }))
  })

  console.log('📊 Large model created: 10,000 entries')

  // 3. Measure access performance
  const ref = useModel<number>('metrics', '/data/500/value')

  const accessStart = performance.now()
  for (let i = 0; i < 1000; i++) {
    const _ = ref.value
  }
  const accessEnd = performance.now()
  console.log(`⏱️ Accessed ref 1000x in ${(accessEnd - accessStart).toFixed(2)}ms`)

  // 4. Measure update performance
  const updateStart = performance.now()
  for (let i = 0; i < 1000; i++) {
    ref.value = Math.random() * 100
  }
  const updateEnd = performance.now()
  console.log(`✏️ Updated ref 1000x in ${(updateEnd - updateStart).toFixed(2)}ms`)

  // 5. Internal statistics
  const stats = manager.getStatistics()
  console.log('📈 Manager stats:', stats)

  // 6. Dump complete registry state
  dumpGlobalState()

  console.log('\n✅ Performance Monitoring Demo Complete')

} catch (error) {
  console.error('❌ Performance Monitoring Demo Failed:', error)
}
