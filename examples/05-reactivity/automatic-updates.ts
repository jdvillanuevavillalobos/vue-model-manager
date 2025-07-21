// examples/05-reactivity/automatic-updates.ts
// Purpose: Demuestra actualizaciones automáticas de UI sin necesidad de watch()

import { createModelManager, setComposableScope, useModels } from '../../src'

console.log('⚡ Reactivity: Automatic Updates')
console.log('===============================')

try {
  // 1. Crear manager y definir el scope
  const manager = createModelManager('reactivity-auto-demo')
  setComposableScope('reactivity-auto-demo')

  // 2. Crear modelo con datos observables
  manager.create('status', {
    user: {
      name: 'David Rodriguez',
      online: false,
      lastLogin: '2025-07-15T09:30:00Z'
    },
    session: {
      active: true,
      count: 3
    }
  })

  // 3. Obtener modelos con magic proxy
  const { status } = useModels(['status'])

  // 4. Mostrar valores actuales
  console.log('🔍 Estado inicial:')
  console.log('   - Usuario:', status.user.name)
  console.log('   - Online:', status.user.online)
  console.log('   - Sesiones activas:', status.session.count)

  // 5. Actualizar datos reactivamente
  status.user.online = true
  status.session.count++

  // 6. Mostrar después de los cambios
  console.log('\n🔁 Después de actualizar:')
  console.log('   - Online:', status.user.online)
  console.log('   - Sesiones activas:', status.session.count)

  // 7. Ejemplo de uso en Vue 3 template
  console.log(`
📝 Vue Template:

<template>
  <div>
    <p>👤 Usuario: {{ status.user.name }}</p>
    <p>🟢 Estado: 
      <span :style="{ color: status.user.online ? 'green' : 'gray' }">
        {{ status.user.online ? 'En línea' : 'Desconectado' }}
      </span>
    </p>
    <p>📊 Sesiones activas: {{ status.session.count }}</p>

    <ui5-button @click="status.session.count++">
      ➕ Nueva sesión
    </ui5-button>
  </div>
</template>

<script setup>
import { useModels, setComposableScope } from '@zeus/vue-model-manager'
setComposableScope('reactivity-auto-demo')
const { status } = useModels(['status'])
</script>
`)

  console.log('\n✅ automatic-updates.ts ejecutado con éxito')

} catch (error) {
  console.error('❌ Error en automatic-updates.ts:', error)
}
