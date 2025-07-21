// examples/04-vue-integration/template-lists.ts
// Purpose: Renderizar listas usando useModels y v-for

import { createModelManager, setComposableScope, useModels } from '../../src'

console.log('📄 Template Lists Example')
console.log('==========================')

try {
  // 1. Crear manager y establecer el scope del composable
  const manager = createModelManager('template-lists-demo')
  setComposableScope('template-lists-demo')

  // 2. Crear modelo con una lista de usuarios
  manager.create('userList', {
    users: [
      { id: 1, name: 'Ana García', department: 'Engineering' },
      { id: 2, name: 'Carlos López', department: 'Design' },
      { id: 3, name: 'María Rodríguez', department: 'Engineering' }
    ],
    filter: {
      query: ''
    }
  })

  // 3. Acceder con useModels
  const { userList } = useModels(['userList'])

  // 4. Mostrar en consola los valores actuales
  console.log('🔍 Lista original:')
  userList.users.forEach((u: any) => console.log(`- ${u.name} (${u.department})`))

  // 5. Agregar nuevo usuario
  userList.users.push({ id: 4, name: 'Luis Sánchez', department: 'HR' })

  console.log('\n➕ Después de agregar usuario:')
  userList.users.forEach((u: any) => console.log(`- ${u.name} (${u.department})`))

  // 6. Código Vue SFC sugerido
  console.log(`
📝 Vue Template Sugerido:

<template>
  <div>
    <ui5-input 
      v-model="userList.filter.query"
      placeholder="Buscar usuarios..."
    />

    <ui5-list>
      <ui5-li 
        v-for="user in filteredUsers" 
        :key="user.id"
      >
        {{ user.name }} - {{ user.department }}
      </ui5-li>
    </ui5-list>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useModels, setComposableScope } from '@zeus/vue-model-manager'

setComposableScope('template-lists-demo')
const { userList } = useModels(['userList'])

const filteredUsers = computed(() => {
  const query = userList.filter.query.toLowerCase()
  return userList.users.filter(user =>
    user.name.toLowerCase().includes(query) ||
    user.department.toLowerCase().includes(query)
  )
})
</script>
  `)

  console.log('\n✅ template-lists.ts ejecutado con éxito')

} catch (error) {
  console.error('❌ Error en template-lists.ts:', error)
}
