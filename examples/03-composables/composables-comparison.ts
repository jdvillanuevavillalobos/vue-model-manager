// 📊 Composables Comparison - useModel vs useModels
// Purpose: Compare ergonomics and performance of composables
// Run: npm run demo:composables:comparison

import {
  createModelManager,
  setComposableScope,
  useModel,
  useModels
} from '../../src/index'

console.log('📊 Composables Comparison - useModel vs useModels')
console.log('='.repeat(60))

try {
  console.log('🔹 1. Setup environment')

  const manager = createModelManager('comparison-scope')
  setComposableScope('comparison-scope')

  manager.create('user', {
    profile: {
      name: 'David',
      email: 'david@zeus.com'
    },
    settings: {
      theme: 'sap_horizon',
      notifications: {
        email: true
      }
    }
  })

  manager.create('app', {
    info: {
      name: 'Zeus IDP',
      version: '3.0.0'
    }
  })

  console.log('   ✅ Models created: ', manager.getModelNames())

  console.log('\n🔹 2. Access with useModel')

  const userName = useModel<string>('user', '/profile/name')
  const userEmail = useModel<string>('user', '/profile/email')
  const appName = useModel<string>('app', '/info/name')

  console.log('   🧠 useModel values:')
  console.log('      userName.value:', userName.value)
  console.log('      userEmail.value:', userEmail.value)
  console.log('      appName.value:', appName.value)

  console.log('\n🔹 3. Access with useModels')

  const { user, app } = useModels(['user', 'app'])

  console.log('   ✨ useModels proxy values:')
  console.log('      user.profile.name:', user.profile.name)
  console.log('      user.profile.email:', user.profile.email)
  console.log('      app.info.name:', app.info.name)

  console.log('\n🔹 4. Update properties and sync check')

  userName.value = 'David R. Silva'
  user.settings.theme = 'sap_fiori_3'

  console.log('   ✅ After updates:')
  console.log('      useModel - userName:', userName.value)
  console.log('      useModels - user.profile.name:', user.profile.name)
  console.log('      useModels - user.settings.theme:', user.settings.theme)

  console.log('\n🔹 5. Performance test')

  const startModel = performance.now()
  for (let i = 0; i < 1000; i++) {
    const _ = useModel<string>('user', '/profile/name').value
  }
  const timeModel = performance.now() - startModel

  const startModels = performance.now()
  for (let i = 0; i < 1000; i++) {
    const _ = user.profile.name
  }
  const timeModels = performance.now() - startModels

  console.log(`   ⏱ useModel: ${timeModel.toFixed(2)}ms (1000 reads)`)
  console.log(`   ⏱ useModels: ${timeModels.toFixed(2)}ms (1000 reads)`)

  console.log('\n🔹 6. Summary Comparison')

  console.table([
    {
      feature: 'API Simplicity',
      useModel: '✅ Básico y explícito',
      useModels: '✨ Mágico y elegante'
    },
    {
      feature: 'Escalabilidad',
      useModel: '⚠️ Repetitivo',
      useModels: '✅ Agrupado por modelo'
    },
    {
      feature: 'Desempeño (lectura)',
      useModel: `${timeModel.toFixed(2)}ms`,
      useModels: `${timeModels.toFixed(2)}ms`
    },
    {
      feature: 'Mutabilidad',
      useModel: '✅ ComputedRef con setter',
      useModels: '✅ Proxy directo'
    },
    {
      feature: 'Recomendado para',
      useModel: 'Bindings individuales',
      useModels: 'Componentes completos'
    }
  ])

  console.log('\n✅ Composables Comparison - SUCCESS')

} catch (err) {
  console.error('\n❌ Composables Comparison - FAILED:', err)
}
