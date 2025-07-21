// examples/05-reactivity/reactive-comparison.ts
// Purpose: Comparación entre reactividad de JsonModel vs Pinia y Vuex (simplificado)

import { createModelManager, setComposableScope, useModel } from '../../src'
import { computed } from 'vue'

console.log('📊 Reactivity Comparison')
console.log('=========================')

try {
  // Configurar scope y manager
  const manager = createModelManager('reactivity-comparison')
  setComposableScope('reactivity-comparison')

  // Crear modelo
  manager.create('user', {
    name: 'Carlos Ruiz',
    email: 'carlos@zeus.com',
    loginCount: 42
  })

  // useModel: ComputedRef reactivo directo
  const userName = useModel<string>('user', '/name')
  const loginCount = useModel<number>('user', '/loginCount')

  // Comparar con computed() tradicional (más verboso)
  const userGreeting = computed(() => `Hola ${userName.value}, has iniciado sesión ${loginCount.value} veces`)

  console.log('🔍 Reactividad con Zeus Vue Model Manager:')
  console.log('   Nombre:', userName.value)
  console.log('   Logins:', loginCount.value)
  console.log('   Mensaje:', userGreeting.value)

  console.log('\n📚 Comparativa con otras opciones:')
  console.log(`
--------------------------------------------
📦 Pinia (state management)
--------------------------------------------
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    name: 'Carlos Ruiz',
    loginCount: 42
  }),
  getters: {
    greeting: (state) => \`Hola \${state.name}, has iniciado sesión \${state.loginCount} veces\`
  }
})

const store = useUserStore()
store.name = 'Carlos R.'
console.log(store.greeting) // reactive

--------------------------------------------
📦 Vuex (store centralizada)
--------------------------------------------
const store = new Vuex.Store({
  state: {
    user: {
      name: 'Carlos Ruiz',
      loginCount: 42
    }
  },
  getters: {
    greeting: state => \`Hola \${state.user.name}, has iniciado sesión \${state.user.loginCount} veces\`
  }
})

store.commit('updateName', 'Carlos R.') // requiere mutation
console.log(store.getters.greeting)
`)

  console.log('\n✅ Comparación completada. Zeus VM destaca por:')
  console.log('   - 🔁 Sin mutaciones ni stores externos')
  console.log('   - 🚀 Reactividad inmediata vía ComputedRef')
  console.log('   - 🔄 Actualización bidireccional desde v-model')
  console.log('   - 🧠 Tipado fuerte en cada propiedad')

} catch (error) {
  console.error('❌ Error en reactive-comparison.ts:', error)
}
