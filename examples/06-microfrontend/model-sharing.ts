// examples/06-microfrontend/model-sharing.ts
// 🎯 Model Sharing Between Microfrontends
// Purpose: Demonstrates sharing models across scopes using GlobalRegistry
// Run: npm run demo:microfrontend:sharing

import {
  createModelManager,
  shareModelBetweenMicrofrontends,
  getModelFromMicrofrontend,
  setComposableScope,
  useModel
} from '../../src/index'

console.log('🎯 Model Sharing Between Microfrontends')
console.log('='.repeat(50))

try {
  console.log('🔹 1. Setup: Creating source and target scopes')

  // Scope A (e.g. "header")
  const managerA = createModelManager('header', {
    audit: { enabled: true }
  })
  const themeModel = managerA.create('theme', {
    current: 'sap_horizon',
    darkMode: false
  })
  console.log('   ✅ Theme model created in "header" scope')

  // Scope B (e.g. "settings")
  const managerB = createModelManager('settings')

  console.log('\n🔹 2. Sharing theme model from "header" → "settings"')
  const success = shareModelBetweenMicrofrontends('header', 'settings', 'theme')

  if (!success) {
    console.error('❌ Failed to share model')
    process.exit(1)
  }

  console.log('   ✅ Model shared successfully')

  console.log('\n🔹 3. Accessing shared model in "settings" scope')

  setComposableScope('settings')
  const themeName = useModel<string>('theme', '/current')
  const darkModeEnabled = useModel<boolean>('theme', '/darkMode')

  console.log('   🎨 theme.current:', themeName.value)
  console.log('   🌙 darkMode:', darkModeEnabled.value)

  console.log('\n🔹 4. Updating model from "settings" scope')

  themeName.value = 'sap_fiori_3_dark'
  darkModeEnabled.value = true

  console.log('   🔄 Updated theme.current:', themeName.value)
  console.log('   🔄 Updated darkMode:', darkModeEnabled.value)

  console.log('\n🔹 5. Verifying synchronization in source scope')

  const updatedModel = getModelFromMicrofrontend('settings', 'header', 'theme')
  if (updatedModel) {
    console.log('   🎯 Verified from "header":', updatedModel.getData())
  } else {
    console.warn('   ⚠ Could not fetch model from source')
  }

  console.log('\n✅ Model Sharing Demo - SUCCESS')
} catch (err) {
  console.error('❌ Model Sharing Demo - FAILED:', err)
}
