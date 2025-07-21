// examples/05-reactivity/computed-properties.ts
// Purpose: Uso de Vue computed() con JsonModel para derivar estado reactivo

import { computed } from 'vue'
import { createModelManager, setComposableScope, useModels } from '../../src'

console.log('🧠 Reactivity: Computed Properties')
console.log('==================================')

try {
  // 1. Crear manager y establecer scope
  const manager = createModelManager('reactivity-computed-demo')
  setComposableScope('reactivity-computed-demo')

  // 2. Crear modelo
  manager.create('user', {
    profile: {
      name: 'Ana García',
      email: 'ana.garcia@zeus.com',
      department: 'Ingeniería',
      role: 'Developer'
    },
    permissions: {
      isAdmin: false,
      canEdit: true,
      canDelete: false
    },
    activity: {
      loginCount: 27,
      lastLogin: '2025-07-18T16:42:00Z'
    }
  })

  // 3. Acceder al modelo con magic proxy
  const { user } = useModels(['user'])

  // 4. Definir propiedades computadas derivadas
  const isPrivileged = computed(() => user.permissions.isAdmin || user.permissions.canDelete)
const userInitials = computed(() =>
  user.profile.name
    .split(' ')
    .map((p: string) => p[0])
    .join('')
    .toUpperCase()
)

  const loginMessage = computed(() =>
    `Bienvenido ${user.profile.name}, iniciaste sesión ${user.activity.loginCount} veces`
  )

  // 5. Mostrar valores computados
  console.log('🔍 Propiedades computadas:')
  console.log('   Iniciales:', userInitials.value)
  console.log('   ¿Privilegiado?:', isPrivileged.value)
  console.log('   Mensaje:', loginMessage.value)

  // 6. Ejemplo de template
  console.log(`
📝 Vue Template:

<template>
  <div>
    <h2>{{ userInitials }}</h2>
    <p>{{ loginMessage }}</p>
    <ui5-badge color-scheme="1" v-if="isPrivileged">Privilegiado</ui5-badge>
  </div>
</template>

<script setup>
import { useModels } from '@zeus/vue-model-manager'
import { computed } from 'vue'

setComposableScope('reactivity-computed-demo')
const { user } = useModels(['user'])

const isPrivileged = computed(() => user.permissions.isAdmin || user.permissions.canDelete)
const userInitials = computed(() => user.profile.name.split(' ').map(p => p[0]).join('').toUpperCase())
const loginMessage = computed(() => \`Bienvenido \${user.profile.name}, iniciaste sesión \${user.activity.loginCount} veces\`)
</script>
`)

  console.log('\n✅ computed-properties.ts ejecutado con éxito')

} catch (error) {
  console.error('❌ Error en computed-properties.ts:', error)
}
